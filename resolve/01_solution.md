# 01 - Ledger Smoke Solution

## Rubric Fit

- Problem clarity: High. The player sees a normal export function and signed admin session, but the trust boundary is ambiguous.
- Number of steps: High. Enumerate routes, exploit double decoding, recover signing secret, forge a cookie, then access admin.
- Required knowledge: High. Requires HTTP routing, URL encoding layers, HMAC-signed cookies, and source/config review.
- Tool usage: High. Browser or curl, encoding helpers, and a cookie/HMAC script are useful.
- Error tolerance: High. One wrong encoding level causes the traversal filter to block the request.
- Estimated solving time: High. Expected time is over 40 minutes for students without the intended insight.
- Hint dependency: High. Multiple hints may be needed around double encoding and cookie format.

## Exact Solution Path

1. Visit `/` and note `/download?name=readme.txt` plus `/admin`.
2. Check `/robots.txt`; it confirms `/download` and `/admin`.
3. Test traversal. Plain `../config.js` is blocked.
4. Use double encoding: `/download?name=%252e%252e%252fconfig.js`.
5. Read `SIGNING_SECRET` from the leaked config.
6. Recreate the session payload as base64url JSON: `{"user":"guest","role":"admin"}`.
7. Sign the payload with HMAC-SHA256 using the leaked secret.
8. Send `Cookie: session=<payload>.<signature>` to `/admin`.

Automated solver:

```sh
python3 resolve/solve_01.py http://localhost:8081
```
