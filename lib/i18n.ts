import { DEFAULT_LOCALE, type Locale } from "./routes";

const en = {
  siteName: "ExpatsBuddy",
  siteCountry: "Poland",
  meta: {
    home: {
      title: "Polish bureaucracy, explained for foreigners",
      description:
        "Understand common situations around residence, work, sick leave, hospitalization, insurance, and official documents in Poland — with links to official Polish sources.",
    },
    glossary: {
      title: "Glossary of Polish bureaucracy terms",
      description:
        "Plain-language explanations of common Polish bureaucracy terms: karta pobytu, świadectwo pracy, ZUS forms like ZAS-53 and Z-10, e-ZLA, SOR, and more.",
    },
    start: {
      title: "I don't know where to start",
      description:
        "Answer a few simple questions about your situation in Poland and get pointed to the relevant plain-language explainer pages with official sources.",
    },
  },
  nav: {
    glossary: "Glossary",
    start: "Where do I start?",
    home: "Home",
    startLong: "I don’t know where to start",
  },
  footer: {
    disclaimer:
      "ExpatsBuddy provides general educational information and links to official sources. It does not provide legal, medical, tax, immigration, benefits, or insurance advice. It does not interpret personal documents, calculate deadlines or entitlements, or submit forms. Always check the linked official sources or contact the relevant institution or a qualified professional for your specific situation.",
  },
  home: {
    heroTitleLine1: "Polish bureaucracy,",
    heroHighlight: "explained",
    heroTitleRest: "for foreigners.",
    heroSubtitle:
      "Understand common situations around residence, work, sick leave, hospitalization, insurance, and official documents — with links to official Polish sources.",
    categoriesHeading: "What do you need help understanding?",
    startTileText: (n: number) =>
      `Answer ${n} quick questions — we’ll point you to the right pages.`,
    explainerPages: (n: number) => `${n} ${n === 1 ? "page" : "pages"}`,
  },
  category: {
    helpsWith: "This category helps with",
    doesNotHelpWith: "This category does not help with",
    tryAnother: "Not what you need? Try another category:",
    explainerPages: "Explainer pages",
    keyInstitutions: "Key institutions",
    commonTerms: "Most common Polish terms",
    sourcePool: "Official source pool",
    sourcePoolNote: "Official pages used across this category’s explainers.",
  },
  path: {
    whatThisMeans: "Overview",
    whoFor: "Who this page is for",
    institutions: "Which institution is usually involved",
    terms: "Terms you may see",
    documents: "Documents often mentioned",
    explains: "What this page can explain",
    cannotDo: "What this page does not do",
    sources: "Official sources",
    related: "Related paths",
    lastReviewed: "Last reviewed",
    staleWarning:
      "This page may need review. Always check the official sources below.",
  },
  glossary: {
    title: "Glossary",
    intro:
      "Common Polish bureaucracy terms, explained in plain language. Each term links to the explainer pages and official sources where it appears. Definitions describe what a term generally means — they are not advice about your situation.",
    back: "← Glossary",
    meaning: "What it generally means",
    connectedTo: "Usually connected to",
    mentionedIn: "Explainer pages that mention this term",
    sources: "Official sources",
    polishTerm: "Polish term",
    englishTerm: "English term",
  },
  start: {
    title: "I don’t know where to start",
    intro:
      "Answer a few yes/no questions and we’ll suggest explainer pages to read. This is routing, not advice: no eligibility checks, no deadlines, no recommendations to apply for anything.",
    questionOf: (n: number, total: number) => `Question ${n} of ${total}`,
    yes: "Yes",
    no: "No",
    back: "← Back",
    resultsHeading: "Suggested reading, based on your answers",
    resultsNote:
      "These explainer pages describe the general official path. They do not tell you what to apply for or whether you qualify.",
    urgentNote:
      "If your situation is urgent or connected to an official deadline, contact the relevant institution directly (the office named in your documents) or a qualified professional. ExpatsBuddy cannot calculate or confirm deadlines.",
    startWith: "Start with these explainer pages",
    alsoBrowse: "You may also want to browse",
    startOver: "Start over",
    questions: {
      stay: "Are you trying to understand your right to stay in Poland?",
      job: "Did your job end, or are you worried about employment documents?",
      business:
        "Are you self-employed, or thinking about starting a one-person business (JDG) or B2B work?",
      sick: "Are you sick or on medical leave?",
      hospital: "Were you hospitalized or did you have surgery?",
      document: "Are you trying to understand a type of official document?",
      insurance: "Are you dealing with private insurance?",
      eu: "Are you an EU/EFTA/Swiss citizen?",
      noneu: "Are you a non-EU citizen?",
      urgent: "Is your situation urgent or connected to an official deadline?",
    } as Record<string, string>,
  },
  search: {
    placeholder: "Search e.g. ZAS-53, karta pobytu, sick leave…",
    ariaLabel: "Search subpaths and glossary",
    noResults:
      "No matching pages. Try a Polish or English term, or browse the categories.",
    typeLabels: {
      path: "Explainer",
      category: "Category",
      glossary: "Glossary",
    } as Record<string, string>,
  },
  feedback: {
    question: "Was this page useful?",
    thanks: "Thanks for your feedback!",
    optionalComment: "Optional comment",
    privacyWarning:
      "Do not include personal, medical, financial, or legal details in feedback.",
    submit: "Submit",
    sending: "Sending…",
    error: "Something went wrong sending feedback. Please try again later.",
    options: {
      helpful: "Helpful",
      confusing: "Confusing",
      missing_information: "Missing info",
      wrong_or_outdated: "Wrong / outdated",
      broken_link: "Broken link",
      other: "Other",
    } as Record<string, string>,
  },
  sourceCard: {
    officialSource: "Official source",
    lastChecked: "Last checked",
    typeLabels: {
      form: "Form page",
      explainer: "Explainer",
      checklist: "Checklist",
      pdf: "PDF",
      qna: "Q&A",
      portal: "Portal",
    } as Record<string, string>,
    languageLabels: {
      pl: "Polish",
      en: "English",
      mixed: "Polish / English",
    } as Record<string, string>,
  },
  cookies: {
    message:
      "We use cookies to show ads on this site. You can accept or decline — this does not affect how the explainer pages work.",
    accept: "Accept",
    decline: "Decline",
    settingsLink: "Cookie settings",
  },
};

