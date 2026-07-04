# Security Specification - BNX Platform

This security specification details the critical data invariants, threat payloads (the "Dirty Dozen"), and the defense structure of the BNX platform's Firestore system.

## 1. Data Invariants

- **User Profile Isolation**: A user's profile can only be read, created, or updated by the authenticated owner (`request.auth.uid == userId`).
- **Relational Ownership constraint**: Applications and Essays must contain a `userId` field matching the authenticated user. Only the owner can read, update, or delete their application track or essay feedback.
- **Admin-Only Writing for Universities and Scholarships**: Only authorized admins (designated in rules by verifying `request.auth.token.email == 'naranbadrakh1013@gmail.com'`) can write (create, update, delete) `universities` and `scholarships`. All authenticated users can read them.
- **Strict Size Limits**: String fields of entities must be restricted in length to prevent "Denial of Wallet" resource consumption.

---

## 2. The "Dirty Dozen" Threat Payloads

Here are 12 malicious payloads designed to challenge identity, integrity, and safety:

### Payload 1: Profile Theft (Identity Spoofing)
- **Path**: `/users/user_abc`
- **Payload**: `{ "uid": "user_123", "name": "Fake Name" }`
- **Attempt**: Attacker `user_abc` tries to write to another user's document `user_123`.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 2: Admin Privilege Escalation
- **Path**: `/users/user_abc`
- **Payload**: `{ "uid": "user_abc", "name": "Attacker", "role": "admin", "isAdmin": true }`
- **Attempt**: Setting self-assigned privileges.
- **Expected Outcome**: `PERMISSION_DENIED` or ignored if restricted.

### Payload 3: Unauthorized Read of Other User's Profile (PII Leak)
- **Action**: Read document `/users/user_xyz` by user `user_abc`.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 4: Arbitrary University Creation (Spam Attack)
- **Path**: `/universities/uni_spam`
- **Payload**: `{ "name": "Fake Harvard", "country": "USA", "ranking": 1 }`
- **Attempt**: Non-admin user tries to write to `/universities`.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 5: Anonymous Track Hijacking
- **Path**: `/applications/app_123`
- **Payload**: `{ "userId": "user_victim", "universityId": "mit_01", "universityName": "MIT", "status": "Accepted" }`
- **Attempt**: Authenticated user tries to create an application with a victim's `userId`.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 6: Mutating Immutable Field (`createdAt`)
- **Path**: `/essays/essay_1`
- **Payload**: `{ "userId": "attacker_id", "title": "My Essay", "content": "Modified content", "createdAt": "2030-01-01T00:00:00Z" }`
- **Attempt**: Modifying immutable timestamp during an update.
- **Expected Outcome**: `PERMISSION_DENIED`

### Payload 7: Huge String Poisoning
- **Path**: `/users/user_abc`
- **Payload**: `{ "uid": "user_abc", "name": "A..." [size > 1MB] }`
- **Attempt**: Injecting extremely large payloads to cause resource exhaustion.
- **Expected Outcome**: `PERMISSION_DENIED` via size boundaries.

### Payload 8: Blanket Query Scraping
- **Action**: `allow list` without query parameters (e.g. fetching ALL user applications).
- **Attempt**: Requesting `/applications` without a filter on `userId`.
- **Expected Outcome**: `PERMISSION_DENIED` since list query must enforce `resource.data.userId == request.auth.uid`.

### Payload 9: Invalid Essay Score Injection
- **Path**: `/essays/essay_1`
- **Payload**: `{ "userId": "user_abc", "title": "My Essay", "content": "Hello", "scoreEstimate": "9.5" }`
- **Attempt**: Student writes or updates their own AI-generated score field (System-Only FIELD).
- **Expected Outcome**: `PERMISSION_DENIED` since AI fields can only be set during system/admin actions or must not be client-writable.

### Payload 10: State Skipping (Application Result Injection)
- **Path**: `/applications/app_123`
- **Payload**: `{ "userId": "user_abc", "universityId": "mit_01", "universityName": "MIT", "status": "Applied", "result": "Admitted" }`
- **Attempt**: Enforcing a direct "Admitted" result without proper process or admin verification.
- **Expected Outcome**: Strict state update gates.

### Payload 11: Orphaned Application Creation (Foreign Key Violation)
- **Path**: `/applications/app_123`
- **Payload**: `{ "userId": "user_abc", "universityId": "non_existent_uni", "universityName": "Invisible University" }`
- **Attempt**: Linking to non-existent university.
- **Expected Outcome**: Prevented by university check or input validations.

### Payload 12: Scholarship Budget Spoofing
- **Path**: `/scholarships/sch_123`
- **Payload**: `{ "name": "Fake Scholarship", "amount": "$10,000,000", "universityId": "foo" }`
- **Attempt**: Editing high value scholarships by standard students.
- **Expected Outcome**: `PERMISSION_DENIED`

---

## 3. Threat Mitigation Summary

Our Firestore Security Rules enforce these protections mathematically:
1. `request.auth.uid` matches the collection ID or the relational ownership UID.
2. Only `naranbadrakh1013@gmail.com` can perform writes on `/universities` and `/scholarships`.
3. Validation functions `isValidUserProfile`, `isValidApplication`, and `isValidEssay` enforce precise syntax, types, and maximum sizes on every write.
