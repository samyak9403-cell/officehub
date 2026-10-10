# Glazzarto Web Platform — Exploratory QA Bug Report

**Prepared by:** Samyak Jain  
**Target websites:** https://www.glazzarto.com and http://partner.glazzarto.com/  
**Report basis:** Tester observations and screenshots supplied with this report.  
**Test date / OS / browser / viewport:** Fill in the actual values before final submission.

> **Evidence integrity:** Embedded images are the screenshots supplied by the tester. They demonstrate the visible states shown, but do not independently establish unobserved root causes. For each issue, add the exact route, test date, browser/version, OS, and viewport. For email delivery, server/mail logs are needed to confirm backend behavior.

## Consolidated Bug Summary

| Bug ID  | Module                                     | Summary                                                    | Severity | Priority    |
| ------- | ------------------------------------------ | ---------------------------------------------------------- | -------- | ----------- |
| BUG-001 | Header / Branding                          | Logo dimensions differ between public and partner websites | Low      | P3 - Normal |
| BUG-002 | Header / Localization                      | Language selector missing from header                      | Medium   | P2 - High   |
| BUG-003 | Search                                     | Search suggestions do not appear while typing              | Low      | P3 - Normal |
| BUG-004 | Product listing / Price filter / Network   | HTTP 429 Too Many Requests while changing price range      | High     | P1 - High   |
| BUG-005 | Product listing / Design and color filters | Design/color filter selection does not appear as applied   | Medium   | P2 - High   |
| BUG-006 | Home page / Localization / Banner imagery  | Home-page image text does not change when language changes | Medium   | P2 - High   |
| BUG-007 | Account / Password reset email             | No email received when attempting password change/reset    | High     | P1 - High   |

Severity is provisional and should be adjusted based on impact and reproducibility. Search suggestions may be an enhancement rather than a defect unless required by the specification.

## BUG-001 — Logo dimensions differ between public and partner websites

- **Affected module:** Header / Branding
- **Affected URL:** https://www.glazzarto.com and http://partner.glazzarto.com/
- **Severity / Priority:** Low / P3 - Normal
- **Environment:** Record actual OS, browser/version, screen resolution, and device.
- **Steps to reproduce:** 1. Open both websites. 2. Compare the header logos at the same viewport size.
- **Expected result:** Logo dimensions and alignment should be visually consistent unless a documented brand/layout variation is intentional.
- **Actual result:** The tester reports that the logo sizes differ between the two websites.
- **Suggested fix:** Use consistent logo sizing rules and a shared asset where appropriate; preserve aspect ratio and verify responsive layouts.
- **Root cause analysis:** Not confirmed. Inspect each header component, image asset, and CSS.
- **Status:** Reported by tester; screenshot evidence supplied.

**Evidence — logo.jpg**

![Evidence for BUG-001](evidence/logo.jpg)

## BUG-002 — Language selector missing from header

- **Affected module:** Header / Localization
- **Affected URL:** Record the exact route/site where the selector was missing; supplied screenshot shows a language selector on one header.
- **Severity / Priority:** Medium / P2 - High
- **Environment:** Record actual OS, browser/version, screen resolution, and device.
- **Steps to reproduce:** 1. Open the affected site. 2. Inspect the desktop header. 3. Repeat on mobile and inspect collapsed navigation.
- **Expected result:** If language selection is supported on the affected site, the selector should be discoverable in the header or navigation.
- **Actual result:** The tester reports that the language selector is missing from the header on the affected website.
- **Suggested fix:** Confirm expected design; ensure selector is present and accessible on desktop/mobile if localization is supported.
- **Root cause analysis:** Not confirmed. The supplied screenshots appear to show differing header implementations; record which site lacks it.
- **Status:** Reported by tester; screenshot evidence supplied for language/header comparison.

**Evidence — language.jpg**

![Evidence for BUG-002](evidence/language.jpg)

## BUG-003 — Search suggestions do not appear while typing

- **Affected module:** Search
- **Affected URL:** Record the exact search page/route tested.
- **Severity / Priority:** Low / P3 - Normal
- **Environment:** Record actual OS, browser/version, screen resolution, and device.
- **Steps to reproduce:** 1. Focus the search field. 2. Type a partial product name. 3. Wait briefly and observe whether suggestions appear before submitting.
- **Expected result:** If autocomplete is a required feature, relevant suggestions should appear and be keyboard/pointer selectable.
- **Actual result:** No suggestions appear while typing, according to the tester.
- **Suggested fix:** Consider debounced autocomplete, loading/empty states, keyboard navigation, and cancellation of stale requests. Avoid a request per keystroke.
- **Root cause analysis:** Not confirmed; may be an enhancement unless autocomplete is in the product requirements.
- **Status:** Reported by tester; screenshot supplied.

**Evidence — search.jpg**

![Evidence for BUG-003](evidence/search.jpg)

## BUG-004 — HTTP 429 Too Many Requests while changing price range