export type Dict = typeof en;

const uk: Dict = {
  siteName: "ExpatsBuddy",
  siteCountry: "Польща",
  meta: {
    home: {
      title: "Польська бюрократія — просто і зрозуміло для іноземців",
      description:
        "Розберіться в типових ситуаціях: легалізація перебування, робота, лікарняний, госпіталізація, страхування та офіційні документи в Польщі — з посиланнями на офіційні польські джерела.",
    },
    glossary: {
      title: "Довідник термінів польської бюрократії",
      description:
        "Прості пояснення поширених термінів польської бюрократії: karta pobytu, świadectwo pracy, форми ZUS ZAS-53 і Z-10, e-ZLA, SOR та інші.",
    },
    start: {
      title: "Не знаю, з чого почати",
      description:
        "Дайте відповідь на кілька простих запитань про вашу ситуацію в Польщі — і отримайте посилання на прості пояснювальні сторінки з офіційними джерелами.",
    },
  },
  nav: {
    glossary: "Довідник",
    start: "З чого почати?",
    home: "Головна",
    startLong: "Не знаю, з чого почати",
  },
  footer: {
    disclaimer:
      "ExpatsBuddy надає загальну освітню інформацію та посилання на офіційні джерела. Ми не надаємо юридичних, медичних, податкових, імміграційних, страхових консультацій чи порад щодо соціальних виплат. Ми не тлумачимо особисті документи, не розраховуємо строки чи розміри виплат і не подаємо заяви. Завжди перевіряйте офіційні джерела за посиланнями або звертайтеся до відповідної установи чи кваліфікованого фахівця щодо вашої ситуації.",
  },
  home: {
    heroTitleLine1: "Польська бюрократія —",
    heroHighlight: "просто і зрозуміло",
    heroTitleRest: "для іноземців.",
    heroSubtitle:
      "Розберіться в типових ситуаціях: легалізація перебування, робота, лікарняний, госпіталізація, страхування та офіційні документи — з посиланнями на офіційні польські джерела.",
    categoriesHeading: "У чому вам потрібно розібратися?",
    startTileText: (n: number) => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      const word =
        mod10 === 1 && mod100 !== 11
          ? "питання"
          : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
            ? "питання"
            : "питань";
      return `Дайте відповідь на ${n} ${word} — і ми підкажемо потрібні сторінки.`;
    },
    explainerPages: (n: number) => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      const word =
        mod10 === 1 && mod100 !== 11
          ? "сторінка"
          : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
            ? "сторінки"
            : "сторінок";
      return `${n} ${word}`;
    },
  },
  category: {
    helpsWith: "Ця категорія допомагає з",
    doesNotHelpWith: "Ця категорія не допомагає з",
    tryAnother: "Не те, що ви шукали? Спробуйте іншу категорію:",
    explainerPages: "Пояснювальні сторінки",
    keyInstitutions: "Основні установи",
    commonTerms: "Найпоширеніші польські терміни",
    sourcePool: "Офіційні джерела категорії",
    sourcePoolNote:
      "Офіційні сторінки, використані в поясненнях цієї категорії.",
  },
  path: {
    whatThisMeans: "Огляд",
    whoFor: "Для кого ця сторінка",
    institutions: "Яка установа зазвичай залучена",
    terms: "Терміни, які можуть траплятися",
    documents: "Документи, які часто згадуються",
    explains: "Що пояснює ця сторінка",
    cannotDo: "Чого ця сторінка не робить",
    sources: "Офіційні джерела",
    related: "Пов’язані теми",
    lastReviewed: "Останній перегляд",
    staleWarning:
      "Ця сторінка може потребувати оновлення. Завжди перевіряйте офіційні джерела нижче.",
  },
  glossary: {
    title: "Довідник",
    intro:
      "Поширені терміни польської бюрократії, пояснені простою мовою. Кожен термін пов’язаний із пояснювальними сторінками та офіційними джерелами, де він трапляється. Визначення описують загальне значення терміна — це не порада щодо вашої ситуації.",
    back: "← Довідник",
    meaning: "Що це зазвичай означає",
    connectedTo: "Зазвичай пов’язано з",
    mentionedIn: "Пояснювальні сторінки з цим терміном",
    sources: "Офіційні джерела",
    polishTerm: "Польський термін",
    englishTerm: "Англійський термін",
  },
  start: {
    title: "Не знаю, з чого почати",
    intro:
      "Дайте відповідь на кілька запитань «так/ні» — і ми запропонуємо сторінки для читання. Це навігація, а не порада: без перевірки права на виплати, без строків, без рекомендацій щось подавати.",
    questionOf: (n: number, total: number) => `Запитання ${n} з ${total}`,
    yes: "Так",
    no: "Ні",
    back: "← Назад",
    resultsHeading: "Рекомендоване читання на основі ваших відповідей",
    resultsNote:
      "Ці сторінки описують загальний офіційний шлях. Вони не кажуть, що вам подавати і чи маєте ви на щось право.",
    urgentNote:
      "Якщо ваша ситуація термінова або пов’язана з офіційним строком, зверніться безпосередньо до відповідної установи (зазначеної у ваших документах) або до кваліфікованого фахівця. ExpatsBuddy не може розраховувати чи підтверджувати строки.",
    startWith: "Почніть із цих сторінок",
    alsoBrowse: "Також можете переглянути",
    startOver: "Почати спочатку",
    questions: {
      stay: "Ви намагаєтеся розібратися з правом на перебування в Польщі?",
      job: "Ваша робота закінчилася або вас турбують документи про працевлаштування?",
      business:
        "Ви самозайняті, або думаєте відкрити одноосібне підприємство (JDG) чи працювати за B2B?",
      sick: "Ви хворієте або перебуваєте на лікарняному?",
      hospital: "Ви були госпіталізовані або перенесли операцію?",
      document: "Ви намагаєтеся зрозуміти, що це за офіційний документ?",
      insurance: "Ви маєте справу з приватним страхуванням?",
      eu: "Ви громадянин(ка) ЄС/ЄАВТ/Швейцарії?",
      noneu: "Ви громадянин(ка) країни поза ЄС?",
      urgent: "Ваша ситуація термінова або пов’язана з офіційним строком?",
    } as Record<string, string>,
  },
  search: {
    placeholder: "Шукайте: ZAS-53, karta pobytu, лікарняний…",
    ariaLabel: "Пошук сторінок і термінів довідника",
    noResults:
      "Нічого не знайдено. Спробуйте польський, англійський чи український термін або перегляньте категорії.",
    typeLabels: {
      path: "Пояснення",
      category: "Категорія",
      glossary: "Довідник",
    } as Record<string, string>,
  },
  feedback: {
    question: "Чи була ця сторінка корисною?",
    thanks: "Дякуємо за відгук!",
    optionalComment: "Коментар (необов’язково)",
    privacyWarning:
      "Не вказуйте у відгуку особисті, медичні, фінансові чи юридичні дані.",
    submit: "Надіслати",
    sending: "Надсилання…",
    error: "Не вдалося надіслати відгук. Спробуйте пізніше.",
    options: {
      helpful: "Корисно",
      confusing: "Незрозуміло",
      missing_information: "Бракує інформації",
      wrong_or_outdated: "Помилка / застаріле",
      broken_link: "Непрацююче посилання",
      other: "Інше",
    } as Record<string, string>,
  },
  sourceCard: {
    officialSource: "Офіційне джерело",
    lastChecked: "Перевірено",
    typeLabels: {
      form: "Сторінка форми",
      explainer: "Пояснення",
      checklist: "Чекліст",
      pdf: "PDF",
      qna: "Питання й відповіді",
      portal: "Портал",
    } as Record<string, string>,
    languageLabels: {
      pl: "польська",
      en: "англійська",
      mixed: "польська / англійська",
    } as Record<string, string>,
  },
  cookies: {
    message:
      "Ми використовуємо файли cookie для показу реклами на цьому сайті. Ви можете погодитися або відмовитися — це не впливає на роботу пояснювальних сторінок.",
    accept: "Погодитися",
    decline: "Відмовитися",
    settingsLink: "Налаштування cookie",
  },
};

const dicts: Record<Locale, Dict> = { en, uk };

export function getDict(locale: string): Dict {
  return dicts[(locale as Locale) in dicts ? (locale as Locale) : DEFAULT_LOCALE];
}
