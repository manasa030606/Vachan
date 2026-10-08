// Bengali (বাংলা) — standard colloquial (cholito) Bangla as spoken in Kolkata.
// Romanization: অ / inherent vowel = "o", আ = "aa", ই/ঈ = "i", উ/ঊ = "u", শ/ষ/স = "sh" (but "s" in
// clusters like স্ট, স্ন, স্ত), ড়/ঢ় = "r", ঁ = "n", য় = "y", ছ = "chh", ক্ষ = "kkh"; a য-ফলা in the
// middle of a word doubles the consonant (ধন্যবাদ = dhonnobaad). Names keep their usual spelling.
import type {
  DialogueLine,
  ExtraEntry,
  LanguageContent,
  PhraseEntry,
  WordEntry,
} from "../types.ts";

type Rest = Omit<PhraseEntry, "words">;

/** A phrase: script and romanization split on spaces, word by word. */
const ph = (script: string, roman: string, rest: Rest = {}): PhraseEntry => {
  const s = script.split(" ");
  const r = roman.split(" ");
  if (s.length !== r.length) throw new Error(`bn: token mismatch in "${script}" / "${roman}"`);
  return { words: s.map((word, i) => [word, r[i]] as [string, string]), ...rest };
};
const wd = (
  script: string,
  roman: string,
  rest: Omit<WordEntry, "script" | "roman"> = {},
): WordEntry => ({
  script,
  roman,
  ...rest,
});
const xw = (
  key: string,
  lesson: string,
  topic: string,
  script: string,
  roman: string,
  meaning: string,
  notes?: string,
): ExtraEntry => ({
  key,
  lesson,
  topic,
  script,
  roman,
  meaning,
  ...(notes ? { notes } : {}),
});
const xp = (
  key: string,
  lesson: string,
  topic: string,
  script: string,
  roman: string,
  meaning: string,
  notes?: string,
): ExtraEntry => ({
  key,
  lesson,
  topic,
  meaning,
  ...ph(script, roman, notes ? { notes } : {}),
});
const A = (script: string, roman: string, meaning: string): DialogueLine => ({
  speaker: "A",
  script,
  roman,
  meaning,
});
const B = (script: string, roman: string, meaning: string): DialogueLine => ({
  speaker: "B",
  script,
  roman,
  meaning,
});

