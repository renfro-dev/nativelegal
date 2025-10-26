# Legal Tech Intelligence - Keyword Audit

**Date:** January 28, 2025  
**Purpose:** Document all tracked keywords for Reddit intelligence collection

---

## 📊 Currently Tracked Keywords

### 1. Harvey AI
- **Keywords:** `harvey ai`, `harvey`, `harveyai`
- **Issues:** Too narrow, missing variations

**Missing variations to add:**
- `@harveyai` (Twitter mentions)
- `harvey-ai`
- `harveylegal` 
- `harvey the ai`
- `harvey gpt`
- `harvey openai`

---

### 2. Spellbook
- **Keywords:** `spellbook`, `spellbook ai`, `spellbook contract`
- **Issues:** Too specific, common word collision risk

**Missing variations to add:**
- `@spellbookai`
- `spellbook legal`
- `spellbook contract review`
- `rwt spellbook` (product variant)
- `spellbook by rally` (company)

---

### 3. LegalSifter
- **Keywords:** `legalsifter`, `legal sifter`, `legalsifter ai`
- **Good coverage**

**Could add:**
- `@legalsifter`
- `legal-sifter`

---

### 4. Thomson Reuters
- **Keywords:** `thomson reuters`, `highq`, `westlaw edge`
- **Issues:** Missing many product names

**Missing critical keywords:**
- `westlaw` (huge omission!)
- `practical law`
- `contract express`
- `high q`
- `thomson reuters ai`
- `tr legal`
- `westlaw edge`
- `checkpoint`

---

### 5. Lexion
- **Keywords:** `lexion`, `lexion ai`, `lexion clm`
- **Good coverage**

**Could add:**
- `@lexionai`
- `lexion contract`

---

### 6. Latch
- **Keywords:** `latch ai`, `latch`, `latchai`
- **Issues:** Too generic, will match false positives

**Should be more specific:**
- `latch ai contract`
- `latch legal`
- `@latchai`
- `latch tech`

---

### 7. vLex
- **Keywords:** `vlex`, `vincent ai`, `vlex vincent`
- **Good coverage**

**Could add:**
- `@vlex`
- `v-lex`

---

### 8. Casetext
- **Keywords:** `casetext`, `cocounsel`, `casetext ai`
- **Excellent coverage**

**Could add:**
- `@casetext`

---

### 9. Legal Robot
- **Keywords:** `legal robot`, `legalrobot`
- **Good coverage**

**Could add:**
- `@legalrobot`

---

### 10. LawGeex
- **Keywords:** `lawgeex`, `law geex`
- **Good coverage**

**Could add:**
- `@lawgeex`
- `law-geex`

---

## 🚨 CRITICAL MISSING VENDORS

### Major Legal Tech Platforms NOT Tracked:

1. **Clio** - Legal practice management
   - Missing: `clio`, `clio ai`, `clio cloud`

2. **MyCase** - Case management
   - Missing: `mycase`, `mycase ai`

3. **Rocket Matter** - Practice management
   - Missing: `rocket matter`, `rocketmatter`

4. **Smokeball** - Practice management
   - Missing: `smokeball`, `smokeball ai`

5. **DocuSign** - Contract signing (legal adjacent)
   - Missing: `docusign`, `docusign ai`, `clm`

6. **PandaDoc** - Contract management
   - Missing: `pandadoc`, `pandadoc legal`

7. **Ironclad** - CLM
   - Missing: `ironclad`, `ironclad ai`

8. **Icertis** - Contract Intelligence
   - Missing: `icertis`, `icertis contract`

9. **ThoughtRiver** - Contract AI
   - Missing: `thoughtriver`, `thought river`

10. **SirionLabs** - CLM
    - Missing: `sirion`, `sirion labs`

11. **Agiloft** - Contract management
    - Missing: `agiloft`, `agiloft legal`

12. **Evisort** - Contract AI
    - Missing: `evisort`, `evisort ai`

13. **LinkSquares** - Contract analytics
    - Missing: `linksquares`, `link squares`

---

## 📝 RECOMMENDED ACTION PLAN

### Phase 1: Expand Existing Keywords (Quick Win)
```sql
UPDATE tracked_vendors 
SET reddit_keywords = ARRAY['westlaw', 'practical law', 'contract express', 'westlaw edge', 'checkpoint', 'high q', 'thomson reuters ai', 'tr legal', 'highq', 'thomson reuters']
WHERE vendor_name = 'Thomson Reuters';
```

### Phase 2: Add Missing Vendors
Add Clio, MyCase, DocuSign, Ironclad, Icertis, ThoughtRiver, Evisort, etc.

### Phase 3: Add Twitter Handles
Track `@username` mentions in Reddit posts

### Phase 4: Add Product-Specific Terms
- Contract: `clm`, `contract lifecycle`, `contract management ai`
- Legal Research: `legal research ai`, `case law ai`, `briefs ai`
- Practice Management: `law firm ai`, `practice management ai`

---

## 🎯 KEYWORD MATCHING LOGIC

### Current Logic:
```typescript
const hasMatch = keywords.some((keyword: string) => 
  postText.includes(keyword.toLowerCase())
)
```

### Issues:
1. Case insensitive only (not word boundary aware)
2. No fuzzy matching for typos
3. No phrase detection

### Improved Logic:
```typescript
// Word boundary aware
const hasMatch = keywords.some((keyword: string) => {
  const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
  return regex.test(postText);
});
```

---

## 📊 EXPECTED MATCHES

Based on Reddit search:
- "Harvey AI" discussions in r/LegalTech: ~2-3 per week
- "Casetext" discussions: ~1-2 per week  
- "Spellbook" discussions: ~1 per month
- "Westlaw" discussions: ~10+ per week (we're missing these!)

**Current system will miss Westlaw mentions entirely.**

---

## ✅ NEXT STEPS

1. **Update Thomson Reuters keywords** (add "westlaw")
2. **Add Clio, MyCase, DocuSign** (high frequency)
3. **Implement word boundary matching**
4. **Add product category keywords** as backup
5. **Test with real Reddit search** for validation

---

**Recommendation:** Start with Phase 1 (expand Thomson Reuters keywords) as Westlaw is mentioned frequently in legal subreddits.