- **Affected module:** Product listing / Price filter / Network
- **Affected URL:** Record the exact listing route and filter values.
- **Severity / Priority:** High / P1 - High
- **Environment:** Record actual OS, browser/version, screen resolution, and device.
- **Steps to reproduce:** 1. Open a listing page. 2. Open DevTools > Network. 3. Change the minimum/maximum price. 4. Observe product-fetch requests and response status. Do not deliberately flood the service.
- **Expected result:** Price changes should update results reliably; requests should be debounced/consolidated and rate limits handled gracefully.
- **Actual result:** The screenshot shows a console AxiosError indicating request failed with status code 429 and a page message 'Failed to load products'.
- **Suggested fix:** Debounce slider changes, prevent duplicate requests, cancel stale requests, and review rate-limit configuration. Keep rate limiting and show a helpful error/retry state.
- **Root cause analysis:** Not confirmed. Possible causes include excessive client requests, repeated effects, or restrictive server limits; verify request timing and server logs.
- **Status:** HTTP 429 visible in supplied screenshot.

**Evidence — 429.jpg**

![Evidence for BUG-004](evidence/429.jpg)

## BUG-005 — Design/color filter selection does not appear as applied

- **Affected module:** Product listing / Design and color filters
- **Affected URL:** Record exact listing route and selected filter values.
- **Severity / Priority:** Medium / P2 - High
- **Environment:** Record actual OS, browser/version, screen resolution, and device.
- **Steps to reproduce:** 1. Open a product listing. 2. Select a Design Type (e.g. Classic). 3. Observe selected state, applied-filter summary, and results. 4. Repeat with color.
- **Expected result:** Selected filters should be visibly marked, reflected in applied-filter state, and consistently affect the results. Clearing should restore results.
- **Actual result:** The tester reports that selected design/color filters do not appear as applied in the filtered view. Screenshot shows Design Type options and an empty-results state; it does not alone prove whether the backend query is wrong.
- **Suggested fix:** Check frontend filter state, selected controls/chips, API query parameter names/value formats, and results refresh behavior.
- **Root cause analysis:** Not confirmed; investigate UI state synchronization and API filter handling.
- **Status:** Reported by tester; screenshot supplied.

**Evidence — filtering.jpg**

![Evidence for BUG-005](evidence/filtering.jpg)

## BUG-006 — Home-page image text does not change when language changes

- **Affected module:** Home page / Localization / Banner imagery
- **Affected URL:** Record the exact home page and languages tested.
- **Severity / Priority:** Medium / P2 - High
- **Environment:** Record actual OS, browser/version, screen resolution, and device.
- **Steps to reproduce:** 1. Open the home page and note banner text. 2. Change the site language. 3. Compare the same banner after language change.
- **Expected result:** Banner text should be translated, or the correct localized banner asset should be selected.
- **Actual result:** The tester reports that text embedded in/associated with home-page images remains unchanged after changing language.
- **Suggested fix:** Prefer translatable HTML text over text baked into images; otherwise provide localized assets and connect them to language state.
- **Root cause analysis:** Not confirmed; text may be embedded in a static image or the banner content may not respond to locale state.
- **Status:** Reported by tester; screenshot supplied for language comparison.

**Evidence — language.jpg**

![Evidence for BUG-006](evidence/language.jpg)

## BUG-007 — No email received when attempting password change/reset

- **Affected module:** Account / Password reset email
- **Affected URL:** Record the exact partner-site settings/account route used.
- **Severity / Priority:** High / P1 - High
- **Environment:** Record actual OS, browser/version, screen resolution, and device.
- **Steps to reproduce:** 1. Open Settings > Password & Security. 2. Click the relevant password-change/forgot-password action. 3. Complete the flow as prompted. 4. Check the correct inbox, spam/junk, and wait the documented delivery interval.
- **Expected result:** The UI should clearly distinguish a password-change flow from a forgot-password flow. For a reset request, a reset email should be delivered to the registered address or a safe confirmation should be shown with clear next steps.
- **Actual result:** The tester reports that no email arrives. The supplied screenshot displays the message 'Password reset link has been sent to your email.'
- **Suggested fix:** Verify mail-provider configuration, delivery logs, spam/bounce status, registered email, and reset-token generation. Show a generic success message without exposing account existence; provide retry/support guidance where appropriate.
- **Root cause analysis:** Not confirmed. The screenshot confirms the UI success message, not whether an email was sent by the server or delivered by the provider.
- **Status:** Reported by tester; screenshot evidence supplied.

**Evidence — password.jpg**

![Evidence for BUG-007](evidence/password.jpg)

## Retest Checklist

- [ ] Compare logo size on both sites at the same viewport.
- [ ] Confirm the language selector is present where expected on desktop and mobile.
- [ ] Confirm whether autocomplete is required; if implemented, test partial queries, no results, keyboard selection, and slow network.
- [ ] Adjust price range and verify no unnecessary duplicate product requests or HTTP 429 under ordinary interaction.
- [ ] Test design and color filters individually and together; verify selected state, result count, and clearing behavior.
- [ ] Switch languages and verify all home-page banner text/assets update correctly.
- [ ] Trigger password reset with a controlled test account; verify email delivery using inbox/spam and server/provider logs.
- [ ] Attach exact environment details and redact cookies, authorization headers, and personal information from network evidence.

**Non-destructive scope:** Do not perform aggressive scanning, request flooding, or destructive account/order actions.