export const content: LanguageContent = {
  code: "bn",
  entries: {
    // First words › Greetings
    hello: wd("নমস্কার", "nomoshkaar", {
      notes:
        "Polite hello for any time of day, often said with palms joined. Muslims (and most people in Bangladesh) say আসসালামু আলাইকুম (aassaalaamu aalaaikum). Among friends people just say হাই (haai) or nothing at all — কী রে? (ki re?) to a close friend.",
    }),
    goodbye: wd("আসি", "aashi", {
      notes:
        'Literally "I come" — Bengalis avoid saying a final goodbye and imply they will return. Also আসছি (aashchhi). The host replies আবার আসবেন (aabaar aashben, "please come again"). "Bye" in English is common among friends.',
    }),
    seeYouLater: ph("পরে দেখা হবে", "pore dekhaa hobe", {
      notes:
        'Literally "we will meet later". On the phone or in chat say পরে কথা হবে (pore kothaa hobe, "talk later"). আবার দেখা হবে (aabaar dekhaa hobe) = "we\'ll meet again".',
    }),
    goodMorning: ph("শুভ সকাল", "shubho shokaal", {
      notes:
        'Used in messages and greetings cards; in person most people just say নমস্কার or English "good morning". সুপ্রভাত (suprobhaat) is the formal, literary form.',
    }),
    goodNight: ph("শুভ রাত্রি", "shubho raatri", {
      notes:
        'Fairly formal; English "good night" is what most people actually say. Before leaving at night people often just say আসি (aashi).',
    }),
    thankYou: wd("ধন্যবাদ", "dhonnobaad", {
      notes:
        'Polite and a little formal. Family and close friends rarely thank each other in words; "thank you" / "thanks" in English is very common. অনেক ধন্যবাদ (onek dhonnobaad) = "thank you very much".',
    }),
    welcome: wd("স্বাগত", "shaagoto", {
      notes:
        'Written/formal "welcome" (banners: স্বাগতম, shaagotom). To welcome a guest at the door people actually say আসুন, আসুন (aashun, aashun — "come in, come in").',
    }),
    // Yes, no & polite words
    yes: wd("হ্যাঁ", "hyaan", {
      notes: 'Also হুঁ (hun, "mm-hm") in casual talk. আচ্ছা (aachchhaa) means "okay / I see".',
    }),
    no: wd("না", "naa", {
      notes:
        "The same না also makes verbs negative, placed after the verb: আমি জানি না (aami jaani naa, I don't know).",
    }),
    please: wd("দয়া করে", "doyaa kore", {
      notes:
        'Literally "doing kindness". It sounds formal; everyday politeness usually comes from the আপনি verb form plus একটু (ektu, "a little"): একটু জল দিন (ektu jol din, "some water, please").',
    }),
    sorry: wd("দুঃখিত", "dukkhito", {
      notes:
        'Formal "sorry". In everyday speech people say English সরি (sori). To apologise more humbly: মাফ করবেন (maaph korben, "please forgive me"); to a friend: মাফ করো (maaph koro).',
    }),
    excuseMe: ph("একটু শুনবেন?", "ektu shunben?", {
      meaning: "Excuse me. (to get attention)",
      notes:
        'Literally "will you listen a moment?" — the natural way to stop a stranger. Also শুনছেন? (shunchhen?) or দাদা / দিদি (daadaa / didi). To squeeze past someone say একটু সরবেন? (ektu shorben?, "could you move a little?").',
    }),
    okay: wd("ঠিক আছে", "thik aachhe", {
      notes:
        'Literally "it is right". আচ্ছা (aachchhaa) is also very common, and English "OK" is used by everyone.',
    }),
    noProblem: ph("কোনো অসুবিধা নেই", "kono oshubidhaa nei", {
      notes:
        'Literally "there is no difficulty". Casual: অসুবিধা নেই (oshubidhaa nei) or কোনো ব্যাপার না (kono byaapaar naa).',
    }),
    youreWelcome: ph("কোনো ব্যাপার না", "kono byaapaar naa", {
      notes:
        'Literally "it\'s no matter". Bengalis rarely use a set reply to thanks; also common: না না, ঠিক আছে (naa naa, thik aachhe) or just a smile.',
    }),
    // Everyday things
    water: wd("জল", "jol", {
      notes:
        'জল is used in West Bengal; পানি (paani) is used in Bangladesh and by many Muslim speakers. Bengalis "eat" water: জল খাওয়া (jol khaaoyaa, to drink water).',
    }),
    food: wd("খাবার", "khaabaar", {
      notes:
        'From খাওয়া (khaaoyaa, to eat). A meal at home is often just called ভাত (bhaat, rice): ভাত খেয়েছ? = "have you had your meal?"',
    }),
    house: wd("বাড়ি", "baari", {
      notes:
        'বাড়ি is both "house" and "home": বাড়ি যাচ্ছি (baari jaachchhi, I\'m going home). ঘর (ghor) usually means a room.',
    }),
    book: wd("বই", "boi"),
    phone: wd("ফোন", "phon", { notes: "Also মোবাইল (mobaail). ফোন করা (phon koraa) = to call." }),
    bag: wd("ব্যাগ", "byaag", {
      notes: "English loanword. A cloth or shopping bag can also be থলি (tholi) or থলে (thole).",
    }),
    pen: wd("কলম", "kolom", { notes: "English পেন (pen) is just as common in everyday speech." }),
    money: wd("টাকাপয়সা", "taakaapoyshaa", {
      notes:
        '"Money" in general. Most people simply say টাকা (taakaa), which is also the word for rupee (and the Bangladeshi taka). পয়সা (poyshaa) = paisa, small change.',
    }),
    // Common actions — verbal nouns (dictionary form)
    come: wd("আসা", "aashaa", {
      notes: "Polite request: আসুন (aashun); familiar: এসো (esho); intimate: আয় (aay).",
    }),
    go: wd("যাওয়া", "jaaoyaa", {
      notes:
        "আমি যাই (aami jaai) I go; আমি যাচ্ছি (aami jaachchhi) I am going; polite request যান (jaan).",
    }),
    eat: wd("খাওয়া", "khaaoyaa", {
      notes: "Bengali also uses খাওয়া for drinking (জল খাওয়া, চা খাওয়া) and even for smoking.",
    }),
    drink: wd("পান করা", "paan koraa", {
      notes:
        "Formal/written. In everyday speech Bengalis use খাওয়া (khaaoyaa, to eat) for drinks: চা খাব (chaa khaabo, I'll have tea).",
    }),
    see: wd("দেখা", "dekhaa", {
      notes: 'Also means "to look" and "to meet": দেখা হবে (dekhaa hobe, we\'ll meet).',
    }),
    give: wd("দেওয়া", "deoyaa", {
      notes: "Polite request: দিন (din, please give); familiar: দাও (daao); intimate: দে (de).",
    }),
    take: wd("নেওয়া", "neoyaa", {
      notes:
        "Polite request: নিন (nin, please take); familiar: নাও (naao). আমি নেব (aami nebo) = I'll take it.",
    }),
    doVerb: wd("করা", "koraa", {
      notes:
        "Combines with nouns to make many verbs: কাজ করা (kaaj koraa, to work), রান্না করা (raannaa koraa, to cook), ফোন করা (phon koraa, to call).",
    }),
    // This, that & questions
    this: wd("এটা", "etaa", {
      notes:
        'এটা = "this (thing)" on its own; before a noun use এই (ei): এই বই (ei boi, this book).',
    }),
    that: wd("ওটা", "otaa", {
      notes:
        'Before a noun: ওই (oi): ওই বাড়ি (oi baari, that house). সেটা (shetaa) = "that one (already mentioned)".',
    }),
    here: wd("এখানে", "ekhaane"),
    there: wd("ওখানে", "okhaane", {
      notes: 'সেখানে (shekhaane) = "there" referring to a place already mentioned.',
    }),
    what: wd("কী", "ki", {
      notes: 'Spelled কী for "what" and কি for the yes/no question marker; both are said "ki".',
    }),
    who: wd("কে", "ke"),
    whatIsThis: ph("এটা কী?", "etaa ki?", {
      notes: 'Literally "this what?" — no word for "is" is needed.',
    }),
    whoIsThis: ph("ইনি কে?", "ini ke?", {
      notes:
        'ইনি (ini) is the respectful "this person". For a child or a friend: এ কে? (e ke?). On the phone: কে বলছেন? (ke bolchhen?).',
    }),
    thisIsWater: ph("এটা জল", "etaa jol", {
      notes: 'Literally "this water". Bengali drops "is" in present-tense "X is Y" sentences.',
    }),

    // Introducing yourself › My name is…
    name: wd("নাম", "naam"),
    iPronoun: wd("আমি", "aami", {
      notes:
        '"I" is the same for everyone; the verb ending shows the person: আমি যাই (aami jaai, I go).',
    }),
    youFormal: wd("আপনি", "aapni", {
      notes:
        'Polite "you" for elders, strangers, teachers and shopkeepers. Bengali has three levels: আপনি (aapni, polite), তুমি (tumi, familiar), তুই (tui, intimate). When unsure, use আপনি.',
    }),
    my: wd("আমার", "aamaar", {
      notes:
        'Comes before the noun: আমার বাড়ি (aamaar baari, my house). Also means "to me" in আমার জল চাই (I want water).',
    }),
    yourFormal: wd("আপনার", "aapnaar", { notes: "Familiar: তোমার (tomaar); intimate: তোর (tor)." }),
    myNameIs: ph("আমার নাম আশা", "aamaar naam Asha", {
      notes:
        'Literally "my name Asha" — no word for "is". Also common: আমি আশা (aami Asha, "I\'m Asha").',
      blank: 1,
    }),
    whatIsYourName: ph("আপনার নাম কী?", "aapnaar naam ki?", {
      notes:
        "Polite. To a child or someone your age: তোমার নাম কী? (tomaar naam ki?). A very polite older form is আপনার শুভ নাম? (aapnaar shubho naam?).",
    }),
    // How are you?
    howAreYou: ph("আপনি কেমন আছেন?", "aapni kemon aachhen?", {
      notes:
        "Polite. To a friend: তুমি কেমন আছো? (tumi kemon aachho?); to a close friend: কেমন আছিস? (kemon aachhis?). Often shortened to কেমন আছেন? (kemon aachhen?).",
    }),
    iAmFine: ph("আমি ভালো আছি", "aami bhaalo aachhi", {
      notes: 'Literally "I am well". Casual: ভালো (bhaalo) or চলছে (cholchhe, "it\'s going on").',
    }),
    andYou: ph("আর আপনি?", "aar aapni?", {
      notes: "To a friend: আর তুমি? (aar tumi?) or just তুমি? (tumi?).",
    }),
    veryGood: ph("খুব ভালো", "khub bhaalo", {
      notes: 'Also দারুণ (daarun, "great") and বেশ ভালো (besh bhaalo, "quite good").',
    }),
    iAmAlsoFine: ph("আমিও ভালো আছি", "aamio bhaalo aachhi", {
      notes: '-ও (-o) attached to a word means "also": আমিও (aamio) = me too.',
    }),
    // Where are you from?
    whereAreYouFrom: ph("আপনি কোথা থেকে এসেছেন?", "aapni kothaa theke eshechhen?", {
      notes:
        'Literally "where have you come from?". Very common too: আপনার বাড়ি কোথায়? (aapnaar baari kothaay?, "where is your home?"), which asks about your home town.',
    }),
    iAmFromIndia: ph("আমি ভারত থেকে এসেছি", "aami bhaarot theke eshechhi", {
      notes:
        'Literally "I have come from India". You can also say আমি ভারতীয় (aami bhaarotiyo, "I am Indian").',
    }),
    india: wd("ভারত", "bhaarot", {
      notes:
        'English ইন্ডিয়া (indiyaa) is also used in conversation. "Indian" = ভারতীয় (bhaarotiyo).',
    }),
    city: wd("শহর", "shohor"),
    village: wd("গ্রাম", "graam", { notes: "Also গাঁ (gaan) in casual speech." }),
    country: wd("দেশ", "desh", {
      notes:
        'দেশ also means "home region / native place": দেশের বাড়ি (desher baari) = ancestral home.',
    }),
    whereDoYouLive: ph("আপনি কোথায় থাকেন?", "aapni kothaay thaaken?", {
      notes: "Casual: তুমি কোথায় থাকো? (tumi kothaay thaako?).",
    }),
    iLiveInCity: ph("আমি কলকাতায় থাকি", "aami Kolkatay thaaki", {
      meaning: "I live in Kolkata.",
      accept: ["i stay in kolkata"],
      notes:
        '-য় / -এ / -তে means "in": কলকাতায় (in Kolkata), শিলিগুড়িতে (Siligurite, in Siliguri), দুর্গাপুরে (Durgapure, in Durgapur).',
    }),
    // Nice to meet you
    niceToMeetYou: ph(
      "আপনার সঙ্গে আলাপ করে ভালো লাগল",
      "aapnaar shonge aalaap kore bhaalo laaglo",
      {
        notes:
          'Literally "having got acquainted with you, it felt good". Also আপনার সঙ্গে দেখা হয়ে ভালো লাগল (dekhaa hoye, "having met"). To someone your age: তোমার সঙ্গে… (tomaar shonge…).',
      },
    ),
    iAmAStudent: ph("আমি ছাত্র", "aami chhaatro", {
      notes:
        'No verb needed for "am". A female student says আমি ছাত্রী (aami chhaatri). The verbs never change for gender in Bengali, only this noun does.',
    }),
    iAmLearningLanguage: ph("আমি বাংলা শিখছি", "aami baanglaa shikhchhi", {
      meaning: "I am learning Bengali.",
      notes:
        "বাংলা (baanglaa) is the name of the language; শিখছি (shikhchhi) = am learning, from শেখা (shekhaa, to learn).",
    }),
    iSpeakALittle: ph("আমি একটু একটু বাংলা বলতে পারি", "aami ektu ektu baanglaa bolte paari", {
      meaning: "I speak a little Bengali.",
      notes:
        'Literally "I can speak Bengali a little a little" — the doubled একটু একটু sounds modest and natural. Also আমি অল্প বাংলা জানি (aami olpo baanglaa jaani, "I know a little Bengali").',
    }),
    student: wd("ছাত্র", "chhaatro", {
      notes: "Female: ছাত্রী (chhaatri). Students in general: ছাত্রছাত্রী (chhaatrochhaatri).",
    }),
    teacher: wd("শিক্ষক", "shikkhok", {
      notes:
        "Female: শিক্ষিকা (shikkhikaa). Students address teachers as স্যার (syaar) / ম্যাম (myaam), or traditionally মাস্টারমশাই (maastaarmoshaai) and দিদিমণি (didimoni).",
    }),
    // I don't understand
    iUnderstand: ph("আমি বুঝতে পারছি", "aami bujhte paarchhi", {
      notes:
        'Literally "I am able to understand". After an explanation people often say বুঝেছি (bujhechhi, "got it").',
    }),
    iDontUnderstand: ph("আমি বুঝতে পারছি না", "aami bujhte paarchhi naa", {
      notes:
        'Add না (naa) after the verb for "not". Past: আমি বুঝতে পারিনি (aami bujhte paarini, "I didn\'t understand").',
    }),
    pleaseRepeat: ph("আরেকবার বলুন", "aarekbaar bolun", {
      notes:
        'Literally "say once more". Softer: আরেকবার বলবেন? (aarekbaar bolben?, "would you say it again?"). To a friend: আরেকবার বলো (aarekbaar bolo).',
    }),
    speakSlowly: ph("একটু আস্তে বলুন", "ektu aaste bolun", {
      notes: 'To a friend: একটু আস্তে বলো (ektu aaste bolo). আস্তে also means "softly, quietly".',
    }),
    whatDoesThisMean: ph("এর মানে কী?", "er maane ki?", {
      notes:
        'Literally "its meaning what?". About a word: এই কথাটার মানে কী? (ei kothaataar maane ki?).',
    }),
    doYouSpeakEnglish: ph("আপনি কি ইংরেজি বলতে পারেন?", "aapni ki ingreji bolte paaren?", {
      notes:
        'কি (ki) after the subject turns a sentence into a yes/no question. Literally "can you speak English?".',
    }),
    howDoYouSay: ph("এটাকে বাংলায় কী বলে?", "etaake baanglaay ki bole?", {
      meaning: "How do you say this in Bengali?",
      notes:
        'Literally "what do (people) call this in Bengali?". For an English word: "…" বাংলায় কী বলে? ("…" baanglaay ki bole?).',
    }),

    // Family › Parents & children
    mother: wd("মা", "maa", {
      notes:
        "Muslim families often say আম্মা (aammaa) or আম্মু (aammu). Children usually call their mother তুমি, not আপনি.",
    }),
    father: wd("বাবা", "baabaa", {
      notes: "Muslim families often say আব্বা (aabbaa) or আব্বু (aabbu).",
    }),
    parents: wd("বাবা-মা", "baabaa-maa", {
      notes: "Formal: মা-বাবা or পিতামাতা (pitaamaataa, literary).",
    }),
    son: wd("ছেলে", "chhele", {
      notes:
        'ছেলে means both "son" and "boy": আমার ছেলে (aamaar chhele) = my son. Formal: পুত্র (putro).',
    }),
    daughter: wd("মেয়ে", "meye", {
      notes:
        'মেয়ে means both "daughter" and "girl": আমার মেয়ে (aamaar meye) = my daughter. Formal: কন্যা (konnaa).',
    }),
    child: wd("বাচ্চা", "baachchaa", {
      notes:
        "Also ছোট ছেলেমেয়ে (chhoto chhelemeye). Someone's offspring (any age): সন্তান (shontaan).",
    }),
    family: wd("পরিবার", "poribaar", {
      notes:
        'Everyday: বাড়ির লোক (baarir lok, "the people of the house"), as in বাড়ির সবাই ভালো? (is everyone at home well?).',
    }),
    // Siblings & partners
    elderBrother: wd("দাদা", "daadaa", {
      notes:
        "Also used to address any slightly older man politely (shopkeepers, drivers): দাদা, এটা কত? After a name it becomes -দা: রবিদা (Robi-daa). Careful: in Hindi दादा means grandfather.",
    }),
    youngerBrother: wd("ভাই", "bhaai", {
      notes:
        "ভাই can also mean brother in general; to be precise say ছোট ভাই (chhoto bhaai). Also an affectionate way to address a younger man.",
    }),
    elderSister: wd("দিদি", "didi", {
      notes:
        "Also used to address any slightly older woman politely. After a name: -দি, e.g. আশাদি (Asha-di).",
    }),
    youngerSister: wd("বোন", "bon", {
      notes: "Also sister in general; ছোট বোন (chhoto bon) = younger sister.",
    }),
    husband: wd("স্বামী", "shaami", {
      notes:
        'Everyday/colloquial: বর (bor). Also কর্তা (kortaa, "head of the house"), half joking.',
    }),
    wife: wd("স্ত্রী", "stri", {
      notes:
        "Everyday/colloquial: বউ (bou). গিন্নি (ginni) is an affectionate word for the lady of the house.",
    }),
    // Grandparents & relatives
    grandfatherPaternal: wd("ঠাকুরদা", "thaakurdaa", {
      notes:
        "Many children simply call both grandfathers দাদু (daadu). In Muslim families the father's father is দাদা (daadaa).",
    }),
    grandmotherPaternal: wd("ঠাকুমা", "thaakumaa", {
      notes: "Muslim families: দাদি (daadi). Also ঠাম্মা (thaammaa) in affectionate speech.",
    }),
    grandfatherMaternal: wd("দাদু", "daadu", {
      notes:
        "The fuller word is দাদামশাই (daadaamoshaai). দাদু is also the general, affectionate word for any grandfather. Muslim families: নানা (naanaa).",
    }),
    grandmotherMaternal: wd("দিদিমা", "didimaa", {
      notes: "Affectionate short form: দিদা (didaa). Muslim families: নানি (naani).",
    }),
    uncleMaternal: wd("মামা", "maamaa", {
      notes:
        "His wife is মামি (maami). Father's younger brother is কাকা (kaakaa), father's elder brother জেঠু (jethu).",
    }),
    auntPaternal: wd("পিসি", "pishi", {
      notes:
        "Also পিসিমা (pishimaa), more respectful. Her husband is পিসেমশাই (pishemoshaai). Mother's sister is মাসি (maashi).",
    }),
    // People
    man: wd("পুরুষ", "purush", {
      notes:
        'পুরুষ is "man / male". For a man you see, people say লোক (lok) or politely ভদ্রলোক (bhodrolok, gentleman).',
    }),
    woman: wd("মহিলা", "mohilaa", {
      notes:
        "Politely ভদ্রমহিলা (bhodromohilaa, lady). মেয়ে (meye) is used for girls and younger women.",
    }),
    boy: wd("বাচ্চা ছেলে", "baachchaa chhele", {
      meaning: "Boy (a young boy)",
      accept: ["boy", "little boy"],
      notes:
        "ছেলে (chhele) alone is the everyday word for boy (and son); বাচ্চা ছেলে makes clear it is a small boy. Teenagers and young men are also ছেলে.",
    }),
    girl: wd("বাচ্চা মেয়ে", "baachchaa meye", {
      meaning: "Girl (a young girl)",
      accept: ["girl", "little girl"],
      notes:
        "মেয়ে (meye) alone is the everyday word for girl (and daughter); বাচ্চা মেয়ে makes clear it is a small girl.",
    }),
    friend: wd("বন্ধু", "bondhu", {
      notes:
        "Used for male and female friends. বান্ধবী (baandhobi) = a female friend, and can also mean girlfriend.",
    }),
    neighbour: wd("প্রতিবেশী", "protibeshi", {
      notes:
        'Everyday: পাশের বাড়ির লোক (paasher baarir lok, "the people next door") or পাড়ার লোক (paaraar lok, people of the neighbourhood).',
    }),
    person: wd("মানুষ", "maanush", {
      notes:
        "Also লোক (lok). মানুষ also means a human being: ভালো মানুষ (bhaalo maanush) = a good person.",
    }),
    doctor: wd("ডাক্তার", "daaktaar", {
      notes:
        'Addressed as ডাক্তারবাবু (daaktaarbaabu) or simply "Doctor". ডাক্তার দেখানো (daaktaar dekhaano) = to see a doctor.',
    }),
    // Describing people
    tall: wd("লম্বা", "lombaa", {
      notes: 'Also means "long": লম্বা রাস্তা (lombaa raastaa, a long road).',
    }),
    short: wd("বেঁটে", "bente", {
      notes:
        'Can sound blunt about a person; ছোটখাটো (chhotokhaato, "small-built") is softer. Short in length = ছোট (chhoto).',
    }),
    good: wd("ভালো", "bhaalo", {
      notes: 'Also "well" and "fine": ভালো আছি (bhaalo aachhi, I\'m fine).',
    }),
    beautiful: wd("সুন্দর", "shundor", {
      notes:
        "For people, places and things. Very common in everyday praise: কী সুন্দর! (ki shundor!, how beautiful!).",
    }),
    young: wd("কমবয়সী", "komboyoshi", {
      notes: 'Literally "of little age". Also অল্পবয়সী (olpoboyoshi). Literary: তরুণ (torun).',
    }),
    old: wd("বয়স্ক", "boyosko", {
      notes:
        "Polite word for elderly. বুড়ো (buro, old man) / বুড়ি (buri, old woman) is colloquial and can sound rude. For things: পুরোনো (purono, old).",
    }),
    kind: wd("দয়ালু", "doyaalu", {
      notes: 'Everyday praise: খুব ভালো মানুষ (khub bhaalo maanush, "a very good person").',
    }),
    thisIsMyMother: ph("ইনি আমার মা", "ini aamaar maa", {
      notes:
        'ইনি (ini) is the respectful "this person", right when introducing an elder. In casual speech: এ আমার মা (e aamaar maa) or ও আমার মা.',
    }),
    heIsMyFriend: ph("ও আমার বন্ধু", "o aamaar bondhu", {
      notes:
        'ও (o) means "he" or "she" (someone nearby) — Bengali pronouns have no gender. Respectful: উনি (uni). সে (she) also means he/she.',
    }),
    sheIsMySister: ph("ও আমার দিদি", "o aamaar didi", {
      notes:
        'ও is the same word as "he" — context tells you it is a woman. Younger sister: ও আমার বোন (o aamaar bon).',
    }),
    myFatherIsADoctor: ph("আমার বাবা ডাক্তার", "aamaar baabaa daaktaar", {
      notes: 'No verb "is" needed. Literally "my father doctor".',
    }),
    howManyBrothers: ph("আপনার কজন ভাই আছে?", "aapnaar kojon bhaai aachhe?", {
      notes:
        'কজন (kojon) = "how many (people)"; for things use কটা (kotaa). Literally "of you how many brothers are there?". Casual: তোমার কজন ভাই?',
    }),
    iHaveOneBrother: ph("আমার একটা ছোট ভাই আছে", "aamaar ektaa chhoto bhaai aachhe", {
      notes:
        'Bengali says "I have" as "of me … is there": আমার … আছে. One elder brother: আমার একজন দাদা আছে (aamaar ekjon daadaa aachhe).',
    }),
    iHaveTwoSisters: ph("আমার দুটো বোন আছে", "aamaar duto bon aachhe", {
      notes:
        "দুটো (duto) = two (with the classifier); for people দুজন (dujon) is a little more respectful. If they are older: আমার দুজন দিদি আছে.",
    }),

    // Food › Everyday food
    rice: wd("ভাত", "bhaat", {
      notes: "Cooked rice — the centre of every Bengali meal. Uncooked rice is চাল (chaal).",
    }),
    roti: wd("রুটি", "ruti", {
      notes: "Bengalis also love লুচি (luchi, deep-fried puffed bread) and পরোটা (porotaa).",
    }),
    dal: wd("ডাল", "daal", {
      notes: "Bengali dal is often thin and eaten with rice: ভাত-ডাল (bhaat-daal).",
    }),
    vegetables: wd("সবজি", "shobji", {
      notes:
        "A cooked vegetable dish is তরকারি (torkaari). Fresh vegetables at the market: শাকসবজি (shaakshobji, greens and vegetables).",
    }),
    curd: wd("দই", "doi", {
      notes:
        "Kolkata is famous for মিষ্টি দই (mishti doi, sweet curd); plain curd is টক দই (tok doi, sour curd).",
    }),
    salt: wd("নুন", "nun", {
      notes: "Also লবণ (lobon), the more formal word and the usual word in Bangladesh.",
    }),
    sugar: wd("চিনি", "chini"),
    sweets: wd("মিষ্টি", "mishti", {
      notes:
        'Bengal is famous for its sweets: রসগোল্লা (roshogollaa), সন্দেশ (shondesh). মিষ্টি is also the adjective "sweet" and is used for a sweet-natured person.',
    }),
    // Drinks
    tea: wd("চা", "chaa", {
      notes:
        'People say চা খাওয়া (chaa khaaoyaa, literally "to eat tea"). Street tea often comes in a clay cup, ভাঁড় (bhaanr).',
    }),
    coffee: wd("কফি", "kophi"),
    milk: wd("দুধ", "dudh"),
    juice: wd("জুস", "jus", {
      notes:
        "Everyday loanword. The Bengali word is ফলের রস (pholer rosh, fruit juice); a cool sweet drink is শরবত (shorbot).",
    }),
    buttermilk: wd("ঘোল", "ghol", {
      notes: "Also মাঠা (maathaa). লস্যি (losshi, lassi) is the thicker sweet yogurt drink.",
    }),
    coconutWater: wd("ডাবের জল", "daaber jol", {
      notes: "ডাব (daab) is a green tender coconut; a ripe coconut is নারকেল (naarkel).",
    }),
    // Fruits & vegetables
    fruit: wd("ফল", "phol", {
      notes: 'ফল also means "result": পরীক্ষার ফল (porikkhaar phol, exam result).',
    }),
    banana: wd("কলা", "kolaa", { notes: 'কলা also means "art" — context tells you which.' }),
    mango: wd("আম", "aam", {
      notes: "Famous Bengal varieties: হিমসাগর (himshaagor), ল্যাংড়া (lyaangraa).",
    }),
    apple: wd("আপেল", "aapel"),
    onion: wd("পেঁয়াজ", "penyaaj"),
    tomato: wd("টমেটো", "tometo"),
    potato: wd("আলু", "aalu", {
      notes: "Bengalis put potato in almost everything, even biryani in Kolkata.",
    }),
    egg: wd("ডিম", "dim"),
    fish: wd("মাছ", "maachh", {
      notes:
        'Fish is central to Bengali food: মাছে-ভাতে বাঙালি (maachhe-bhaate baangaali, "a Bengali lives on fish and rice").',
    }),
    chicken: wd("মুরগি", "murgi", {
      notes:
        "The meat is মুরগির মাংস (murgir maangsho), but English চিকেন (chiken) is very common on menus and in speech.",
    }),
    // Hungry & thirsty
    hungry: wd("ক্ষুধার্ত", "khudhaarto", {
      notes:
        'Formal/written. In speech Bengalis use খিদে (khide, hunger): আমার খিদে পেয়েছে (aamaar khide peyechhe, "I\'m hungry").',
    }),
    thirsty: wd("তৃষ্ণার্ত", "trishnaarto", {
      notes:
        "Formal/written. In speech use তেষ্টা (teshtaa, thirst): আমার তেষ্টা পেয়েছে (aamaar teshtaa peyechhe).",
    }),
    tasty: wd("সুস্বাদু", "shushaadu", {
      notes:
        'A bit formal. In speech: খেতে ভালো (khete bhaalo, "good to eat"), দারুণ (daarun, great).',
    }),
    spicy: wd("ঝাল", "jhaal", {
      notes: "ঝাল means hot from chilli; গরম (gorom) is hot in temperature.",
    }),
    sweetTaste: wd("খেতে মিষ্টি", "khete mishti", {
      meaning: "Sweet (taste)",
      accept: ["sweet", "tastes sweet", "sweet to eat"],
      notes:
        'Literally "sweet to eat". The adjective itself is মিষ্টি (mishti), the same word as "sweets". Other tastes: টক (tok, sour), তেতো (teto, bitter), নোনতা (nontaa, salty).',
    }),
    iAmHungry: ph("আমার খিদে পেয়েছে", "aamaar khide peyechhe", {
      notes:
        'Literally "to me hunger has come" — the same for everyone, men and women, polite or casual. Very hungry: আমার খুব খিদে পেয়েছে (khub khide). Asking someone: খিদে পেয়েছে? (khide peyechhe?, "are you hungry?").',
    }),
    iAmThirsty: ph("আমার তেষ্টা পেয়েছে", "aamaar teshtaa peyechhe", {
      notes: 'Literally "to me thirst has come". Also জল তেষ্টা পেয়েছে (jol teshtaa).',
    }),
    iWantWater: ph("আমার জল চাই", "aamaar jol chaai", {
      notes:
        'Literally "of me water is wanted". In Bangladesh: আমার পানি চাই (aamaar paani chaai).',
    }),
    iWantTea: ph("আমার চা চাই", "aamaar chaa chaai", {
      notes:
        'Grammatical, but asking for tea people usually say চা খাব (chaa khaabo, "I\'ll have tea") or একটা চা দিন (ektaa chaa din).',
    }),
    iWantFood: ph("আমার খাবার চাই", "aamaar khaabaar chaai", {
      notes: 'At home people say খেতে দাও (khete daao, "give me something to eat").',
    }),
    iDontEatMeat: ph("আমি মাংস খাই না", "aami maangsho khaai naa", {
      notes:
        'Many Bengalis eat fish even if they avoid meat, so be clear: আমি নিরামিষ খাই (aami niraamish khaai, "I eat vegetarian"); আমি মাছ-মাংস খাই না (no fish or meat).',
    }),
    // Ordering food
    giveMeOneTea: ph("আমাকে একটা চা দিন", "aamaake ektaa chaa din", {
      notes:
        "At a tea stall people say দাদা, একটা চা দিন (daadaa, ektaa chaa din). Familiar: একটা চা দাও (ektaa chaa daao).",
    }),
    whatWouldYouLike: ph("আপনি কী নেবেন?", "aapni ki neben?", {
      notes:
        'Literally "what will you take?". Waiters often say just কী নেবেন? or কী খাবেন? (ki khaaben?, what will you eat?).',
    }),
    billPlease: ph("বিলটা দিন", "biltaa din", {
      notes:
        'Softer: বিলটা দেবেন? (biltaa deben?, "will you give the bill?"). The -টা means "the".',
    }),
    withoutSugar: ph("চিনি ছাড়া দিন", "chini chhaaraa din", {
      notes:
        "ছাড়া (chhaaraa) = without, placed after the noun. Less sugar: চিনি কম দিন (chini kom din).",
    }),
    isItSpicy: ph("এটা কি ঝাল?", "etaa ki jhaal?", {
      notes:
        "Also ঝাল আছে? (jhaal aachhe?). Not too spicy please: বেশি ঝাল দেবেন না (beshi jhaal deben naa).",
    }),
    itIsVeryTasty: ph("খেতে খুব ভালো হয়েছে", "khete khub bhaalo hoyechhe", {
      notes:
        'Literally "it has turned out very good to eat" — the natural compliment to a cook. Short: দারুণ হয়েছে! (daarun hoyechhe!).',
    }),
    giveMeWater: ph("একটু জল দিন", "ektu jol din", {
      notes: 'একটু (ektu, "a little") makes it polite. Familiar: একটু জল দাও (ektu jol daao).',
    }),
    oneMorePlease: ph("আরেকটা দিন", "aarektaa din", {
      notes: "আরেকটা = one more (thing). A little more: আরেকটু দিন (aarektu din).",
    }),
    breakfast: wd("জলখাবার", "jolkhaabaar", {
      notes: "Also English ব্রেকফাস্ট (brekphaast). A light snack is টিফিন (tiphin).",
    }),
    lunch: wd("দুপুরের খাবার", "dupurer khaabaar", {
      notes:
        'Literally "midday food". People often just say ভাত (bhaat): দুপুরে ভাত খেয়েছ? English লাঞ্চ (laanch) is common in offices.',
    }),
    dinner: wd("রাতের খাবার", "raater khaabaar", {
      notes: 'Literally "night food". English ডিনার (dinaar) is also used.',
    }),

    // Numbers 1–10
    one: wd("এক", "ek", {
      notes: "With things: একটা (ektaa, one piece); with people: একজন (ekjon). Bengali digit: ১.",
    }),
    two: wd("দুই", "dui", {
      notes: "Before a classifier it shortens: দুটো (duto), দুজন (dujon). Digit: ২.",
    }),
    three: wd("তিন", "tin", { notes: "তিনটে (tinte) = three things. Digit: ৩." }),
    four: wd("চার", "chaar", { notes: "Digit: ৪." }),
    five: wd("পাঁচ", "paanch", { notes: "Digit: ৫." }),
    six: wd("ছয়", "chhoy", {
      notes: "Also ছ (chho) in speech, as in ছটা (chhotaa, six o'clock). Digit: ৬.",
    }),
    seven: wd("সাত", "shaat", { notes: "Digit: ৭." }),
    eight: wd("আট", "aat", { notes: "Digit: ৮." }),
    nine: wd("নয়", "noy", {
      notes: 'Spelled like নয় (noy, "is not") — context tells them apart. Digit: ৯.',
    }),
    ten: wd("দশ", "dosh", {
      notes:
        "Digit: ১০. For phone numbers, prices and times people often switch to English numbers.",
    }),
    // Numbers 11–20
    eleven: wd("এগারো", "egaaro"),
    twelve: wd("বারো", "baaro"),
    thirteen: wd("তেরো", "tero"),
    fourteen: wd("চোদ্দ", "choddo", { notes: "Also spelled চৌদ্দ (chouddo)." }),
    fifteen: wd("পনেরো", "ponero"),
    sixteen: wd("ষোলো", "sholo"),
    seventeen: wd("সতেরো", "shotero"),
    eighteen: wd("আঠারো", "aathaaro"),
    nineteen: wd("উনিশ", "unish", { notes: 'Literally "one less than twenty" (উন = less).' }),
    twenty: wd("কুড়ি", "kuri", {
      notes:
        "Also বিশ (bish), common in Bangladesh and in formal counting. In West Bengal কুড়ি is the everyday word.",
    }),
    // Tens & big numbers
    thirty: wd("তিরিশ", "tirish", { notes: "Also ত্রিশ (trish)." }),
    forty: wd("চল্লিশ", "chollish"),
    fifty: wd("পঞ্চাশ", "ponchaash"),
    hundred: wd("একশো", "eksho", {
      notes:
        'Literally "one hundred"; শো / শ (sho) alone is "hundred": দুশো (dusho, 200), পাঁচশো (paanchsho, 500).',
    }),
    thousand: wd("হাজার", "haajaar", {
      notes:
        "এক হাজার (ek haajaar) = one thousand. Bigger: লাখ (laakh, 100,000), কোটি (koti, 10 million).",
    }),
    howMany: ph("কটা?", "kotaa?", {
      notes:
        "For things: কটা? (kotaa?); for people: কজন? (kojon?); for a quantity: কতগুলো? (kotogulo?).",
    }),
    // Age & phone numbers
    age: wd("বয়স", "boyosh"),
    year: wd("বছর", "bochhor", {
      notes:
        "A calendar year is সাল (shaal): ২০২৬ সাল. Bengali has its own calendar too, starting with বৈশাখ (Boishaakh) in April.",
    }),
    howOldAreYou: ph("আপনার বয়স কত?", "aapnaar boyosh koto?", {
      notes:
        'Literally "your age how much?". Asking an elder their age can be impolite. To a child: তোমার বয়স কত?',
    }),
    iAmTwentyYearsOld: ph("আমার বয়স কুড়ি বছর", "aamaar boyosh kuri bochhor", {
      notes: 'Literally "my age twenty years". Also আমার বয়স বিশ (bish). Short: কুড়ি (kuri).',
    }),
    phoneNumber: wd("ফোন নম্বর", "phon nombor"),
    whatIsYourPhoneNumber: ph("আপনার ফোন নম্বরটা কত?", "aapnaar phon nombortaa koto?", {
      notes:
        'Bengali asks "how much" (কত) for numbers. People usually read the digits out in English.',
    }),
    // Time of day
    time: wd("সময়", "shomoy", {
      notes: "সময় is time in general; clock time is asked with কটা বাজে? (kotaa baaje?).",
    }),
    now: wd("এখন", "ekhon", { notes: "এখনই (ekhoni) = right now." }),
    today: wd("আজ", "aaj", { notes: "Also আজকে (aajke)." }),
    tomorrow: wd("কাল", "kaal", {
      notes:
        'কাল means both "tomorrow" and "yesterday" — the verb tense tells you which: কাল যাব (I\'ll go tomorrow), কাল গিয়েছিলাম (I went yesterday). Unambiguous: আগামীকাল (aagaamikaal).',
    }),
    yesterday: wd("গতকাল", "gotokaal", {
      notes: "In everyday speech usually just কাল (kaal) with a past-tense verb.",
    }),
    morning: wd("সকাল", "shokaal", {
      notes: "সকালে (shokaale) = in the morning. Early dawn: ভোর (bhor).",
    }),
    afternoon: wd("বিকেল", "bikel", {
      notes: "বিকেল is late afternoon (about 3–5 pm). Midday / early afternoon is দুপুর (dupur).",
    }),
    evening: wd("সন্ধ্যা", "shondhyaa", {
      notes:
        "In Kolkata speech usually said and often written সন্ধে (shondhe). In the evening: সন্ধ্যায় / সন্ধেবেলা (shondhebelaa).",
    }),
    night: wd("রাত", "raat", { notes: "At night: রাতে (raate)." }),
    whatTimeIsIt: ph("কটা বাজে?", "kotaa baaje?", {
      notes: 'Literally "how many are striking?". Also এখন কটা বাজে? (ekhon kotaa baaje?).',
    }),
    itIsFiveOClock: ph("পাঁচটা বাজে", "paanchtaa baaje", {
      notes:
        "Half past five: সাড়ে পাঁচটা (shaare paanchtaa); quarter past: সোয়া পাঁচটা (shoyaa); quarter to: পৌনে পাঁচটা (poune).",
    }),
    // Days
    monday: wd("সোমবার", "shombaar", {
      notes: 'English "Monday" is also widely used, especially at work and college.',
    }),
    tuesday: wd("মঙ্গলবার", "mongolbaar"),
    wednesday: wd("বুধবার", "budhbaar"),
    thursday: wd("বৃহস্পতিবার", "brihoshpotibaar", {
      notes: "Often shortened in speech to বিষ্যুদবার (bishshudbaar).",
    }),
    friday: wd("শুক্রবার", "shukrobaar"),
    saturday: wd("শনিবার", "shonibaar"),
    sunday: wd("রবিবার", "robibaar", { notes: "Also রোববার (robbaar) in speech." }),
    day: wd("দিন", "din", {
      notes: "The day of the week is বার (baar): আজ কী বার? = what day is it?",
    }),
    week: wd("সপ্তাহ", "shoptaaho", { notes: "Colloquial: হপ্তা (hoptaa)." }),
    month: wd("মাস", "maash"),
    whatDayIsToday: ph("আজ কী বার?", "aaj ki baar?", {
      notes: 'Literally "today what weekday?". For the date: আজ কত তারিখ? (aaj koto taarikh?).',
    }),
    todayIsMonday: ph("আজ সোমবার", "aaj shombaar", { notes: 'No verb needed: "today Monday".' }),

    // Daily life › Morning & evening
    wakeUp: wd("ঘুম থেকে ওঠা", "ghum theke othaa", {
      notes: 'Literally "to rise from sleep". ওঠা (othaa) alone = to get up.',
    }),
    sleep: wd("ঘুমোনো", "ghumono", {
      notes: "Also spelled ঘুমানো (ghumaano). Going to bed: শুতে যাওয়া (shute jaaoyaa).",
    }),
    bathe: wd("স্নান করা", "snaan koraa", {
      notes:
        "Colloquial: চান করা (chaan koraa). Muslim speakers and Bangladesh: গোসল করা (goshol koraa).",
    }),
    cook: wd("রান্না করা", "raannaa koraa", {
      notes:
        "রান্না (raannaa) also means the cooking / the dish: রান্নাটা দারুণ হয়েছে (the cooking is great).",
    }),
    wash: wd("ধোয়া", "dhoyaa", {
      notes: "জামাকাপড় কাচা (jaamaakaapor kaachaa) is the usual word for washing clothes.",
    }),
    wear: wd("পরা", "poraa", {
      notes: "Do not confuse with পড়া (poraa, to read) — different letter, same sound.",
    }),
    // Study, work & play
    study: wd("পড়াশোনা করা", "poraashonaa koraa", {
      notes:
        'পড়া (poraa) alone also means "to study": কী পড়ছ? (ki porchho?) = what are you studying?',
    }),
    work: wd("কাজ করা", "kaaj koraa"),
    read: wd("পড়া", "poraa", {
      notes: 'Spelled with ড় — not পরা (to wear). Also "to study" and "to fall" (পড়ে যাওয়া).',
    }),
    write: wd("লেখা", "lekhaa"),
    play: wd("খেলা", "khelaa", {
      notes: 'খেলা is also "a game / match": আজ খেলা আছে (there\'s a match today).',
    }),
    listen: wd("শোনা", "shonaa", {
      notes: "Polite: শুনুন (shunun, please listen); familiar: শোনো (shono).",
    }),
    speak: wd("বলা", "bolaa", {
      notes: "বলা = to say / tell; to talk / chat is কথা বলা (kothaa bolaa).",
    }),
    // Sit, stand & wait
    sit: wd("বসা", "boshaa"),
    stand: wd("দাঁড়ানো", "daanraano", {
      notes: 'The request দাঁড়ান (daanraan) also means "wait!" or "stop!" in everyday speech.',
    }),
    walk: wd("হাঁটা", "haantaa", {
      notes: "On foot = হেঁটে (hente): হেঁটে পাঁচ মিনিট (five minutes on foot).",
    }),
    run: wd("দৌড়ানো", "douraano", {
      notes: "Kolkata speech also says দৌড়োনো (dourono). Run away: পালানো (paalaano).",
    }),
    wait: wd("অপেক্ষা করা", "opekkhaa koraa", {
      notes:
        'In everyday speech people more often say দাঁড়ানো (daanraano, "stand"): একটু দাঁড়ান (ektu daanraan, wait a moment).',
    }),
    open: wd("খোলা", "kholaa"),
    close: wd("বন্ধ করা", "bondho koraa", {
      notes: "বন্ধ (bondho) alone = closed / shut, also a strike day.",
    }),
    // What are you doing?
    whatAreYouDoing: ph("আপনি কী করছেন?", "aapni ki korchhen?", {
      notes: "Familiar: তুমি কী করছ? (tumi ki korchho?); intimate: কী করছিস? (ki korchhis?).",
    }),
    iAmStudying: ph("আমি পড়ছি", "aami porchhi", {
      notes: "Also আমি পড়াশোনা করছি (aami poraashonaa korchhi).",
    }),
    iAmEating: ph("আমি খাচ্ছি", "aami khaachchhi", {
      notes: '-চ্ছি (-chchhi) marks "I am …-ing".',
    }),
    iAmDrinkingWater: ph("আমি জল খাচ্ছি", "aami jol khaachchhi", {
      notes: 'Literally "I am eating water" — Bengali uses খাওয়া for drinking.',
    }),
    iAmSleeping: ph("আমি ঘুমোচ্ছি", "aami ghumochchhi", {
      notes: "Also spelled ঘুমাচ্ছি (ghumaachchhi).",
    }),
    iAmWorking: ph("আমি কাজ করছি", "aami kaaj korchhi"),
    iAmComing: ph("আমি আসছি", "aami aashchhi", {
      notes: 'আসছি (aashchhi) on its own is also a polite way to say "bye, I\'m off".',
    }),
    iAmGoing: ph("আমি যাচ্ছি", "aami jaachchhi", {
      notes:
        'When leaving, Bengalis prefer আসি / আসছি ("I come") to যাচ্ছি, which can sound like a final goodbye.',
    }),
    // My day
    everyDay: wd("রোজ", "roj", { notes: "Also প্রতিদিন (protidin), a little more formal." }),
    iAmGoingHome: ph("আমি বাড়ি যাচ্ছি", "aami baari jaachchhi", {
      notes:
        "With যাওয়া the place often needs no ending: বাড়ি যাচ্ছি. At home = বাড়িতে (baarite).",
    }),
    iAmGoingToCollege: ph("আমি কলেজে যাচ্ছি", "aami koleje jaachchhi", {
      notes: '-এ (-e) marks "to / at": কলেজে. Also আমি কলেজ যাচ্ছি without the ending.',
    }),
    iWakeUpAtSix: ph("আমি ছটায় ঘুম থেকে উঠি", "aami chhotaay ghum theke uthi", {
      notes:
        "ছটায় (chhotaay) = at six o'clock; -টায় means \"at … o'clock\". Also spelled ছ'টায়.",
    }),
    iGoToCollegeEveryDay: ph("আমি রোজ কলেজে যাই", "aami roj koleje jaai", {
      notes: "Time words usually come right after the subject.",
    }),
    iEatLunchAtOne: ph("আমি একটায় দুপুরের খাবার খাই", "aami ektaay dupurer khaabaar khaai", {
      notes:
        'In everyday speech: আমি দুপুর একটায় ভাত খাই (aami dupur ektaay bhaat khaai, "I eat rice at one in the afternoon").',
    }),
    iSleepAtTen: ph("আমি রাত দশটায় ঘুমোই", "aami raat doshtaay ghumoi", {
      notes: 'রাত দশটায় = "at ten at night". Also আমি রাত দশটায় শুতে যাই (I go to bed at ten).',
    }),

    // Places › Places in town
    school: wd("স্কুল", "skul", {
      notes: "Formal: বিদ্যালয় (biddaaloy). The English word is what everyone says.",
    }),
    college: wd("কলেজ", "kolej"),
    office: wd("অফিস", "ophis", { notes: "Formal: কার্যালয় (kaarjaaloy), seen on signs." }),
    shop: wd("দোকান", "dokaan", { notes: "Shopkeeper: দোকানদার (dokaandaar)." }),
    market: wd("বাজার", "baajaar", {
      notes: "বাজার করা (baajaar koraa) = to do the (daily food) shopping.",
    }),
    restaurant: wd("রেস্টুরেন্ট", "resturent", {
      notes: "Small eateries are often called হোটেল (hotel). Formal: রেস্তোরাঁ (restoraan).",
    }),
    // More places
    hospital: wd("হাসপাতাল", "haashpaataal"),
    station: wd("স্টেশন", "steshon", {
      notes:
        "Railway station; to be precise রেলস্টেশন (relsteshon). Kolkata's big stations: হাওড়া (Howrah), শিয়ালদা (Sealdah).",
    }),
    bank: wd("ব্যাংক", "byaank", { notes: "Also spelled ব্যাঙ্ক." }),
    temple: wd("মন্দির", "mondir", { notes: "Mosque: মসজিদ (moshjid); church: গির্জা (girjaa)." }),
    bathroom: wd("বাথরুম", "baathrum", {
      notes: "Also টয়লেট (toylet). Signs may say শৌচাগার (shouchaagaar).",
    }),
    road: wd("রাস্তা", "raastaa", {
      notes: 'Also "way / route": রাস্তা হারিয়ে ফেলেছি (I\'ve lost my way).',
    }),
    // Position words
    near: wd("কাছে", "kaachhe", {
      notes: "After a noun in the -র form: স্টেশনের কাছে (steshoner kaachhe, near the station).",
    }),
    far: wd("দূরে", "dure", { notes: "দূর (dur) = distance / far: কত দূর? (how far?)." }),
    left: wd("বাঁদিক", "baandik", { notes: "To the left: বাঁদিকে (baandike). বাঁ (baan) = left." }),
    right: wd("ডানদিক", "daandik", {
      notes: "To the right: ডানদিকে (daandike). ডান (daan) = right.",
    }),
    straight: wd("সোজা", "shojaa", { notes: 'Also means "easy, simple": খুব সোজা (very easy).' }),
    inFront: wd("সামনে", "shaamne", {
      notes: "In front of the shop: দোকানের সামনে (dokaaner shaamne).",
    }),
    behind: wd("পিছনে", "pichhone", { notes: "Kolkata speech often says পেছনে (pechhone)." }),
    inside: wd("ভিতরে", "bhitore", { notes: "Kolkata speech often says ভেতরে (bhetore)." }),
    outside: wd("বাইরে", "baire"),
    where: wd("কোথায়", "kothaay", { notes: "From where: কোথা থেকে (kothaa theke)." }),
    // Asking for directions
    whereIsTheBathroom: ph("বাথরুমটা কোথায়?", "baathrumtaa kothaay?", {
      notes: '-টা (-taa) = "the". Polite opener: একটু শুনবেন, বাথরুমটা কোথায়?',
    }),
    whereIsTheStation: ph("স্টেশনটা কোথায়?", "steshontaa kothaay?", {
      notes:
        "Also রেলস্টেশনটা কোথায়? Kolkata people may name the station: হাওড়া স্টেশন কোন দিকে? (which way to Howrah station?).",
    }),
    goStraight: ph("সোজা যান", "shojaa jaan", { notes: "To a friend: সোজা যাও (shojaa jaao)." }),
    turnLeft: ph("বাঁদিকে ঘুরুন", "baandike ghurun", {
      notes: "Also বাঁদিকে যান (baandike jaan). Familiar: বাঁদিকে ঘোরো (ghoro).",
    }),
    turnRight: ph("ডানদিকে ঘুরুন", "daandike ghurun", {
      notes: "Also ডানদিকে যান. Familiar: ডানদিকে ঘোরো.",
    }),
    itIsNear: ph("কাছেই", "kaachhei", {
      notes:
        '-ই adds emphasis: "it\'s right nearby". Also খুব কাছে (khub kaachhe) or বেশি দূর না (beshi dur naa, "not far").',
    }),
    itIsFar: ph("অনেক দূর", "onek dur", {
      notes: 'Literally "a lot of distance". Also অনেকটা দূরে (onektaa dure).',
    }),
    howFarIsIt: ph("কত দূর?", "koto dur?", { notes: "Also কতটা দূর? (kototaa dur?)." }),
    // Where are you going?
    whereAreYouGoing: ph("আপনি কোথায় যাচ্ছেন?", "aapni kothaay jaachchhen?", {
      notes:
        "Familiar: কোথায় যাচ্ছ? (kothaay jaachchho?). A common friendly greeting in the street.",
    }),
    iAmGoingToTheMarket: ph("আমি বাজারে যাচ্ছি", "aami baajaare jaachchhi"),
    whereAreYou: ph("আপনি কোথায়?", "aapni kothaay?", {
      notes: "On the phone: কোথায় আছেন? (kothaay aachhen?). Familiar: তুমি কোথায়?",
    }),
    iAmAtHome: ph("আমি বাড়িতে আছি", "aami baarite aachhi", {
      notes: '-তে (-te) = "at / in". আছি (aachhi) = I am (somewhere).',
    }),
    comeHere: ph("এদিকে আসুন", "edike aashun", {
      notes:
        'Literally "come this way". Familiar: এদিকে এসো (edike esho); intimate: এদিকে আয় (edike aay).',
    }),
    waitHere: ph("এখানে অপেক্ষা করুন", "ekhaane opekkhaa korun", {
      notes: "In everyday speech: এখানে একটু দাঁড়ান (ekhaane ektu daanraan).",
    }),

    // Shopping › Money & prices
    rupee: wd("টাকা", "taakaa", {
      notes:
        "টাকা means rupee (and money). Prices: পঞ্চাশ টাকা (fifty rupees). In Bangladesh it is the taka.",
    }),
    price: wd("দাম", "daam", {
      notes: 'দাম also means "value / worth". দরদাম করা (dordaam koraa) = to bargain.',
    }),
    buy: wd("কেনা", "kenaa"),
    sell: wd("বিক্রি করা", "bikri koraa", { notes: "Also বেচা (bechaa), more colloquial." }),
    expensive: wd("দামি", "daami", {
      notes: 'Too expensive: খুব বেশি দাম (khub beshi daam, "the price is very high").',
    }),
    cheap: wd("সস্তা", "shostaa"),
    howMuch: wd("কত", "koto", {
      notes: 'How much is it? = কত? / কত হল? (koto holo?, "how much has it come to?").',
    }),
    // Colours
    colour: wd("রং", "rong", { notes: "Also spelled রঙ. Of what colour = কী রঙের (ki ronger)." }),
    red: wd("লাল", "laal"),
    blue: wd("নীল", "nil"),
    green: wd("সবুজ", "shobuj"),
    yellow: wd("হলুদ", "holud", { notes: "Also the word for turmeric." }),
    white: wd("সাদা", "shaadaa"),
    black: wd("কালো", "kaalo"),
    // Clothes
    clothes: wd("জামাকাপড়", "jaamaakaapor"),
    shirt: wd("শার্ট", "shaart", {
      notes: "জামা (jaamaa) is a general word for a shirt, top or dress.",
    }),
    trousers: wd("প্যান্ট", "pyaant", {
      notes:
        "Formal: ট্রাউজার (traaujaar). Men's traditional wear: ধুতি (dhuti), পাঞ্জাবি (paanjaabi, kurta).",
    }),
    saree: wd("শাড়ি", "shaari", {
      notes: "A famous Bengal saree: তাঁত (taant), the cotton handloom saree.",
    }),
    shoes: wd("জুতো", "juto", { notes: "Also spelled জুতা (jutaa)." }),
    slippers: wd("চটি", "choti", { notes: "Rubber flip-flops are হাওয়াই চটি (haaoyaai choti)." }),
    // At the shop
    howMuchIsThis: ph("এটার দাম কত?", "etaar daam koto?", {
      notes: 'Literally "this one\'s price how much?". Short: এটা কত? (etaa koto?).',
    }),
    thisIsTooExpensive: ph("দামটা খুব বেশি", "daamtaa khub beshi", {
      notes:
        'Literally "the price is very much". Also বড্ড দাম! (boddo daam!, "so expensive!"). এটা খুব দামি (etaa khub daami) = this is a very expensive item.',
    }),
    reduceThePrice: ph("একটু কম করুন", "ektu kom korun", {
      notes:
        'Literally "make it a little less". Bargaining softly: দাদা, একটু কম করুন না (daadaa, ektu kom korun naa).',
    }),
    doYouHaveMangoes: ph("আম আছে?", "aam aachhe?", {
      notes:
        'Literally "mangoes are there?" — how you ask at a shop. Fuller: আপনার কাছে আম আছে? (aapnaar kaachhe aam aachhe?).',
    }),
    iNeedABag: ph("আমার একটা ব্যাগ লাগবে", "aamaar ektaa byaag laagbe", {
      notes: 'লাগবে (laagbe) = "will be needed". Also আমার একটা ব্যাগ দরকার (dorkaar, need).',
    }),
    giveMeThisOne: ph("এটা দিন", "etaa din", {
      notes: 'Emphatic "this one": এটাই দিন (etaai din). Familiar: এটা দাও (etaa daao).',
    }),
    iWillTakeIt: ph("আমি এটা নেব", "aami etaa nebo", {
      notes: 'Short: নেব (nebo, "I\'ll take it") or ঠিক আছে, নিচ্ছি (thik aachhe, nichchhi).',
    }),
    showMeThatOne: ph("ওটা দেখান", "otaa dekhaan", {
      notes: 'Softer: ওটা একটু দেখাবেন? (otaa ektu dekhaaben?, "could you show me that one?").',
    }),
    doYouHaveARedOne: ph("লাল রঙের আছে?", "laal ronger aachhe?", {
      notes: 'Literally "of red colour is there?".',
    }),

    // Travel › Getting around
    bus: wd("বাস", "baas"),
    train: wd("ট্রেন", "tren", {
      notes:
        "Older Bengali word: রেলগাড়ি (relgaari). Kolkata suburban trains are called লোকাল (lokaal).",
    }),
    autoRickshaw: wd("অটো", "oto", {
      notes:
        'From "auto". রিকশা (rikshaa) is a cycle-rickshaw. Kolkata also has the hand-pulled rickshaw and the টোটো (toto, e-rickshaw).',
    }),
    taxi: wd("ট্যাক্সি", "tyaaksi", {
      notes: "Kolkata's yellow taxis are famous. App cabs are called ক্যাব (kyaab).",
    }),
    car: wd("গাড়ি", "gaari", {
      notes: "গাড়ি means any vehicle; to be precise people say প্রাইভেট গাড়ি or কার.",
    }),
    bike: wd("বাইক", "baaik", {
      notes:
        "Also মোটরসাইকেল (motorsaaikel). A scooter is স্কুটার (skutaar). বাইক can also mean a bicycle in casual speech; that is সাইকেল (saaikel).",
    }),
    // Tickets & stations
    ticket: wd("টিকিট", "tikit"),
    platform: wd("প্ল্যাটফর্ম", "plyaatphorm"),
    busStop: wd("বাস স্টপ", "baas stop", {
      notes: "A bus terminus is a বাসস্ট্যান্ড (baasstyaand).",
    }),
    airport: wd("এয়ারপোর্ট", "eyaarport", {
      notes: "Formal Bengali: বিমানবন্দর (bimaanbondor), seen on signs.",
    }),
    luggage: wd("মালপত্র", "maalpotro", { notes: "Casual: মাল (maal) or ব্যাগপত্র (byaagpotro)." }),
    journey: wd("যাত্রা", "jaatraa", {
      notes:
        "A trip for pleasure: বেড়াতে যাওয়া (beraate jaaoyaa, to go on an outing). যাত্রা is also Bengal's folk theatre.",
    }),
    // When & how long?
    when: wd("কখন", "kokhon", {
      notes:
        "কখন asks the time of day; কবে (kobe) asks which day: পরীক্ষা কবে? (when is the exam?).",
    }),
    howLong: wd("কতক্ষণ", "kotokkhon", {
      notes: "For days or longer: কতদিন (kotodin, how many days).",
    }),
    late: wd("দেরি", "deri", {
      notes:
        'Literally "delay": দেরি হয়ে গেছে (deri hoye gechhe, it\'s got late). English লেট (let) is very common.',
    }),
    early: wd("সকাল সকাল", "shokaal shokaal", {
      meaning: "Early (in the day)",
      accept: ["early"],
      notes:
        '"Nice and early". For "early / soon" in general Bengalis say তাড়াতাড়ি (taaraataari): তাড়াতাড়ি এসো (come early).',
    }),
    quickly: wd("তাড়াতাড়ি", "taaraataari", {
      notes: 'Also "early, soon". Hurry up: তাড়াতাড়ি করুন (taaraataari korun).',
    }),
    slowly: wd("আস্তে", "aaste", {
      notes: 'Also "softly". Doubled for emphasis: আস্তে আস্তে (slowly, gradually).',
    }),
    whenDoesTheBusCome: ph("বাস কখন আসবে?", "baas kokhon aashbe?", {
      notes: 'Literally "when will the bus come?". The next bus: পরের বাস (porer baas).',
    }),
    howLongDoesItTake: ph("কতক্ষণ লাগবে?", "kotokkhon laagbe?", {
      notes: "লাগা (laagaa) = to take (time / money).",
    }),
    theTrainIsLate: ph("ট্রেনটা দেরিতে চলছে", "trentaa derite cholchhe", {
      notes: 'Literally "the train is running late". Everyday: ট্রেন লেট আছে (tren let aachhe).',
    }),
    oneTicketPlease: ph("শিলিগুড়ির একটা টিকিট দিন", "Siligurir ektaa tikit din", {
      meaning: "One ticket to Siliguri, please.",
      accept: ["a ticket to siliguri please", "one ticket for siliguri please"],
      notes:
        'The -র (-r) ending = "of / for": শিলিগুড়ির টিকিট = a Siliguri ticket. Also: দুর্গাপুরের একটা টিকিট (Durgapurer), আসানসোলের (Asansoler).',
    }),
    whichPlatform: ph("কত নম্বর প্ল্যাটফর্ম?", "koto nombor plyaatphorm?", {
      notes: 'Literally "platform number how much?". Also কোন প্ল্যাটফর্ম? (kon plyaatphorm?).',
    }),
    stopHerePlease: ph("এখানে থামুন", "ekhaane thaamun", {
      notes:
        'To a taxi or auto driver people say দাদা, এখানে রাখুন (ekhaane raakhun) or এখানে দাঁড়ান. On a bus, tell the conductor: দাদা, এখানে নামব (daadaa, ekhaane naambo, "I\'ll get off here").',
    }),
    goSlowlyPlease: ph("আস্তে চালান", "aaste chaalaan", {
      notes: 'Literally "drive slowly". Softer: একটু আস্তে চালাবেন (ektu aaste chaalaaben).',
    }),
    howMuchToStation: ph("স্টেশন যেতে কত লাগবে?", "steshon jete koto laagbe?", {
      notes:
        'Literally "to go to the station how much will it take?". Fare: ভাড়া (bhaaraa): ভাড়া কত?',
    }),
    iAmLost: ph("আমি রাস্তা হারিয়ে ফেলেছি", "aami raastaa haariye phelechhi", {
      notes:
        'Literally "I have lost the road". Also আমি রাস্তা চিনতে পারছি না (I can\'t recognise the way).',
    }),
    doesThisBusGoToStation: ph("এই বাসটা কি স্টেশন যাবে?", "ei baastaa ki steshon jaabe?", {
      notes:
        'Literally "will this bus go to the station?" — Bengalis use the future here. Often to the conductor: দাদা, হাওড়া যাবে? (will it go to Howrah?).',
    }),

    // Everyday conversations
    whatsNew: ph("কী খবর?", "ki khobor?", {
      notes:
        'Literally "what news?" — a very common friendly greeting. Reply: এই তো, চলছে (ei to, cholchhe, "same old, going on").',
    }),
    longTimeNoSee: ph("অনেকদিন পর দেখা হল", "onekdin por dekhaa holo", {
      notes: 'Literally "we met after many days". Also কতদিন পর! (kotodin por!, "after so long!").',
    }),
    haveYouEaten: ph("খাওয়া হয়েছে?", "khaaoyaa hoyechhe?", {
      notes:
        'Literally "has eating happened?" — a caring everyday question. Direct forms: আপনি খেয়েছেন? (polite), খেয়েছ? (familiar).',
    }),
    yesIAte: ph("হ্যাঁ, খেয়েছি", "hyaan, kheyechhi", {
      notes:
        'The present perfect খেয়েছি = "I have eaten". Not yet: না, এখনও খাইনি (naa, ekhono khaaini).',
    }),
    whatIsTheNameOfThisPlace: ph("এই জায়গাটার নাম কী?", "ei jaaygaataar naam ki?", {
      notes: 'Literally "this place\'s name what?".',
    }),
    hello_onPhone: ph("হ্যালো?", "hyaalo?", {
      notes:
        'On the phone Bengalis use English "hello". Respectful callers may add নমস্কার after it.',
    }),
    whoIsSpeaking: ph("কে বলছেন?", "ke bolchhen?", {
      notes:
        'Literally "who is speaking?" (polite). The caller answers আমি রবি বলছি (aami Robi bolchhi, "Ravi speaking").',
    }),
    callYouLater: ph("আমি আপনাকে পরে ফোন করব", "aami aapnaake pore phon korbo", {
      notes: "Familiar: তোমাকে পরে ফোন করব (tomaake pore phon korbo). Short: পরে ফোন করছি.",
    }),
    canYouHearMe: ph("আমার কথা শুনতে পাচ্ছেন?", "aamaar kothaa shunte paachchhen?", {
      notes:
        'Literally "are you able to hear my words?". Familiar: শুনতে পাচ্ছ? (shunte paachchho?).',
    }),
    whereIsTheClass: ph("ক্লাসরুমটা কোথায়?", "klaasrumtaa kothaay?", {
      notes: "Students also say ক্লাসটা কোথায় হচ্ছে? (where is the class happening?).",
    }),
    whenIsTheExam: ph("পরীক্ষা কবে?", "porikkhaa kobe?", {
      notes: 'কবে (kobe) asks "which day". Also English এক্সাম (eksaam).',
    }),
    canIComeIn: ph("ভিতরে আসতে পারি?", "bhitore aashte paari?", {
      notes:
        'Very commonly just আসব? (aashbo?, "shall I come?"). In schools and colleges students say "May I come in?" in English.',
    }),
    justAMinute: ph("এক মিনিট", "ek minit", {
      notes: 'Also একটু দাঁড়ান (ektu daanraan, "wait a little").',
    }),
    ofCourse: ph("অবশ্যই", "oboshshoi", {
      notes:
        'Also নিশ্চয়ই (nishchoyi, "certainly"). Casual: হ্যাঁ হ্যাঁ, কেন নয় (hyaan hyaan, keno noy, "yes, why not").',
    }),
    isThisSeatFree: ph("এই সিটটা কি খালি?", "ei sittaa ki khaali?", {
      notes:
        'খালি (khaali) = empty, free. Also এখানে বসতে পারি? (ekhaane boshte paari?, "can I sit here?").',
    }),

    // Grammar › Pronouns
    youCasual: wd("তুমি", "tumi", {
      notes:
        'Familiar "you" for friends, family and people your age. Even more intimate is তুই (tui), for very close friends, younger siblings and small children. Verbs change: তুমি খাও (khaao), তুই খাস (khaash), আপনি খান (khaan).',
    }),
    he: wd("সে", "she", {
      notes:
        'Pronounced "she" but means he OR she — Bengali pronouns have no gender. Everyday speech often uses ও (o, he/she nearby); respectful forms are তিনি (tini) and উনি (uni).',
    }),
    she: wd("ও", "o", {
      notes:
        'ও (o) means "he" or "she" (someone near or known); সে (she) is the same. Respectful: উনি (uni). Context, not the word, tells you it\'s a woman.',
    }),
    we: wd("আমরা", "aamraa", {
      notes: 'Only one word for "we" (no inclusive/exclusive difference). Our = আমাদের (aamaader).',
    }),
    they: wd("তারা", "taaraa", {
      notes: "Everyday speech: ওরা (oraa). Respectful: তাঁরা (taanraa) / ওঁরা (onraa).",
    }),
    itPronoun: wd("সেটা", "shetaa", {
      notes: 'Bengali uses এটা (this), ওটা (that) and সেটা (that/it, already mentioned) for "it".',
    }),
    // Word order & the present
    iEatRice: ph("আমি ভাত খাই", "aami bhaat khaai", {
      notes: 'Subject – object – verb: literally "I rice eat".',
    }),
    sheDrinksTea: ph("ও চা খায়", "o chaa khaay", {
      notes:
        "Also সে চা খায় (she chaa khaay). Respectful: উনি চা খান (uni chaa khaan). The same verb is used for he or she.",
    }),
    weGoToCollege: ph("আমরা কলেজে যাই", "aamraa koleje jaai"),
    heReadsABook: ph("সে বই পড়ে", "she boi pore", {
      notes: "Right now: সে বই পড়ছে (she boi porchhe, he/she is reading a book).",
    }),
    theyLiveInIndia: ph("তারা ভারতে থাকে", "taaraa bhaarote thaake", {
      notes: "Everyday: ওরা ভারতে থাকে (oraa bhaarote thaake).",
    }),
    myMotherCooksFood: ph("আমার মা রান্না করেন", "aamaar maa raannaa koren", {
      notes:
        "রান্না করা = to cook (food is understood). -এন (-en) is the respectful ending; many Kolkata families say the plain form: মা রান্না করে (maa raannaa kore).",
    }),
    iSpeakEnglish: ph("আমি ইংরেজি বলতে পারি", "aami ingreji bolte paari", {
      notes:
        'Literally "I can speak English" — the natural way to say it. আমি ইংরেজিতে কথা বলি (ingrejite kothaa boli) = I talk in English.',
    }),
    // Past & future
    iAteRice: ph("আমি ভাত খেলাম", "aami bhaat khelaam", {
      notes:
        "Simple past. For something just done people often use the present perfect: আমি ভাত খেয়েছি (kheyechhi).",
    }),
    iWillEatRice: ph("আমি ভাত খাব", "aami bhaat khaabo", {
      notes: 'Future -ব (-bo). Also means "I\'ll have rice" when ordering.',
    }),
    iWentToTheMarketYesterday: ph("আমি কাল বাজারে গিয়েছিলাম", "aami kaal baajaare giyechhilaam", {
      notes:
        "কাল + past tense = yesterday. Kolkata speech often shortens গিয়েছিলাম to গেছিলাম (gechhilaam). Also আমি কাল বাজারে গেলাম.",
    }),
    iWillGoTomorrow: ph("আমি কাল যাব", "aami kaal jaabo", {
      notes: "কাল + future tense = tomorrow.",
    }),
    sheCameYesterday: ph("ও কাল এসেছিল", "o kaal eshechhilo", {
      notes: "Respectful: উনি কাল এসেছিলেন (uni kaal eshechhilen).",
    }),
    weWillComeTomorrow: ph("আমরা কাল আসব", "aamraa kaal aashbo"),
    // Questions & negatives
    why: wd("কেন", "keno"),
    how: wd("কীভাবে", "kibhaabe", {
      notes: '"In what way". For condition ("how are you") use কেমন (kemon).',
    }),
    which: wd("কোন", "kon", {
      notes: "Before a noun: কোন বাস? (which bus?). On its own: কোনটা? (kontaa?, which one?).",
    }),
    doYouEatMeat: ph("আপনি কি মাংস খান?", "aapni ki maangsho khaan?", {
      notes:
        "কি after the subject makes a yes/no question. Fish is asked about separately: মাছ খান? (maachh khaan?).",
    }),
    iDontKnow: ph("আমি জানি না", "aami jaani naa", {
      notes: "না comes after the verb. Casual: জানি না (jaani naa).",
    }),
    isThisYourBook: ph("এটা কি আপনার বই?", "etaa ki aapnaar boi?", {
      notes: "Familiar: এটা কি তোমার বই? (etaa ki tomaar boi?).",
    }),
    thisIsNotMyBook: ph("এটা আমার বই নয়", "etaa aamaar boi noy", {
      notes: 'নয় (noy) = "is not". In speech often এটা আমার বই না (naa).',
    }),
    whyAreYouLate: ph("আপনার দেরি হল কেন?", "aapnaar deri holo keno?", {
      notes:
        'Literally "why did your delay happen?". Familiar: তোমার দেরি হল কেন? A teacher might say দেরি কেন? (deri keno?).',
    }),
    howDoYouGoToCollege: ph("আপনি কীভাবে কলেজে যান?", "aapni kibhaabe koleje jaan?", {
      notes:
        'Familiar: তুমি কলেজে কীসে যাও? (kishe jaao?, "by what do you go?"). Answer: বাসে (baase, by bus), মেট্রোতে (by metro).',
    }),
    // Possession & small words
    inPostposition: wd("মধ্যে", "moddhe", {
      meaning: "In (inside, within)",
      accept: ["in", "inside", "within", "among"],
      notes:
        'Used after the -র form: বাক্সের মধ্যে (baakser moddhe, in the box). Most often "in" is just the ending -এ / -তে: ঘরে (ghore, in the room), কলকাতায় (in Kolkata).',
    }),
    onPostposition: wd("ওপরে", "opore", {
      notes:
        "Also spelled উপরে. After the -র form: টেবিলের ওপর(ে) (tebiler opor(e), on the table).",
    }),
    withPostposition: wd("সঙ্গে", "shonge", {
      notes:
        "Also সাথে (shaathe). After the -র form: বন্ধুর সঙ্গে (bondhur shonge, with a friend).",
    }),
    fromPostposition: wd("থেকে", "theke", {
      notes:
        'Follows the noun directly: বাড়ি থেকে (baari theke, from home). Also means "than" in comparisons.',
    }),
    table: wd("টেবিল", "tebil"),
    thisIsMyBook: ph("এটা আমার বই", "etaa aamaar boi", {
      notes: 'No "is" needed: "this my book".',
    }),
    hisNameIsRavi: ph("ওর নাম রবি", "or naam Robi", {
      notes:
        "Ravi is pronounced Robi in Bengali. Respectful: ওঁর নাম (onr naam) / ওনার নাম (onaar naam).",
    }),
    theBookIsOnTheTable: ph("বইটা টেবিলের ওপর আছে", "boitaa tebiler opor aachhe", {
      notes: 'বইটা = the book; টেবিলের ওপর = on the table ("table\'s top"); আছে = is (located).',
    }),
    iGoWithMyFriend: ph("আমি আমার বন্ধুর সঙ্গে যাই", "aami aamaar bondhur shonge jaai", {
      notes:
        "বন্ধুর (bondhur) = of the friend, needed before সঙ্গে. আমি is often dropped: বন্ধুর সঙ্গে যাই.",
    }),
    sheIsComingFromHome: ph("ও বাড়ি থেকে আসছে", "o baari theke aashchhe", {
      notes: "Respectful: উনি বাড়ি থেকে আসছেন (uni … aashchhen).",
    }),
    // Polite & casual
    comeCasual: ph("এসো", "esho", {
      notes:
        "তুমি form. With a very close friend or a child (তুই): আয় (aay)! Polite: আসুন (aashun).",
    }),
    comePolite: ph("আসুন", "aashun", {
      notes:
        "আপনি form, used to welcome guests: আসুন, ভিতরে আসুন (come in). Very polite: আসবেন (aashben).",
    }),
    sitCasual: ph("বসো", "bosho", { notes: "তুমি form. তুই form: বস (bosh)." }),
    sitPolite: ph("বসুন", "boshun", {
      notes: "আপনি form. Hosts say বসুন, বসুন to make a guest comfortable.",
    }),
    eatPolite: ph("নিন, খান", "nin, khaan", {
      notes:
        'Literally "take, eat" — what a host says offering food. Also খেয়ে নিন (kheye nin, "please eat"); urging more: আরেকটু নিন (aarektu nin). To a friend: খাও (khaao).',
    }),
    howAreYouCasual: ph("কেমন আছো?", "kemon aachho?", {
      notes:
        "তুমি form (তুমি often dropped). To a very close friend: কেমন আছিস? (kemon aachhis?) or just কী রে? (ki re?).",
    }),

    // Feelings
    happy: wd("খুশি", "khushi", { notes: "Also আনন্দ (aanondo, joy). খুব খুশি = very happy." }),
    sad: wd("মন খারাপ", "mon khaaraap", {
      notes:
        'Literally "mind bad" — the everyday way to say sad or low. Formal: দুঃখী (dukkhi), দুঃখিত (also "sorry").',
    }),
    angry: wd("রাগ", "raag", {
      meaning: "Angry (anger)",
      accept: ["angry", "anger"],
      notes:
        'রাগ is "anger"; to be angry is রেগে থাকা: আমি রেগে আছি (I am angry). রাগী (raagi) = short-tempered.',
    }),
    tired: wd("ক্লান্ত", "klaanto", {
      notes:
        "Everyday speech often uses English টায়ার্ড (taayaard): খুব টায়ার্ড লাগছে (I feel very tired).",
    }),
    scared: wd("ভয়", "bhoy", {
      meaning: "Scared (fear)",
      accept: ["scared", "fear", "afraid"],
      notes:
        "ভয় is \"fear\": ভয় পাওয়া (bhoy paaoyaa) = to be scared. আমার ভয় করছে = I'm scared. Don't be scared: ভয় পেও না (bhoy peo naa).",
    }),
    worried: wd("চিন্তিত", "chintito", {
      notes: 'Everyday: চিন্তা হচ্ছে (chintaa hochchhe, "worry is happening" = I\'m worried).',
    }),
    iAmHappy: ph("আমি খুশি", "aami khushi", {
      notes: "Very happy: আমি খুব খুশি. Also আমার খুব ভালো লাগছে (I feel very good).",
    }),
    iAmSad: ph("আমার মন খারাপ", "aamaar mon khaaraap", {
      notes:
        'Literally "my mind is bad". Asking a friend: কী হয়েছে? মন খারাপ? (what happened? feeling low?).',
    }),
    iAmTired: ph("আমি ক্লান্ত", "aami klaanto", {
      notes: "In speech: আমি খুব টায়ার্ড or শরীর ক্লান্ত লাগছে (I feel tired).",
    }),
    iAmAngry: ph("আমি রেগে আছি", "aami rege aachhi", {
      notes: 'Literally "I am in an angry state". I got angry: আমি রেগে গেছি (aami rege gechhi).',
    }),
    iAmOkay: ph("আমি ঠিক আছি", "aami thik aachhi", { notes: 'Literally "I am all right".' }),
    iAmNotFeelingWell: ph("আমার শরীরটা ভালো লাগছে না", "aamaar shorirtaa bhaalo laagchhe naa", {
      notes:
        'Literally "my body isn\'t feeling good". Short: শরীর ভালো নেই (shorir bhaalo nei, "I\'m not well").',
    }),
    dontWorry: ph("চিন্তা করবেন না", "chintaa korben naa", {
      notes:
        'Familiar: চিন্তা কোরো না (chintaa koro naa). Very common: চিন্তা নেই! (chintaa nei!, "no worries!").',
    }),
    iAmScared: ph("আমার ভয় করছে", "aamaar bhoy korchhe", {
      notes: 'Literally "fear is happening to me". Also আমি ভয় পাচ্ছি (aami bhoy paachchhi).',
    }),
    // Body
    head: wd("মাথা", "maathaa"),
    hand: wd("হাত", "haat", { notes: "হাত covers the hand and the arm." }),
    leg: wd("পা", "paa", {
      notes:
        "পা covers the leg and the foot. Touching an elder's feet (প্রণাম, pronaam) is a sign of respect.",
    }),
    eye: wd("চোখ", "chokh"),
    ear: wd("কান", "kaan"),
    mouth: wd("মুখ", "mukh", { notes: 'মুখ also means "face".' }),
    stomach: wd("পেট", "pet"),
    tooth: wd("দাঁত", "daant", {
      notes: "Same word for tooth and teeth. To brush teeth: দাঁত মাজা (daant maajaa).",
    }),
    // At the doctor
    fever: wd("জ্বর", "jor", { notes: 'Pronounced "jor" — the ব-ফলা is silent.' }),
    medicine: wd("ওষুধ", "oshudh", {
      notes: "Also spelled ঔষধ (formal). Pharmacy: ওষুধের দোকান (oshudher dokaan).",
    }),
    iHaveAFever: ph("আমার জ্বর হয়েছে", "aamaar jor hoyechhe", {
      notes: 'Literally "to me fever has happened".',
    }),
    iHaveAHeadache: ph("আমার মাথা ব্যথা করছে", "aamaar maathaa byathaa korchhe", {
      notes:
        'Literally "my head is aching". ব্যথা is pronounced close to "bethaa". Also মাথা ধরেছে (maathaa dhorechhe, "my head has seized up").',
    }),
    myStomachHurts: ph("আমার পেট ব্যথা করছে", "aamaar pet byathaa korchhe", {
      notes: "Upset stomach: পেট খারাপ (pet khaaraap).",
    }),
    iNeedADoctor: ph("আমার একজন ডাক্তার লাগবে", "aamaar ekjon daaktaar laagbe", {
      notes:
        'Also আমাকে ডাক্তার দেখাতে হবে (aamaake daaktaar dekhaate hobe, "I have to see a doctor").',
    }),
    callADoctor: ph("একজন ডাক্তার ডাকুন", "ekjon daaktaar daakun", {
      notes: "Urgent: তাড়াতাড়ি ডাক্তার ডাকুন! Familiar: ডাক্তার ডাকো (daaktaar daako).",
    }),
    takeThisMedicine: ph("এই ওষুধটা খান", "ei oshudhtaa khaan", {
      notes: 'Medicine is "eaten" in Bengali. Familiar: ওষুধটা খেয়ে নাও (oshudhtaa kheye naao).',
    }),
    // Love & friendship
    iLoveYou: ph("আমি তোমাকে ভালোবাসি", "aami tomaake bhaalobaashi", {
      notes:
        'Romantic "I love you", always with তুমি (or তোকে, toke, between very close partners) — never আপনি. Families rarely say it aloud; love is shown by care. Young people also say "love you" in English.',
    }),
    iLikeYou: ph("আমার তোমাকে ভালো লাগে", "aamaar tomaake bhaalo laage", {
      notes:
        'Literally "to me you feel good" — the usual way to say you like someone, often a shy romantic hint. Polite: আপনাকে আমার ভালো লাগে.',
    }),
    iMissYou: ph("তোমার কথা খুব মনে পড়ছে", "tomaar kothaa khub mone porchhe", {
      notes:
        'Literally "your words keep coming to my mind" — natural for family and friends too. Young people often say আমি তোমাকে মিস করছি (aami tomaake mis korchhi) using English "miss". To an elder (আপনি): আপনার কথা খুব মনে পড়ছে (aapnaar kothaa khub mone porchhe); to a close friend (তুই): তোর কথা খুব মনে পড়ছে (tor kothaa…).',
    }),
    iLoveMyFamily: ph("আমি আমার পরিবারকে ভালোবাসি", "aami aamaar poribaarke bhaalobaashi", {
      notes:
        'Correct but a little bookish. In conversation: বাড়ির লোকদের আমি খুব ভালোবাসি (baarir lokder aami khub bhaalobaashi, "I really love the people at home").',
    }),
    youAreMyFriend: ph("তুমি আমার বন্ধু", "tumi aamaar bondhu", {
      notes:
        "Friends use তুমি or তুই: তুই আমার বন্ধু (tui aamaar bondhu) is warmer. Polite আপনি is rare between friends.",
    }),
    youAreMyBestFriend: ph("তুমি আমার সবচেয়ে ভালো বন্ধু", "tumi aamaar shobcheye bhaalo bondhu", {
      notes:
        'সবচেয়ে (shobcheye) = "than all", the superlative. Many young people just say "best friend" in English: তুই আমার বেস্ট ফ্রেন্ড.',
    }),
    iLikeThis: ph("আমার এটা ভালো লাগে", "aamaar etaa bhaalo laage", {
      notes:
        'Literally "to me this feels good". Right now: আমার এটা ভালো লাগছে (laagchhe). Also এটা আমার পছন্দ (pochhondo, liking).',
    }),
    iDontLikeThis: ph("আমার এটা ভালো লাগে না", "aamaar etaa bhaalo laage naa", {
      notes: "Also এটা আমার পছন্দ নয় (etaa aamaar pochhondo noy).",
    }),
    takeCare: ph("ভালো থাকবেন", "bhaalo thaakben", {
      notes:
        'Literally "stay well" (polite) — said when parting. Familiar: ভালো থেকো (bhaalo theko). "Look after yourself": নিজের খেয়াল রেখো (nijer kheyaal rekho).',
    }),

    // Weather
    weather: wd("আবহাওয়া", "aabohaaoyaa"),
    hot: wd("গরম", "gorom", {
      notes: 'Hot in temperature (also "summer": গরমকাল). Spicy-hot is ঝাল (jhaal).',
    }),
    cold: wd("ঠান্ডা", "thaandaa", {
      notes: 'Also "a cold" (illness): ঠান্ডা লেগেছে (I\'ve caught a cold). Winter is শীত (shit).',
    }),
    rain: wd("বৃষ্টি", "brishti"),
    sun: wd("সূর্য", "shurjo", { notes: "Sunshine is রোদ (rod): খুব রোদ (very sunny)." }),
    wind: wd("হাওয়া", "haaoyaa", {
      notes: "Also বাতাস (baataash). Strong wind: ঝড় (jhor, storm).",
    }),
    itIsHotToday: ph("আজ খুব গরম", "aaj khub gorom", {
      notes:
        'Literally "today very hot". Also আজ বেশ গরম পড়েছে (aaj besh gorom porechhe, "quite a heat has fallen today").',
    }),
    itIsRaining: ph("বৃষ্টি হচ্ছে", "brishti hochchhe", {
      notes:
        'Literally "rain is happening". Also বৃষ্টি পড়ছে (brishti porchhe, "rain is falling").',
    }),
    itIsColdToday: ph("আজ খুব ঠান্ডা", "aaj khub thaandaa", {
      notes: "Also আজ বেশ ঠান্ডা পড়েছে (aaj besh thaandaa porechhe).",
    }),
    // College & work
    classroom: wd("ক্লাস", "klaas", {
      notes: "Both the lesson and the room. Formal: শ্রেণিকক্ষ (shrenikokkho).",
    }),
    exam: wd("পরীক্ষা", "porikkhaa", { notes: "Students also say English এক্সাম (eksaam)." }),
    homework: wd("বাড়ির কাজ", "baarir kaaj", {
      notes: 'Literally "home work". Students usually say হোমওয়ার্ক (homoyaark).',
    }),
    job: wd("চাকরি", "chaakri", { notes: "Work in general: কাজ (kaaj)." }),
    holiday: wd("ছুটি", "chhuti", {
      notes:
        "Also leave from work: ছুটি নেওয়া (chhuti neoyaa, to take leave). Holidays/vacation: ছুটির দিন.",
    }),
    iHaveAnExamTomorrow: ph("কাল আমার পরীক্ষা আছে", "kaal aamaar porikkhaa aachhe", {
      notes: 'Literally "tomorrow of me exam is there".',
    }),
    todayIsAHoliday: ph("আজ ছুটি", "aaj chhuti", { notes: "Also আজ ছুটির দিন (aaj chhutir din)." }),
    iWorkInAnOffice: ph("আমি একটা অফিসে কাজ করি", "aami ektaa ophise kaaj kori", {
      notes: 'একটা here means "an". Also আমি চাকরি করি (aami chaakri kori, "I have a job").',
    }),
    // Hobbies
    music: wd("সংগীত", "shonggit", {
      notes:
        "Formal. In everyday speech music is just গান (gaan) or গানবাজনা (gaanbaajnaa, songs and music).",
    }),
    movie: wd("সিনেমা", "sinemaa", {
      notes:
        'Also ছবি (chhobi, "picture") and ফিল্ম. Kolkata\'s film industry is called Tollywood (টালিগঞ্জ).',
    }),
    song: wd("গান", "gaan", {
      notes: "To sing: গান গাওয়া (gaan gaaoyaa). To listen to music: গান শোনা (gaan shonaa).",
    }),
    cricket: wd("ক্রিকেট", "kriket", {
      notes: "In Kolkata football (ফুটবল) is just as big a passion — Mohun Bagan vs East Bengal.",
    }),
    dance: wd("নাচ", "naach", { notes: "To dance: নাচা (naachaa)." }),
    iLikeMusic: ph("আমার গান শুনতে ভালো লাগে", "aamaar gaan shunte bhaalo laage", {
      notes:
        'Literally "to me listening to songs feels good" — Bengalis say "listening to songs" for liking music.',
    }),
    doYouLikeCricket: ph("আপনার কি ক্রিকেট ভালো লাগে?", "aapnaar ki kriket bhaalo laage?", {
      notes:
        "Familiar: তোমার ক্রিকেট ভালো লাগে? Also ক্রিকেট পছন্দ করেন? (kriket pochhondo koren?).",
    }),
    iLikeWatchingMovies: ph("আমার সিনেমা দেখতে ভালো লাগে", "aamaar sinemaa dekhte bhaalo laage", {
      notes: "দেখতে (dekhte) = to watch; the pattern is আমার + verb-তে + ভালো লাগে.",
    }),
    whatIsYourHobby: ph("আপনার শখ কী?", "aapnaar shokh ki?", {
      notes: "শখ (shokh) = hobby, a passion. Also English হবি (hobi).",
    }),
    // Plans & invitations
    letsGo: ph("চলো যাই", "cholo jaai", {
      notes:
        "Familiar. Polite: চলুন যাই (cholun jaai). Often just চলো! (cholo!) or চল! (chol!) to a close friend.",
    }),
    comeToMyHouse: ph("আমাদের বাড়িতে আসুন", "aamaader baarite aashun", {
      notes:
        'Bengalis say "our house" (আমাদের বাড়ি) for their home. Common invitation: একদিন আমাদের বাড়ি আসুন (ekdin …, "come over some day"). Familiar: আমাদের বাড়ি এসো.',
    }),
    areYouFreeTomorrow: ph("আপনি কি কাল ফাঁকা আছেন?", "aapni ki kaal phaankaa aachhen?", {
      notes:
        "ফাঁকা (phaankaa) = free, empty. Very common with English: কাল ফ্রি আছ? (kaal phri aachho?). Also কাল আপনার সময় হবে? (will you have time tomorrow?).",
    }),
    yesIWillCome: ph("হ্যাঁ, আমি আসব", "hyaan, aami aashbo", {
      notes: "Short: হ্যাঁ, আসব. Definitely: নিশ্চয়ই আসব (nishchoyi aashbo).",
    }),
    sorryICantCome: ph("দুঃখিত, আমি আসতে পারব না", "dukkhito, aami aashte paarbo naa", {
      notes: 'In speech: সরি, আসতে পারব না. পারব না = "I won\'t be able to".',
    }),
    seeYouTomorrow: ph("কাল দেখা হবে", "kaal dekhaa hobe", {
      notes: 'Literally "tomorrow there will be a meeting".',
    }),
    // Requests & help
    canYouHelpMe: ph(
      "আপনি কি আমাকে একটু সাহায্য করতে পারবেন?",
      "aapni ki aamaake ektu shaahaajjo korte paarben?",
      {
        notes:
          'Literally "will you be able to help me a little?". Familiar: আমাকে একটু হেল্প করবে? (help korbe?).',
      },
    ),
    iNeedHelp: ph("আমার সাহায্য দরকার", "aamaar shaahaajjo dorkaar", {
      notes: 'দরকার (dorkaar) = need: "to me help is needed".',
    }),
    pleaseHelpMe: ph("দয়া করে আমাকে সাহায্য করুন", "doyaa kore aamaake shaahaajjo korun", {
      notes: "Without দয়া করে it is still polite: আমাকে একটু সাহায্য করুন.",
    }),
    pleaseWait: ph("একটু অপেক্ষা করুন", "ektu opekkhaa korun", {
      notes: "In everyday speech: একটু দাঁড়ান (ektu daanraan). Familiar: একটু দাঁড়াও (daanraao).",
    }),
    pleaseTellMe: ph("আমাকে একটু বলুন", "aamaake ektu bolun", {
      notes: 'Also বলুন (bolun) alone = "tell me / go ahead". Familiar: বলো (bolo).',
    }),
    pleaseShowMe: ph("আমাকে একটু দেখান", "aamaake ektu dekhaan", {
      notes: "Familiar: একটু দেখাও (ektu dekhaao).",
    }),
    callMe: ph("আমাকে ফোন করবেন", "aamaake phon korben", {
      notes:
        'The future polite form is a gentle request: "(please) call me". Familiar: আমাকে ফোন কোরো (phon koro).',
    }),
    help: ph("বাঁচাও!", "baanchaao!", {
      notes:
        'Literally "save (me)!" — the cry for help. Also কেউ আছেন? (keu aachhen?, "is anyone there?").',
    }),
    itsOkay: ph("কিছু হয়নি", "kichhu hoyni", {
      notes:
        'Literally "nothing happened" — said when someone apologises. Also ঠিক আছে (thik aachhe) or কোনো ব্যাপার না.',
    }),
  },

  extras: [
    // Greetings
    xp(
      "assalamu-alaikum",
      "greetings",
      "Greetings",
      "আসসালামু আলাইকুম",
      "aassaalaamu aalaaikum",
      "Peace be upon you (greeting)",
      "The greeting used by Muslims and very widely in Bangladesh. The reply is ওয়ালাইকুম আসসালাম (oyaalaaikum aassaalaam).",
    ),
    xp(
      "shubho-noboborsho",
      "greetings",
      "Greetings",
      "শুভ নববর্ষ",
      "shubho noboborsho",
      "Happy (Bengali) New Year",
      "Said on পয়লা বৈশাখ (Poylaa Boishaakh), the Bengali New Year in mid-April.",
    ),
    xp(
      "shubho-bijoya",
      "greetings",
      "Greetings",
      "শুভ বিজয়া",
      "shubho bijoyaa",
      "Happy Bijoya (greeting after Durga Puja)",
      "After Durga Puja people greet each other, touch elders' feet, hug friends and share sweets.",
    ),
    xp(
      "aabaar-aashben",
      "greetings",
      "Greetings",
      "আবার আসবেন",
      "aabaar aashben",
      "Please come again",
      "What a host says to a departing guest. Familiar: আবার এসো (aabaar esho).",
    ),
    // Polite words / particles
    xw(
      "aachchhaa",
      "polite-words",
      "Polite words",
      "আচ্ছা",
      "aachchhaa",
      "Okay / I see / well…",
      "Very common: agreeing (আচ্ছা, ঠিক আছে), showing you follow, or starting a question (আচ্ছা, এটা কী?).",
    ),
    xp(
      "maaph-korben",
      "polite-words",
      "Polite words",
      "মাফ করবেন",
      "maaph korben",
      "Please forgive me / pardon me",
      'A humble apology or "excuse me". Familiar: মাফ করো (maaph koro).',
    ),
    // Things / actions
    xw(
      "chhaataa",
      "things",
      "Everyday things",
      "ছাতা",
      "chhaataa",
      "Umbrella",
      "Essential in Kolkata, for both the monsoon rain and the summer sun.",
    ),
    xw(
      "jaanaa",
      "actions",
      "Actions",
      "জানা",
      "jaanaa",
      "To know",
      "আমি জানি (aami jaani) = I know; আমি জানি না = I don't know.",
    ),
    xw(
      "bojhaa",
      "actions",
      "Actions",
      "বোঝা",
      "bojhaa",
      "To understand",
      "Usually used as বুঝতে পারা (bujhte paaraa, to be able to understand): বুঝতে পারছি.",
    ),
    // This & that
    xp(
      "ki-holo",
      "this-and-that",
      "Questions",
      "কী হল?",
      "ki holo?",
      "What happened?",
      "Also কী হয়েছে? (ki hoyechhe?). Very common when someone looks upset or something goes wrong.",
    ),
    // Introductions
    xp(
      "aami-baangaali",
      "where-from",
      "Introductions",
      "আমি বাঙালি",
      "aami baangaali",
      "I am Bengali",
      "বাঙালি (baangaali) = a Bengali person; বাংলা (baanglaa) = the language and the land.",
    ),
    xp(
      "aapnaar-baari-kothaay",
      "where-from",
      "Introductions",
      "আপনার বাড়ি কোথায়?",
      "aapnaar baari kothaay?",
      "Where is your home (town)?",
      "Asks where your family is from, not your current address. Answer: আমার বাড়ি দুর্গাপুরে (my home is in Durgapur).",
    ),
    // Understanding
    xp(
      "aami-bujhechhi",
      "understanding",
      "Understanding",
      "আমি বুঝেছি",
      "aami bujhechhi",
      "I've understood / Got it",
      'Short: বুঝেছি! The tag বুঝলেন? (bujhlen?) asks "understood?".',
    ),
    xp(
      "baanglaay-bolun",
      "understanding",
      "Understanding",
      "বাংলায় বলুন",
      "baanglaay bolun",
      "Please say it in Bengali",
      "Useful when people switch to English or Hindi with you.",
    ),
    // Family
    xw(
      "kaakaa",
      "grandparents",
      "Family",
      "কাকা",
      "kaakaa",
      "Uncle (father's younger brother)",
      "His wife is কাকিমা (kaakimaa). Also কাকু (kaaku), used for any older man in the neighbourhood.",
    ),
    xw(
      "jethu",
      "grandparents",
      "Family",
      "জেঠু",
      "jethu",
      "Uncle (father's elder brother)",
      "Also জ্যাঠা (jyaathaa) / জেঠামশাই. His wife is জেঠিমা (jethimaa).",
    ),
    xw(
      "maashi",
      "grandparents",
      "Family",
      "মাসি",
      "maashi",
      "Aunt (mother's sister)",
      'Also মাসিমা (maashimaa), the polite way to address any older woman, like "aunty".',
    ),
    xw(
      "boudi",
      "siblings",
      "Family",
      "বৌদি",
      "boudi",
      "Elder brother's wife",
      "Also used to address a friend's or neighbour's wife politely.",
    ),
    xw("jaamaaibaabu", "siblings", "Family", "জামাইবাবু", "jaamaaibaabu", "Elder sister's husband"),
    xw(
      "kaaku",
      "people",
      "People",
      "কাকু",
      "kaaku",
      "Uncle (polite address for an older man)",
      "Children and young people call older men কাকু, and older women মাসিমা / কাকিমা.",
    ),
    xw(
      "paaraa",
      "people",
      "People",
      "পাড়া",
      "paaraa",
      "Neighbourhood (locality)",
      "Kolkata life revolves around the পাড়া — its tea stalls, clubs and Durga Puja.",
    ),
    // Food
    xp(
      "maachher-jhol",
      "food-staples",
      "Food",
      "মাছের ঝোল",
      "maachher jhol",
      "Fish curry (light Bengali fish stew)",
      "The everyday Bengali meal: ভাত আর মাছের ঝোল (rice and fish curry).",
    ),
    xw(
      "luchi",
      "food-staples",
      "Food",
      "লুচি",
      "luchi",
      "Luchi (deep-fried puffed bread)",
      "Classic Sunday breakfast with আলুর দম (aalur dom, spiced potatoes).",
    ),
    xw(
      "muri",
      "food-staples",
      "Food",
      "মুড়ি",
      "muri",
      "Puffed rice",
      "ঝালমুড়ি (jhaalmuri) is the spicy puffed-rice street snack.",
    ),
    xw(
      "posto",
      "food-staples",
      "Food",
      "পোস্ত",
      "posto",
      "Poppy seed (paste)",
      "আলু পোস্ত (aalu posto), potatoes in poppy-seed paste, is a much-loved dish.",
    ),
    xw(
      "roshogollaa",
      "hungry-thirsty",
      "Food",
      "রসগোল্লা",
      "roshogollaa",
      "Rasgulla (syrupy cheese ball sweet)",
      "Bengal's most famous sweet. Also সন্দেশ (shondesh).",
    ),
    xw(
      "mishti-doi",
      "hungry-thirsty",
      "Food",
      "মিষ্টি দই",
      "mishti doi",
      "Sweet curd",
      "Caramelised sweetened yogurt set in a clay pot — the classic end of a meal.",
    ),
    xw(
      "phuchkaa",
      "hungry-thirsty",
      "Food",
      "ফুচকা",
      "phuchkaa",
      "Phuchka (pani puri)",
      "Kolkata's name for the famous street snack, with tamarind water and spiced potato.",
    ),
    xw(
      "ilish",
      "fruits-vegetables",
      "Food",
      "ইলিশ",
      "ilish",
      "Hilsa fish",
      "The king of Bengali fish, especially in the monsoon: সর্ষে ইলিশ (hilsa in mustard).",
    ),
    xw(
      "chingri",
      "fruits-vegetables",
      "Food",
      "চিংড়ি",
      "chingri",
      "Prawn",
      "চিংড়ি মালাইকারি (chingri maalaaikaari) is a famous prawn curry in coconut milk.",
    ),
    xw(
      "begun",
      "fruits-vegetables",
      "Fruits & vegetables",
      "বেগুন",
      "begun",
      "Aubergine (brinjal)",
      "বেগুনভাজা (begunbhaajaa), fried aubergine slices, is eaten with rice.",
    ),
    xw(
      "kaanchaa-lonkaa",
      "fruits-vegetables",
      "Fruits & vegetables",
      "কাঁচা লঙ্কা",
      "kaanchaa lonkaa",
      "Green chilli",
      "লঙ্কা (lonkaa) = chilli; শুকনো লঙ্কা (shukno lonkaa) = dried red chilli.",
    ),
    xw(
      "bhaanrer-chaa",
      "drinks",
      "Drinks",
      "ভাঁড়ের চা",
      "bhaanrer chaa",
      "Tea in a clay cup",
      "Kolkata street tea is served in a small disposable clay cup, the ভাঁড় (bhaanr).",
    ),
    xw(
      "lebu-chaa",
      "drinks",
      "Drinks",
      "লেবু চা",
      "lebu chaa",
      "Lemon tea",
      "Black tea with lemon and a pinch of salt/spice, popular at Kolkata tea stalls.",
    ),
    xw(
      "shorbot",
      "drinks",
      "Drinks",
      "শরবত",
      "shorbot",
      "Sherbet (cool sweet drink)",
      "For example লেবুর শরবত (lebur shorbot, lemonade).",
    ),
    xp(
      "beshi-jhaal-deben-naa",
      "ordering-food",
      "Restaurant",
      "বেশি ঝাল দেবেন না",
      "beshi jhaal deben naa",
      "Please don't make it too spicy",
    ),
    // Numbers & time
    xw(
      "der",
      "big-numbers",
      "Numbers",
      "দেড়",
      "der",
      "One and a half",
      "দেড়শো (dersho) = 150; দেড়টা (dertaa) = half past one.",
    ),
    xw(
      "aaraai",
      "big-numbers",
      "Numbers",
      "আড়াই",
      "aaraai",
      "Two and a half",
      "আড়াইশো (aaraaisho) = 250; আড়াইটে (aaraaite) = half past two.",
    ),
    xw(
      "laakh",
      "big-numbers",
      "Numbers",
      "লাখ",
      "laakh",
      "Lakh (100,000)",
      "Bengali counts large sums in লাখ and কোটি (koti, ten million).",
    ),
    xw(
      "shaare",
      "time",
      "Time",
      "সাড়ে",
      "shaare",
      "Half past (plus a half)",
      "সাড়ে চারটে (shaare chaarte) = half past four. Note: half past one and two use দেড়টা and আড়াইটে.",
    ),
    xw(
      "poune",
      "time",
      "Time",
      "পৌনে",
      "poune",
      "Quarter to",
      "পৌনে ছটা (poune chhotaa) = quarter to six. Quarter past is সোয়া (shoyaa): সোয়া ছটা.",
    ),
    xw(
      "porshu",
      "time",
      "Time",
      "পরশু",
      "porshu",
      "Day after tomorrow / day before yesterday",
      "Like কাল, the verb tense tells you which.",
    ),
    xw(
      "boishaakh",
      "days",
      "Days",
      "বৈশাখ",
      "boishaakh",
      "Boishakh (first month of the Bengali year)",
      "The Bengali calendar starts in mid-April. The monsoon months are আষাঢ় (aashaar) and শ্রাবণ (shraabon).",
    ),
    // Daily life
    xp(
      "ghum-paachchhe",
      "routine-verbs",
      "Daily routine",
      "ঘুম পাচ্ছে",
      "ghum paachchhe",
      "I'm sleepy",
      'Literally "sleep is coming". Also আমার ঘুম পাচ্ছে.',
    ),
    xp(
      "daant-maajaa",
      "routine-verbs",
      "Daily routine",
      "দাঁত মাজা",
      "daant maajaa",
      "To brush one's teeth",
    ),
    xw(
      "pheraa",
      "my-day",
      "Daily routine",
      "ফেরা",
      "pheraa",
      "To return (come back home)",
      "বাড়ি ফেরা (baari pheraa) = to come home: কখন ফিরবে? (when will you be back?).",
    ),
    xw(
      "aaddaa",
      "hobbies",
      "Hobbies",
      "আড্ডা",
      "aaddaa",
      "Adda (long relaxed chat with friends)",
      "A Bengali institution: chatting for hours over tea about everything. আড্ডা দেওয়া = to hang out and chat.",
    ),
    // Places & travel
    xw(
      "metro",
      "vehicles",
      "Transport",
      "মেট্রো",
      "metro",
      "Metro (underground railway)",
      "Kolkata had India's first metro (1984).",
    ),
    xw(
      "traam",
      "vehicles",
      "Transport",
      "ট্রাম",
      "traam",
      "Tram",
      "Kolkata is the only Indian city that still runs trams.",
    ),
    xw(
      "bhaaraa",
      "travel-words",
      "Travel",
      "ভাড়া",
      "bhaaraa",
      "Fare; rent",
      "ভাড়া কত? (bhaaraa koto?) = how much is the fare?",
    ),
    xp(
      "aami-ekhaane-naamobo",
      "travel-phrases",
      "Travel",
      "আমি এখানে নামব",
      "aami ekhaane naambo",
      "I'll get off here",
      "Said to a bus conductor or driver. নামা (naamaa) = to get down / get off.",
    ),
    xw(
      "howrah-bridge",
      "places-2",
      "Places",
      "হাওড়া ব্রিজ",
      "Haaoraa brij",
      "Howrah Bridge",
      "Kolkata's landmark bridge over the Hooghly (গঙ্গা, Gongaa) river; officially রবীন্দ্র সেতু (Robindro Shetu).",
    ),
    xw(
      "daarjiling",
      "travel-words",
      "Travel",
      "দার্জিলিং",
      "Daarjiling",
      "Darjeeling",
      "Hill town in north Bengal, reached via Siliguri; famous for tea and the toy train.",
    ),
    // Shopping
    xw("golaapi", "colours", "Colours", "গোলাপি", "golaapi", "Pink", "From গোলাপ (golaap, rose)."),
    xw(
      "paanjaabi",
      "clothes",
      "Clothes",
      "পাঞ্জাবি",
      "paanjaabi",
      "Kurta (men's long shirt)",
      "In Bengal the kurta is called পাঞ্জাবি, worn with ধুতি (dhuti) or pyjamas at festivals.",
    ),
    xw(
      "gaamchhaa",
      "clothes",
      "Clothes",
      "গামছা",
      "gaamchhaa",
      "Gamchha (thin cotton towel)",
      "The checked cotton towel used in every Bengali home.",
    ),
    xw(
      "khuchro",
      "money-words",
      "Shopping",
      "খুচরো",
      "khuchro",
      "Change (small money)",
      "খুচরো আছে? (khuchro aachhe?) = do you have change?",
    ),
    xw(
      "dordaam",
      "at-the-shop",
      "Shopping",
      "দরদাম",
      "dordaam",
      "Bargaining",
      "দরদাম করা (dordaam koraa) = to bargain, normal at markets like New Market and Gariahat.",
    ),
    // Conversation particles
    xp(
      "taai-naa",
      "conv-friend",
      "Conversation",
      "তাই না?",
      "taai naa?",
      "Isn't it? / Right?",
      "Tag question: আজ খুব গরম, তাই না? (very hot today, isn't it?).",
    ),
    xw(
      "are",
      "conv-friend",
      "Conversation",
      "আরে",
      "are",
      "Hey! / Oh!",
      "Surprise or friendly greeting: আরে, তুমি এখানে! (hey, you're here!).",
    ),
    xw(
      "daarun",
      "conv-friend",
      "Conversation",
      "দারুণ",
      "daarun",
      "Great! / Awesome!",
      "Very common praise for food, films, people: দারুণ হয়েছে!",
    ),
    xp(
      "ei-to",
      "conv-meeting",
      "Conversation",
      "এই তো",
      "ei to",
      "Here I am / Just so (filler)",
      'Reply to কী খবর?: এই তো, চলছে (ei to, cholchhe, "oh, getting along").',
    ),
    xp(
      "line-kete-gelo",
      "conv-phone",
      "Conversation",
      "লাইনটা কেটে গেল",
      "laaintaa kete gelo",
      "The call got cut",
      'Also নেটওয়ার্ক নেই (netoyaark nei, "there\'s no network").',
    ),
    // Feelings, health
    xw(
      "koshto",
      "feelings",
      "Feelings",
      "কষ্ট",
      "koshto",
      "Pain, hardship, distress",
      "খুব কষ্ট হচ্ছে = it's very hard / it hurts a lot (also emotionally).",
    ),
    xw(
      "lojjaa",
      "feelings-2",
      "Feelings",
      "লজ্জা",
      "lojjaa",
      "Shyness, embarrassment",
      "লজ্জা পাওয়া = to feel shy; লজ্জা করছে = I feel shy.",
    ),
    xw(
      "shordi",
      "health",
      "Health",
      "সর্দি",
      "shordi",
      "Cold (runny nose)",
      "আমার সর্দি হয়েছে = I have a cold. Cough is কাশি (kaashi).",
    ),
    xw(
      "golaa",
      "body",
      "Body",
      "গলা",
      "golaa",
      "Throat; neck; voice",
      "গলা ব্যথা (golaa byathaa) = sore throat.",
    ),
    xw(
      "shonaa",
      "love-friendship",
      "Relationships",
      "সোনা",
      "shonaa",
      'Darling (literally "gold")',
      "Affectionate address for children and loved ones: কী হয়েছে সোনা? (what happened, dear?).",
    ),
    xw(
      "bhaalobaashaa",
      "love-friendship",
      "Relationships",
      "ভালোবাসা",
      "bhaalobaashaa",
      "Love (noun)",
      'Also the end of a letter or message: ভালোবাসা নিও (bhaalobaashaa nio, "with love").',
    ),
    // Weather
    xw(
      "borshaa",
      "weather",
      "Weather",
      "বর্ষা",
      "borshaa",
      "Monsoon (rainy season)",
      "June–September in Bengal; the season of rain, hilsa and Tagore's songs.",
    ),
    xw(
      "shit",
      "weather",
      "Weather",
      "শীত",
      "shit",
      "Winter; cold (feeling)",
      "আমার শীত করছে = I feel cold. Kolkata winter (Dec–Jan) is mild and much loved.",
    ),
    xw(
      "gumot",
      "weather",
      "Weather",
      "গুমোট",
      "gumot",
      "Muggy, stuffy (humid heat)",
      "Typical Kolkata summer weather before rain: আজ খুব গুমোট.",
    ),
    // College & hobbies
    xw("khaataa", "college-work", "College & work", "খাতা", "khaataa", "Notebook (exercise book)"),
    xw(
      "robindroshonggit",
      "hobbies",
      "Hobbies",
      "রবীন্দ্রসংগীত",
      "robindroshonggit",
      "Rabindrasangeet (Tagore's songs)",
      "Songs written by Rabindranath Tagore, sung across Bengal at every occasion.",
    ),
    xw(
      "phutbol",
      "hobbies",
      "Hobbies",
      "ফুটবল",
      "phutbol",
      "Football",
      "Kolkata's great passion; the Mohun Bagan vs East Bengal derby fills stadiums.",
    ),
    // Plans / festivals
    xw(
      "durgaapujo",
      "plans",
      "Plans & invitations",
      "দুর্গাপুজো",
      "durgaapujo",
      "Durga Puja",
      "Bengal's biggest festival (Sept/Oct). People go পাণ্ডেল-হপিং (pandal hopping) in new clothes. Often just পুজো (pujo).",
    ),
    xw(
      "bhaaiphontaa",
      "plans",
      "Plans & invitations",
      "ভাইফোঁটা",
      "bhaaiphontaa",
      "Bhai Phonta (sisters bless brothers)",
      "Bengali festival after Kali Puja where sisters put a sandalwood mark (ফোঁটা) on their brothers' foreheads.",
    ),
    xw(
      "poylaa-boishaakh",
      "plans",
      "Plans & invitations",
      "পয়লা বৈশাখ",
      "Poylaa Boishaakh",
      "Bengali New Year's Day",
      "Mid-April; shops open new account books (হালখাতা, haalkhaataa) and families wear new clothes.",
    ),
    xp(
      "nemontonno",
      "plans",
      "Plans & invitations",
      "নেমন্তন্ন রইল",
      "nemontonno roilo",
      "You're invited",
      'Literally "the invitation remains (for you)" — a warm way to invite someone to an event.',
    ),
  ],

  dialogues: {
    meetingSomeone: {
      context: "Ravi (A) meets Asha (B) at a friend's get-together in Kolkata.",
      lines: [
        A("নমস্কার।", "nomoshkaar.", "Hello."),
        B("নমস্কার।", "nomoshkaar.", "Hello."),
        A("আপনার নাম কী?", "aapnaar naam ki?", "What is your name?"),
        B(
          "আমার নাম আশা। আপনার নাম কী?",
          "aamaar naam Asha. aapnaar naam ki?",
          "My name is Asha. What is your name?",
        ),
        A(
          "আমার নাম রবি। আপনি কোথা থেকে এসেছেন?",
          "aamaar naam Robi. aapni kothaa theke eshechhen?",
          "My name is Ravi. Where are you from?",
        ),
        B(
          "আমি দুর্গাপুর থেকে এসেছি। আপনার সঙ্গে আলাপ করে ভালো লাগল।",
          "aami Durgapur theke eshechhi. aapnaar shonge aalaap kore bhaalo laaglo.",
          "I am from Durgapur. Nice to meet you.",
        ),
        A(
          "আমারও আপনার সঙ্গে আলাপ করে ভালো লাগল।",
          "aamaaro aapnaar shonge aalaap kore bhaalo laaglo.",
          "Nice to meet you too.",
        ),
      ],
    },
    meetingFriend: {
      context:
        "Two college friends run into each other on a street in Kolkata. They use the familiar তুমি.",
      lines: [
        A("আরে! কেমন আছো?", "are! kemon aachho?", "Hey! How are you?"),
        B("ভালো আছি। তুমি?", "bhaalo aachhi. tumi?", "I'm fine. And you?"),
        A(
          "আমিও ভালো আছি। অনেকদিন পর দেখা হল!",
          "aamio bhaalo aachhi. onekdin por dekhaa holo!",
          "I'm fine too. Long time no see!",
        ),
        B(
          "হ্যাঁ। আজকাল কী করছ?",
          "hyaan. aajkaal ki korchho?",
          "Yes. What are you doing these days?",
        ),
        A(
          "পড়াশোনা করছি। খাওয়া হয়েছে?",
          "poraashonaa korchhi. khaaoyaa hoyechhe?",
          "I'm studying. Have you eaten?",
        ),
        B(
          "হ্যাঁ, খেয়েছি। চলো, চা খাই।",
          "hyaan, kheyechhi. cholo, chaa khaai.",
          "Yes, I have eaten. Let's have tea.",
        ),
        A("ঠিক আছে, চলো যাই।", "thik aachhe, cholo jaai.", "Okay, let's go."),
      ],
    },
    restaurant: {
      context: "Asha (B) orders lunch at a small restaurant in Kolkata. A is the waiter.",
      lines: [
        A("কী নেবেন?", "ki neben?", "What would you like?"),
        B(
          "এক প্লেট ভাত আর ডাল দিন।",
          "ek plet bhaat aar daal din.",
          "Please give me one plate of rice and dal.",
        ),
        A("চা-কফি কিছু নেবেন?", "chaa-kophi kichhu neben?", "Anything to drink — tea, coffee?"),
        B(
          "একটা চা দিন, চিনি ছাড়া।",
          "ektaa chaa din, chini chhaaraa.",
          "One tea, without sugar, please.",
        ),
        A("ঠিক আছে। আর কিছু?", "thik aachhe. aar kichhu?", "Okay. Anything else?"),
        B(
          "একটু জল দিন। এটা কি ঝাল?",
          "ektu jol din. etaa ki jhaal?",
          "Some water, please. Is it spicy?",
        ),
        A("একটু ঝাল আছে।", "ektu jhaal aachhe.", "It's a little spicy."),
        B(
          "ঠিক আছে। খাওয়ার পরে বিলটা দেবেন।",
          "thik aachhe. khaaoyaar pore biltaa deben.",
          "That's fine. Please bring the bill after the meal.",
        ),
      ],
    },
    shopping: {
      context: "Ravi (A) buys mangoes from a fruit seller (B) at a Kolkata market.",
      lines: [
        A("দাদা, আম আছে?", "daadaa, aam aachhe?", "Do you have mangoes?"),
        B("হ্যাঁ, আছে।", "hyaan, aachhe.", "Yes, we have."),
        A("এক কিলো কত?", "ek kilo koto?", "How much does one kilo cost?"),
        B("একশো টাকা।", "eksho taakaa.", "One hundred rupees."),
        A(
          "দামটা খুব বেশি। একটু কম করুন।",
          "daamtaa khub beshi. ektu kom korun.",
          "That is too expensive. Please reduce the price a little.",
        ),
        B(
          "ঠিক আছে, নব্বই টাকা দিন।",
          "thik aachhe, nobboi taakaa din.",
          "Okay, give me ninety rupees.",
        ),
        A("আচ্ছা, এক কিলো নেব।", "aachchhaa, ek kilo nebo.", "Fine, I will take one kilo."),
      ],
    },
    directions: {
      context: "Asha (A) asks a passer-by (B) the way to the railway station in Durgapur.",
      lines: [
        A(
          "একটু শুনবেন, স্টেশনটা কোথায়?",
          "ektu shunben, steshontaa kothaay?",
          "Excuse me, where is the railway station?",
        ),
        B(
          "সোজা যান, তারপর বাঁদিকে ঘুরবেন।",
          "shojaa jaan, taarpor baandike ghurben.",
          "Go straight, then turn left.",
        ),
        A("অনেক দূর?", "onek dur?", "Is it far?"),
        B(
          "না, কাছেই। হেঁটে পাঁচ মিনিট মতো।",
          "naa, kaachhei. hente paanch minit moto.",
          "No, it is near. About five minutes on foot.",
        ),
        A("অনেক ধন্যবাদ।", "onek dhonnobaad.", "Thank you very much."),
        B("কোনো ব্যাপার না।", "kono byaapaar naa.", "You're welcome."),
      ],
    },
    college: {
      context:
        "On the first day of college in Kolkata, a student (A) talks to a newcomer (B). Students use তুমি with each other.",
      lines: [
        A("হাই, তুমি কি এখানে নতুন?", "haai, tumi ki ekhaane notun?", "Hi, are you new here?"),
        B(
          "হ্যাঁ, আজ আমার প্রথম দিন।",
          "hyaan, aaj aamaar prothom din.",
          "Yes, today is my first day.",
        ),
        A("তুমি কোন ইয়ারে পড়ো?", "tumi kon iyaare poro?", "Which year are you in?"),
        B(
          "আমি ফার্স্ট ইয়ারে। লাইব্রেরিটা কোথায়?",
          "aami phaarst iyaare. laaibreritaa kothaay?",
          "I am in first year. Where is the library?",
        ),
        A(
          "অফিসের পিছনে। এসো, আমি দেখিয়ে দিচ্ছি।",
          "ophiser pichhone. esho, aami dekhiye dichchhi.",
          "It is behind the office. Come, I will show you.",
        ),
        B("ধন্যবাদ! পরীক্ষা কবে?", "dhonnobaad! porikkhaa kobe?", "Thank you! When is the exam?"),
        A("পরের মাসে।", "porer maashe.", "Next month."),
      ],
    },
    phoneCall: {
      context: "Ravi (A) calls his friend Asha (B) from a new number.",
      lines: [
        A("হ্যালো?", "hyaalo?", "Hello?"),
        B("হ্যালো, কে বলছেন?", "hyaalo, ke bolchhen?", "Hello, who is speaking?"),
        A(
          "আমি রবি বলছি। তুমি কোথায়?",
          "aami Robi bolchhi. tumi kothaay?",
          "It's me, Ravi. Where are you?",
        ),
        B(
          "আমি বাড়িতে আছি। কী হয়েছে?",
          "aami baarite aachhi. ki hoyechhe?",
          "I am at home. What happened?",
        ),
        A("কাল তুমি ফাঁকা আছো?", "kaal tumi phaankaa aachho?", "Are you free tomorrow?"),
        B("হ্যাঁ, ফাঁকা আছি।", "hyaan, phaankaa aachhi.", "Yes, I am free."),
        A(
          "তাহলে সন্ধেবেলা আমাদের বাড়ি এসো।",
          "taahole shondhebelaa aamaader baari esho.",
          "Then come to my house in the evening.",
        ),
        B(
          "ঠিক আছে, আসব। পরে তোমাকে ফোন করব।",
          "thik aachhe, aashbo. pore tomaake phon korbo.",
          "Okay, I will come. I will call you later.",
        ),
      ],
    },
    askingForHelp: {
      context:
        "A visitor (A) who is lost in Siliguri asks a shopkeeper (B) for help with an address.",
      lines: [
        A(
          "একটু শুনবেন, আমাকে একটু সাহায্য করতে পারবেন?",
          "ektu shunben, aamaake ektu shaahaajjo korte paarben?",
          "Excuse me, can you help me?",
        ),
        B("হ্যাঁ, বলুন।", "hyaan, bolun.", "Yes, tell me."),
        A(
          "আমি রাস্তা হারিয়ে ফেলেছি। এই ঠিকানাটা বুঝতে পারছি না।",
          "aami raastaa haariye phelechhi. ei thikaanaataa bujhte paarchhi naa.",
          "I am lost. I don't understand this address.",
        ),
        B(
          "দেখি। এটা বাজারের কাছে।",
          "dekhi. etaa baajaarer kaachhe.",
          "Let me see. This is near the market.",
        ),
        A("একটু আস্তে বলুন।", "ektu aaste bolun.", "Please speak slowly."),
        B(
          "বাজারে গিয়ে ওখানে জিজ্ঞেস করবেন। কাছেই।",
          "baajaare giye okhaane jiggesh korben. kaachhei.",
          "Go to the market and ask there. It is close.",
        ),
        A("অনেক ধন্যবাদ।", "onek dhonnobaad.", "Thank you so much."),
      ],
    },
    travel: {
      context: "Asha (A) gets on a bus in Asansol and talks to the conductor (B).",
      lines: [
        A(
          "এই বাসটা কি স্টেশন যাবে?",
          "ei baastaa ki steshon jaabe?",
          "Does this bus go to the railway station?",
        ),
        B("হ্যাঁ। কোথায় নামবেন?", "hyaan. kothaay naamben?", "Yes. Where do you want to get off?"),
        A(
          "স্টেশনে। টিকিট কত?",
          "steshone. tikit koto?",
          "At the railway station. How much is the ticket?",
        ),
        B("কুড়ি টাকা।", "kuri taakaa.", "Twenty rupees."),
        A("কতক্ষণ লাগবে?", "kotokkhon laagbe?", "How long will it take?"),
        B("আধ ঘণ্টা মতো।", "aadh ghontaa moto.", "About half an hour."),
        A(
          "স্টেশন এলে আমাকে একটু বলবেন।",
          "steshon ele aamaake ektu bolben.",
          "Please tell me when we reach the station.",
        ),
        B("ঠিক আছে, বলে দেব।", "thik aachhe, bole debo.", "Okay, I will tell you."),
      ],
    },
    dailyRoutine: {
      context: "Two friends (A and B) talk about their daily routine. They use তুমি.",
      lines: [
        A("তুমি কটায় ঘুম থেকে ওঠো?", "tumi kotaay ghum theke otho?", "What time do you wake up?"),
        B("আমি ছটায় ঘুম থেকে উঠি।", "aami chhotaay ghum theke uthi.", "I wake up at six o'clock."),
        A("তারপর কী করো?", "taarpor ki koro?", "What do you do after that?"),
        B(
          "স্নান করি, জলখাবার খাই, তারপর কলেজে যাই।",
          "snaan kori, jolkhaabaar khaai, taarpor koleje jaai.",
          "I bathe, eat breakfast and go to college.",
        ),
        A("বাড়ি কখন ফেরো?", "baari kokhon phero?", "When do you come home?"),
        B(
          "সন্ধেবেলা বাড়ি ফিরে পড়তে বসি।",
          "shondhebelaa baari phire porte boshi.",
          "I come home in the evening and sit down to study.",
        ),
        A("কখন ঘুমোও?", "kokhon ghumoo?", "When do you sleep?"),
        B("রাত দশটায় ঘুমোই।", "raat doshtaay ghumoi.", "I sleep at ten o'clock at night."),
      ],
    },
  },

  lessonNotes: {
    greetings:
      'Bengalis rarely say a direct goodbye: when leaving they say আসি (aashi, "I come"), promising to return. Hindus greet with নমস্কার (nomoshkaar), Muslims with আসসালামু আলাইকুম (aassaalaamu aalaaikum).',
    actions:
      "Bengali verbs are shown as verbal nouns: আসা (aashaa, coming / to come), খাওয়া (khaaoyaa, eating / to eat). Bengali also uses খাওয়া for drinks: জল খাওয়া, চা খাওয়া.",
    "my-name":
      'Bengali drops "is" in present-tense "X is Y" sentences: আমার নাম আশা (aamaar naam Asha) is literally "my name Asha".',
    "how-are-you":
      'The verb ending changes with the "you": আপনি কেমন আছেন? (polite), তুমি কেমন আছো? (familiar), তুই কেমন আছিস? (intimate). The answer always uses আছি: আমি ভালো আছি.',
    siblings:
      "Bengali separates older and younger siblings: দাদা (daadaa) and দিদি (didi) are older, ভাই (bhaai) and বোন (bon) younger. দাদা / দিদি are also the polite way to address any slightly older stranger, and -দা / -দি after a name: রবিদা, আশাদি.",
    grandparents:
      "The father's side and mother's side have different words: ঠাকুরদা / ঠাকুমা (father's parents) and দাদু / দিদিমা (mother's parents), though children often call both grandfathers দাদু. Uncles: মামা (mother's brother), কাকা (father's younger brother), জেঠু (father's elder brother). Muslim families use দাদা/দাদি and নানা/নানি.",
    people:
      "Bengalis use family words for strangers: দাদা / দিদি for slightly older people, কাকু (kaaku) / মাসিমা (maashimaa) for people of your parents' age.",
    "hungry-thirsty":
      'Feelings and needs use "to me" (আমার) instead of "I": আমার খিদে পেয়েছে ("to me hunger has come" = I\'m hungry), আমার জল চাই ("to me water is wanted").',
    drinks:
      'Bengalis "eat" their drinks: চা খাব? (shall we have tea?), জল খাও (drink water). পান করা (to drink) is only used in formal writing.',
    "numbers-1-10":
      "With a noun, Bengali numbers take a classifier: -টা / -টি for things (একটা বই, one book; দুটো কলম, two pens) and -জন for people (একজন লোক, one person; দুজন বন্ধু, two friends). For prices, phone numbers and times people often use English numbers.",
    "numbers-11-20":
      "Bengali numbers from 11 up are irregular and must be learned one by one. In West Bengal twenty is usually কুড়ি (kuri); বিশ (bish) is also correct.",
    time: 'কাল (kaal) means both "yesterday" and "tomorrow": the verb tense tells you which. Clock times add -টা: পাঁচটা বাজে (it\'s five o\'clock), and at a time -টায়: ছটায় (at six).',
    "at-the-shop":
      '-টা / -টি after a noun means "the": বইটা (the book), দামটা (the price). Bargaining is normal in markets — do it with a smile and দাদা: দাদা, একটু কম করুন না.',
    pronouns:
      'Bengali has three levels of "you": আপনি (aapni, polite — elders, strangers, teachers), তুমি (tumi, familiar — friends, family, people your age) and তুই (tui, intimate — very close friends, younger siblings, small children). Third person has no gender: সে / ও mean he OR she, and তিনি / উনি are their respectful forms.',
    "word-order":
      'Bengali puts the verb last (subject – object – verb): আমি ভাত খাই = "I rice eat". The verb ending shows the person and politeness, never gender: আমি খাই, তুমি খাও, আপনি খান, সে খায়, তিনি খান.',
    "past-future":
      "Past: আমি খেলাম (I ate), আমি খেয়েছি (I have eaten). Future: আমি খাব (I will eat), আপনি খাবেন, তুমি খাবে. The same কাল means yesterday with a past verb and tomorrow with a future verb.",
    "questions-negatives":
      'Yes/no questions add কি (ki) after the subject: আপনি কি মাংস খান? Negatives put না (naa) after the verb: আমি জানি না. "Is not" is নয় (noy): এটা আমার বই নয়; the past negative adds -নি: আমি যাইনি (I didn\'t go).',
    possession:
      "Bengali uses endings, not prepositions: -র / -এর (of): আমার, রবির (Ravi's); -এ / -তে (in, at): বাড়িতে (at home); and words after the -র form: টেবিলের ওপর (on the table), বন্ধুর সঙ্গে (with a friend). থেকে (from) follows the noun directly: বাড়ি থেকে.",
    "polite-casual":
      "Every request has three forms: আপনি — আসুন, বসুন, খান (polite); তুমি — এসো, বসো, খাও (familiar); তুই — আয়, বস, খা (intimate). Use আপনি with anyone older or unfamiliar until they invite you to switch.",
    "love-friendship":
      '"I love you" (আমি তোমাকে ভালোবাসি) is romantic and always uses তুমি. Liking uses "to me … feels good": আমার এটা ভালো লাগে (I like this). For missing someone Bengalis say তোমার কথা মনে পড়ছে ("I keep thinking of you").',
    "conv-friend":
      "A caring Bengali question is খাওয়া হয়েছে? (have you eaten?). Friends greet with কী খবর? (what's new?) and often use তুমি or the intimate তুই.",
  },
};
