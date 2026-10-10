# Glazzarto Exploratory Test Checklist

**Project:** Glazzarto Web Platform  
**Target URLs:**

- https://www.glazzarto.com
- http://partner.glazzarto.com/

**Tester:** Samyak Jain  
**Test Date:** Add actual testing date  
**Environment:** Record OS, browser/version, and screen resolution.

**Execution status:** Not Run / Pass / Fail / Blocked

## 1. Functional Testing

- [ ] **TC-F01:** Public home page loads successfully.
- [ ] **TC-F02:** Navigation links lead to the correct pages.
- [ ] **TC-F03:** Product/service browsing works as expected.
- [ ] **TC-F04:** Search and filter controls work where available.
- [ ] **TC-F05:** Public forms accept valid input.
- [ ] **TC-F06:** Required fields reject empty input.
- [ ] **TC-F07:** Invalid email and phone formats are handled appropriately.
- [ ] **TC-F08:** Boundary-length input is handled gracefully.
- [ ] **TC-F09:** Duplicate submissions are prevented or handled clearly.
- [ ] **TC-F10:** Error messages are understandable and actionable.
- [ ] **TC-F11:** Changing the language updates localized content.
- [ ] **TC-F12:** Password-reset requests provide clear feedback and email delivery is verified where applicable.
- [ ] **TC-F13:** Price-range filtering does not produce unexpected HTTP 429 errors during normal use.
- [ ] **TC-F14:** Design and color filters are visibly applied and update results consistently.

## 2. UI/UX Testing

- [ ] **TC-UI01:** No overlapping elements at desktop width.
- [ ] **TC-UI02:** No unintended horizontal scrolling on mobile.
- [ ] **TC-UI03:** Buttons show clear interactive and disabled states.
- [ ] **TC-UI04:** Text is readable and not clipped.
- [ ] **TC-UI05:** Images render correctly and have appropriate alternative text where relevant.
- [ ] **TC-UI06:** Keyboard navigation works for public forms and controls.
- [ ] **TC-UI07:** Header logos have consistent sizing across the two websites.
- [ ] **TC-UI08:** Language selector is visible and usable where expected.
- [ ] **TC-UI09:** Search suggestions appear if autocomplete is an intended feature.
- [ ] **TC-UI10:** Cookie consent controls do not obscure essential content or controls.

## 3. Cross-Browser and Device Compatibility

- [ ] **TC-C01:** Chrome desktop.
- [ ] **TC-C02:** Microsoft Edge desktop.
- [ ] **TC-C03:** Firefox desktop.
- [ ] **TC-C04:** Chrome mobile or browser emulation.
- [ ] **TC-C05:** Safari on iOS, if available.
- [ ] **TC-C06:** Responsive layout checked at desktop, tablet, and mobile widths.

Record the browser version and viewport for each execution.

## 4. Safety and Testing Scope

- [ ] **TC-S01:** Only public routes and authorized test flows were tested.
- [ ] **TC-S02:** No destructive actions were performed.
- [ ] **TC-S03:** No automated scraping was used.
- [ ] **TC-S04:** No aggressive vulnerability scanning or request flooding was used.
- [ ] **TC-S05:** Sensitive information was redacted from screenshots and network logs.

## 5. Execution Summary

| Metric           |                Count |
| ---------------- | -------------------: |
| Total test cases |                   35 |
| Passed           | Update after testing |
| Failed           | Update after testing |
| Blocked          | Update after testing |
| Not run          | Update after testing |

**Important:** Mark a test as passed or failed only after executing it. Attach evidence and link the relevant bug ID for every failed test where applicable.

## 6. Evidence and Defect References

For each failed test, record:

- Test case ID
- Actual result
- Screenshot or console/network evidence
- Related bug ID (e.g., BUG-004)
- Browser, OS, and viewport
- Retest result after a fix
