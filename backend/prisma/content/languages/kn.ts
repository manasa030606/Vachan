import type { LanguageContent } from "../types.ts";

// Kannada (ಕನ್ನಡ) course content.
// Romanization: long vowels doubled (aa, ee, oo); both ಎ/ಏ are written "e" and both ಒ/ಓ "o"
// (check the Kannada letter for length); retroflex ಟ ಡ ಣ ಳ are written t d n l; ಶ/ಷ = sh.
// Standard (written) verb forms are taught; the everyday spoken forms are given in notes.

export const content: LanguageContent = {
  code: "kn",
  entries: {
    // First words › Greetings (lesson "greetings")
    hello: {
      script: "ನಮಸ್ಕಾರ",
      roman: "namaskaara",
      notes:
        'The all-purpose respectful greeting, for any time of day, usually with palms pressed together. ನಮಸ್ತೆ (namaste) is also understood; friends often just say "hi" or ಏನು ಸಮಾಚಾರ? (enu samaachaara?, what\'s new?).',
    },
    goodbye: {
      script: "ಹೋಗಿ ಬರುತ್ತೇನೆ",
      roman: "hogi baruttene",
      accept: ["bye", "I will go and come back", "see you"],
      notes:
        'Literally "I will go and come (back)": Kannada speakers avoid a final-sounding goodbye. Spoken form: ಹೋಗಿ ಬರ್ತೀನಿ (hogi barteeni). The host replies ಹೋಗಿ ಬನ್ನಿ (hogi banni, go and come back). With friends, "bye" is common.',
    },
    seeYouLater: {
      words: [
        ["ಆಮೇಲೆ", "aamele"],
        ["ಸಿಗೋಣ", "sigona"],
      ],
      notes:
        'Literally "let\'s meet later" — ಸಿಗು (sigu) means to be found / to meet up. ನಾಳೆ ಸಿಗೋಣ (naale sigona) = see you tomorrow.',
    },
    goodMorning: {
      words: [["ಶುಭೋದಯ", "shubhodaya"]],
      notes:
        'ಶುಭೋದಯ (shubhodaya) is correct but formal (radio, messages, speeches). In daily life people say ನಮಸ್ಕಾರ (namaskaara) or the English "good morning".',
    },
    goodNight: {
      words: [
        ["ಶುಭ", "shubha"],
        ["ರಾತ್ರಿ", "raatri"],
      ],
      notes:
        'Literally "auspicious night"; used in messages and when parting at night. In conversation many people simply say "good night" in English.',
    },
    thankYou: {
      script: "ಧನ್ಯವಾದ",
      roman: "dhanyavaada",
      accept: ["thanks"],
      notes:
        'The plural ಧನ್ಯವಾದಗಳು (dhanyavaadagalu) is very common and a little warmer: ತುಂಬಾ ಧನ್ಯವಾದಗಳು (tumbaa dhanyavaadagalu) = thank you very much. Among friends people often just say "thanks".',
    },
    welcome: {
      script: "ಸುಸ್ವಾಗತ",
      roman: "susvaagata",
      notes:
        'ಸುಸ್ವಾಗತ is the formal "welcome" seen on banners and signs. To welcome a guest at the door people say ಬನ್ನಿ ಬನ್ನಿ (banni banni, come in, come in).',
    },
    // First words › Yes, no & polite words (lesson "polite-words")
    yes: {
      script: "ಹೌದು",
      roman: "haudu",
      notes:
        'ಹೌದು means "yes, that\'s right". To agree to a request say ಸರಿ (sari, okay) or ಆಯ್ತು (aaytu, okay, done). In speech a short ಹೂಂ (hoom) is a casual "yes".',
    },
    no: {
      script: "ಇಲ್ಲ",
      roman: "illa",
      notes:
        'ಇಲ್ಲ means "no / there isn\'t". ಅಲ್ಲ (alla) means "it is not (that)": ಇದು ಹಾಲು ಅಲ್ಲ (idu haalu alla, this is not milk). To refuse an offer say ಬೇಡ (beda, I don\'t want it).',
    },
    please: {
      script: "ದಯವಿಟ್ಟು",
      roman: "dayavittu",
      notes:
        "Kannada makes requests polite mostly with the polite verb ending -ಇ: ಕೊಡಿ (kodi, please give), ಬನ್ನಿ (banni, please come). ದಯವಿಟ್ಟು adds extra politeness and is more formal; you will hear it less in casual speech.",
    },
    sorry: {
      script: "ಕ್ಷಮಿಸಿ",
      roman: "kshamisi",
      notes:
        'Polite form (literally "please forgive"). To a friend: ಕ್ಷಮಿಸು (kshamisu). In everyday speech the English "sorry" is extremely common.',
    },
    excuseMe: {
      words: [
        ["ಸ್ವಲ್ಪ", "svalpa"],
        ["ನೋಡಿ", "nodi"],
      ],
      notes:
        'Literally "look a little" — the usual way to get a stranger\'s attention, often with ರೀ (ree) or ಸಾರ್ / ಮೇಡಂ (saar / medam). To apologise for interrupting, ಕ್ಷಮಿಸಿ (kshamisi) also works; to get past someone say ಸ್ವಲ್ಪ ದಾರಿ ಬಿಡಿ (svalpa daari bidi, please make way).',
    },
    okay: {
      script: "ಸರಿ",
      roman: "sari",
      notes:
        'ಸರಿ means "okay / right / correct". The spoken ಆಯ್ತು (aaytu, "done, okay") is just as common when agreeing to something.',
    },
    noProblem: {
      words: [
        ["ಏನೂ", "enoo"],
        ["ತೊಂದರೆ", "tondare"],
        ["ಇಲ್ಲ", "illa"],
      ],
      notes:
        'Literally "there is no trouble at all". ಪರವಾಗಿಲ್ಲ (paravaagilla, it\'s all right) is a shorter alternative.',
    },
    youreWelcome: {
      words: [["ಪರವಾಗಿಲ್ಲ", "paravaagilla"]],
      accept: ["it's all right", "no problem", "it's okay"],
      notes:
        'Kannada has no fixed reply to "thank you"; people say ಪರವಾಗಿಲ್ಲ (paravaagilla, it\'s all right), ಅದಕ್ಕೇನು (adakkenu, "what\'s in that?" — no need to thank) or simply smile. ಸ್ವಾಗತ is not used this way.',
    },
    // First words › Everyday things (lesson "things")
    water: {
      script: "ನೀರು",
      roman: "neeru",
      notes: "Drinking water is ಕುಡಿಯುವ ನೀರು (kudiyuva neeru); hot water ಬಿಸಿ ನೀರು (bisi neeru).",
    },
    food: {
      script: "ಊಟ",
      roman: "oota",
      notes:
        'ಊಟ is a full meal (rice and curries); a light dish or snack is ತಿಂಡಿ (tindi). The formal word for food in general is ಆಹಾರ (aahaara). "To eat a meal" is ಊಟ ಮಾಡು (oota maadu).',
    },
    house: {
      script: "ಮನೆ",
      roman: "mane",
      notes:
        '"At home" is ಮನೆಯಲ್ಲಿ (maneyalli); "to home" is ಮನೆಗೆ (manege). People say ನಮ್ಮ ಮನೆ (namma mane, our house) even when it is "my" house.',
    },
    book: {
      script: "ಪುಸ್ತಕ",
      roman: "pustaka",
      notes: "Plural: ಪುಸ್ತಕಗಳು (pustakagalu). A notebook is ನೋಟ್ ಬುಕ್ (not buk).",
    },
    phone: {
      script: "ಫೋನ್",
      roman: "fon",
      notes:
        'Everyone says ಫೋನ್ or ಮೊಬೈಲ್ (mobail). The native word ದೂರವಾಣಿ (dooravaani) appears only in formal writing. "To phone someone" is ಫೋನ್ ಮಾಡು (fon maadu).',
    },
    bag: {
      script: "ಬ್ಯಾಗ್",
      roman: "byaag",
      notes:
        "The English loan ಬ್ಯಾಗ್ is what people say for a school or travel bag. The native word ಚೀಲ (cheela) is a cloth or shopping bag; in shops a plastic carry bag is called ಕವರ್ (kavar).",
    },
    pen: {
      script: "ಪೆನ್ನು",
      roman: "pennu",
      notes:
        "Kannada often adds -ು to English words ending in a consonant: ಪೆನ್ / ಪೆನ್ನು (pen / pennu) are both used.",
    },
    money: {
      script: "ಹಣ",
      roman: "hana",
      notes:
        "ಹಣ is the standard word; in everyday speech ದುಡ್ಡು (duddu) is just as common. Note ಹಣ (hana, money) has a retroflex ಣ.",
    },
    // First words › Common actions (lesson "actions")
    come: {
      script: "ಬರು",
      roman: "baru",
      notes:
        'Dictionary form. Commands: ಬಾ (baa, come — casual), ಬನ್ನಿ (banni, please come — polite). "I will come" = ಬರುತ್ತೇನೆ (baruttene), spoken ಬರ್ತೀನಿ (barteeni).',
    },
    go: {
      script: "ಹೋಗು",
      roman: "hogu",
      notes:
        'Dictionary form, also the casual command "go!". Polite: ಹೋಗಿ (hogi). "I went" = ಹೋದೆ (hode); "let\'s go" = ಹೋಗೋಣ (hogona).',
    },
    eat: {
      script: "ತಿನ್ನು",
      roman: "tinnu",
      notes:
        'ತಿನ್ನು is to eat (anything). For having a proper meal Kannada prefers ಊಟ ಮಾಡು (oota maadu, "do the meal"). Past: ತಿಂದೆ (tinde, I ate).',
    },
    drink: {
      script: "ಕುಡಿ",
      roman: "kudi",
      notes:
        'Polite command ಕುಡಿಯಿರಿ (kudiyiri, please drink). "I am drinking" = ಕುಡಿಯುತ್ತಿದ್ದೇನೆ (kudiyuttiddene).',
    },
    see: {
      script: "ನೋಡು",
      roman: "nodu",
      notes:
        'Means both "see" and "look/watch". ನೋಡಿ (nodi) is also used like "look, ..." or "excuse me" to get attention.',
    },
    give: {
      script: "ಕೊಡು",
      roman: "kodu",
      notes:
        "Casual command ಕೊಡು (kodu, give); polite ಕೊಡಿ (kodi, please give) — the key word for asking for things: ನೀರು ಕೊಡಿ (neeru kodi).",
    },
    take: {
      script: "ತೆಗೆದುಕೊಳ್ಳು",
      roman: "tegedukollu",
      notes:
        "Polite: ತೆಗೆದುಕೊಳ್ಳಿ (tegedukolli, please take). In speech it shrinks to ತಗೊ (tago) / ತಗೊಳ್ಳಿ (tagolli).",
    },
    doVerb: {
      script: "ಮಾಡು",
      roman: "maadu",
      notes:
        "A very busy verb: ಊಟ ಮಾಡು (eat a meal), ಕೆಲಸ ಮಾಡು (work), ಫೋನ್ ಮಾಡು (phone), ಸ್ನಾನ ಮಾಡು (bathe).",
    },
    // First words › This, that & questions (lesson "this-and-that")
    this: {
      script: "ಈ",
      roman: "ee",
      notes:
        'ಈ (ee) is "this" before a noun: ಈ ಪುಸ್ತಕ (ee pustaka, this book). Standing alone, "this (one)" is ಇದು (idu): ಇದು ಏನು? (what is this?).',
    },
    that: {
      script: "ಆ",
      roman: "aa",
      notes:
        'ಆ (aa) is "that" before a noun: ಆ ಮನೆ (aa mane, that house). Standing alone, "that (one)" is ಅದು (adu), which is also the word for "it".',
    },
    here: {
      script: "ಇಲ್ಲಿ",
      roman: "illi",
      notes:
        '"Right here" is ಇಲ್ಲೇ (ille). The ಇ- (near) vs ಅ- (far) pattern runs through Kannada: ಇಲ್ಲಿ/ಅಲ್ಲಿ, ಇದು/ಅದು, ಇವನು/ಅವನು.',
    },
    there: {
      script: "ಅಲ್ಲಿ",
      roman: "alli",
      notes:
        '"Right there" is ಅಲ್ಲೇ (alle). The same -ಅಲ್ಲಿ is also the ending for "in": ಮನೆಯಲ್ಲಿ (maneyalli, in the house).',
    },
    what: {
      script: "ಏನು",
      roman: "enu",
      notes: "In speech often shortened to ಏನ್ (en). Note the long ಏ: ಏನು (enu).",
    },
    who: {
      script: "ಯಾರು",
      roman: "yaaru",
      notes: 'ಯಾರು? (yaaru?) = who? "Whose" is ಯಾರ (yaara): ಇದು ಯಾರ ಪುಸ್ತಕ? (whose book is this?).',
    },
    whatIsThis: {
      words: [
        ["ಇದು", "idu"],
        ["ಏನು?", "enu?"],
      ],
      notes:
        'Kannada needs no "is" here: literally "this what?". In speech it often merges to ಇದೇನು? (idenu?).',
    },
    whoIsThis: {
      words: [
        ["ಇವರು", "ivaru"],
        ["ಯಾರು?", "yaaru?"],
      ],
      notes:
        'ಇವರು (ivaru) is the respectful "this person". For a boy or a friend: ಇವನು ಯಾರು? (ivanu yaaru?); for a girl: ಇವಳು ಯಾರು? (ivalu yaaru?).',
    },
    thisIsWater: {
      words: [
        ["ಇದು", "idu"],
        ["ನೀರು", "neeru"],
      ],
      notes: 'Literally "this water": Kannada drops "is" in simple X-is-Y sentences.',
    },
    // Introducing yourself › My name is… (lesson "my-name")
    name: { script: "ಹೆಸರು", roman: "hesaru" },
    iPronoun: {
      script: "ನಾನು",
      roman: "naanu",
      notes:
        'Often dropped, because the verb ending already shows "I": ಬರುತ್ತೇನೆ (baruttene) alone means "I will come".',
    },
    youFormal: {
      script: "ನೀವು",
      roman: "neevu",
      notes:
        'Respectful "you" (also "you" plural). Use it with elders, strangers, teachers and shopkeepers. The casual ನೀನು (neenu) is for close friends, younger people and children.',
    },
    my: {
      script: "ನನ್ನ",
      roman: "nanna",
      notes:
        "For family and home Kannada often says ನಮ್ಮ (namma, our): ನಮ್ಮ ಅಮ್ಮ (namma amma, my mum), ನಮ್ಮ ಮನೆ (namma mane, my house).",
    },
    yourFormal: {
      script: "ನಿಮ್ಮ",
      roman: "nimma",
      notes: 'Respectful "your". Casual: ನಿನ್ನ (ninna).',
    },
    myNameIs: {
      words: [
        ["ನನ್ನ", "nanna"],
        ["ಹೆಸರು", "hesaru"],
        ["ಆಶಾ", "Asha"],
      ],
      blank: 1,
      notes:
        'Literally "my name Asha" — no word for "is". You can also say ನಾನು ಆಶಾ (naanu Asha, I am Asha).',
    },
    whatIsYourName: {
      words: [
        ["ನಿಮ್ಮ", "nimma"],
        ["ಹೆಸರು", "hesaru"],
        ["ಏನು?", "enu?"],
      ],
      notes:
        "Polite. To a child or friend: ನಿನ್ನ ಹೆಸರು ಏನು? (ninna hesaru enu?). Spoken: ನಿಮ್ ಹೆಸರೇನು? (nim hesarenu?).",
    },
    // Introducing yourself › How are you? (lesson "how-are-you")
    howAreYou: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಹೇಗಿದ್ದೀರಿ?", "hegiddeeri?"],
      ],
      notes:
        "Polite. Casual: ನೀನು ಹೇಗಿದ್ದೀಯ? (neenu hegiddeeya?). Very common alternatives: ಚೆನ್ನಾಗಿದ್ದೀರಾ? (chennaagiddeeraa?, are you well?) and ಆರಾಮಾ? (aaraamaa?, all well?).",
    },
    iAmFine: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಚೆನ್ನಾಗಿದ್ದೇನೆ", "chennaagiddene"],
      ],
      notes:
        "ಚೆನ್ನಾಗಿ (chennaagi, well) + ಇದ್ದೇನೆ (iddene, I am). Spoken: ಚೆನ್ನಾಗಿದ್ದೀನಿ (chennaagiddeeni). Also common: ಆರಾಮಾಗಿದ್ದೀನಿ (aaraamaagiddeeni).",
    },
    andYou: {
      words: [
        ["ಮತ್ತೆ", "matte"],
        ["ನೀವು?", "neevu?"],
      ],
      notes:
        'Literally "and then, you?". You can also repeat the full question: ನೀವು ಹೇಗಿದ್ದೀರಿ? To a friend: ಮತ್ತೆ ನೀನು? (matte neenu?).',
    },
    veryGood: {
      words: [
        ["ತುಂಬಾ", "tumbaa"],
        ["ಒಳ್ಳೆಯದು", "olleyadu"],
      ],
      notes:
        "ತುಂಬಾ (tumbaa) = very / a lot. To praise food, work or a performance people more often say ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ (tumbaa chennaagide, it's very nice).",
    },
    iAmAlsoFine: {
      words: [
        ["ನಾನೂ", "naanoo"],
        ["ಚೆನ್ನಾಗಿದ್ದೇನೆ", "chennaagiddene"],
      ],
      notes: 'The long -ಊ on ನಾನೂ (naanoo) means "also": ನಾನು (I) → ನಾನೂ (I too).',
    },
    // Introducing yourself › Where are you from? (lesson "where-from")
    whereAreYouFrom: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಎಲ್ಲಿಯವರು?", "elliyavaru?"],
      ],
      notes:
        'Literally "you are of where?". Also common: ನಿಮ್ಮ ಊರು ಯಾವುದು? (nimma ooru yaavudu?, which is your home town?).',
    },
    iAmFromIndia: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಭಾರತದಿಂದ", "bhaaratadinda"],
        ["ಬಂದಿದ್ದೇನೆ", "bandiddene"],
      ],
      notes:
        'Literally "I have come from India" — the same for men and women. Another common pattern: a man says ನಾನು ಭಾರತದವನು (naanu bhaaratadavanu), a woman ನಾನು ಭಾರತದವಳು (naanu bhaaratadavalu).',
    },
    india: {
      script: "ಭಾರತ",
      roman: "bhaarata",
      notes: 'The English "India" (ಇಂಡಿಯಾ, indiyaa) is also widely used in speech.',
    },
    city: {
      script: "ನಗರ",
      roman: "nagara",
      notes:
        "In conversation people usually say ಊರು (ooru, town / home town) for any place they live; ಪಟ್ಟಣ (pattana) is a town.",
    },
    village: {
      script: "ಹಳ್ಳಿ",
      roman: "halli",
      notes:
        'The formal word is ಗ್ರಾಮ (graama). Many place names end in -ಹಳ್ಳಿ (-halli), e.g. ಹೊಸಹಳ್ಳಿ (hosahalli, "new village"), ಮಾರತ್ತಹಳ್ಳಿ (maarattahalli) in Bengaluru.',
    },
    country: { script: "ದೇಶ", roman: "desha" },
    whereDoYouLive: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಎಲ್ಲಿ", "elli"],
        ["ಇರುತ್ತೀರಿ?", "irutteeri?"],
      ],
      notes:
        'Kannada uses ಇರು (iru, to be/stay) for "to live". Spoken: ಎಲ್ಲಿ ಇರ್ತೀರಾ? (elli irteeraa?). Also common: ನಿಮ್ಮ ಮನೆ ಎಲ್ಲಿ? (nimma mane elli?, where is your house?).',
    },
    iLiveInCity: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಬೆಂಗಳೂರಿನಲ್ಲಿ", "bengaloorinalli"],
        ["ಇರುತ್ತೇನೆ", "iruttene"],
      ],
      meaning: "I live in Bengaluru.",
      notes:
        "ಬೆಂಗಳೂರು + -ಇನ + -ಅಲ್ಲಿ (in) = ಬೆಂಗಳೂರಿನಲ್ಲಿ. Spoken: ನಾನು ಬೆಂಗಳೂರಲ್ಲಿ ಇರ್ತೀನಿ (naanu bengalooralli irteeni). Other cities: ಮೈಸೂರಿನಲ್ಲಿ (in Mysuru), ಮಂಗಳೂರಿನಲ್ಲಿ (in Mangaluru), ಹುಬ್ಬಳ್ಳಿಯಲ್ಲಿ (in Hubballi).",
    },
    // Introducing yourself › Nice to meet you (lesson "nice-to-meet-you")
    niceToMeetYou: {
      words: [
        ["ನಿಮ್ಮನ್ನು", "nimmannu"],
        ["ಭೇಟಿಯಾಗಿ", "bhetiyaagi"],
        ["ಸಂತೋಷವಾಯಿತು", "santoshavaayitu"],
      ],
      notes:
        'Literally "having met you, it became a pleasure". Everyday spoken version: ನಿಮ್ಮನ್ನ ನೋಡಿ ಖುಷಿ ಆಯ್ತು (nimmanna nodi khushi aaytu). Reply: ನನಗೂ ಸಂತೋಷವಾಯಿತು (nanagoo santoshavaayitu, me too).',
    },
    iAmAStudent: {
      words: [
        ["ನಾನು", "naanu"],
        ["ವಿದ್ಯಾರ್ಥಿ", "vidyaarthi"],
      ],
      notes:
        "No verb needed. A female student may say ನಾನು ವಿದ್ಯಾರ್ಥಿನಿ (naanu vidyaarthini), though ವಿದ್ಯಾರ್ಥಿ is used for everyone in speech.",
    },
    iAmLearningLanguage: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಕನ್ನಡ", "kannada"],
        ["ಕಲಿಯುತ್ತಿದ್ದೇನೆ", "kaliyuttiddene"],
      ],
      meaning: "I am learning Kannada.",
      notes:
        "Spoken: ನಾನು ಕನ್ನಡ ಕಲೀತಿದ್ದೀನಿ (naanu kannada kaleetiddeeni). Saying this in Karnataka usually earns a big smile and lots of help.",
    },
    iSpeakALittle: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಸ್ವಲ್ಪ", "svalpa"],
        ["ಕನ್ನಡ", "kannada"],
        ["ಮಾತನಾಡುತ್ತೇನೆ", "maatanaaduttene"],
      ],
      meaning: "I speak a little Kannada.",
      notes:
        'The idiomatic version is ನನಗೆ ಸ್ವಲ್ಪ ಸ್ವಲ್ಪ ಕನ್ನಡ ಬರುತ್ತೆ (nanage svalpa svalpa kannada barutte), literally "a little Kannada comes to me". ಮಾತನಾಡು is often said ಮಾತಾಡು (maataadu).',
    },
    student: {
      script: "ವಿದ್ಯಾರ್ಥಿ",
      roman: "vidyaarthi",
      notes: "Feminine ವಿದ್ಯಾರ್ಥಿನಿ (vidyaarthini) is used in formal Kannada.",
    },
    teacher: {
      script: "ಶಿಕ್ಷಕ",
      roman: "shikshaka",
      notes:
        "A female teacher is ಶಿಕ್ಷಕಿ (shikshaki). Students address teachers as ಸಾರ್ (saar) or ಮೇಡಂ (medam), and often say ಟೀಚರ್ (teechar); ಮೇಷ್ಟ್ರು (meshtru) is an older, affectionate word for a (male) teacher.",
    },
    // Introducing yourself › I don't understand (lesson "understanding")
    iUnderstand: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಅರ್ಥ", "artha"],
        ["ಆಯಿತು", "aayitu"],
      ],
      notes:
        'Literally "to me meaning happened" = I understood. Spoken: ಅರ್ಥ ಆಯ್ತು (artha aaytu). ಗೊತ್ತಾಯಿತು (gottaayitu, I got it) is also common.',
    },
    iDontUnderstand: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಅರ್ಥ", "artha"],
        ["ಆಗಲಿಲ್ಲ", "aagalilla"],
      ],
      notes:
        'Literally "to me the meaning didn\'t happen". Spoken: ಅರ್ಥ ಆಗ್ಲಿಲ್ಲ (artha aaglilla). For something you keep not getting: ಅರ್ಥ ಆಗುತ್ತಿಲ್ಲ (artha aaguttilla).',
    },
    pleaseRepeat: {
      words: [
        ["ದಯವಿಟ್ಟು", "dayavittu"],
        ["ಇನ್ನೊಮ್ಮೆ", "innomme"],
        ["ಹೇಳಿ", "heli"],
      ],
      blank: 1,
      notes:
        'ಇನ್ನೊಮ್ಮೆ (innomme) = once more. Casual: ಇನ್ನೊಮ್ಮೆ ಹೇಳು (innomme helu). A quick "sorry, what?" is ಏನು? (enu?) or ಏನಂದ್ರಿ? (enandri?, what did you say?).',
    },
    speakSlowly: {
      words: [
        ["ದಯವಿಟ್ಟು", "dayavittu"],
        ["ನಿಧಾನವಾಗಿ", "nidhaanavaagi"],
        ["ಮಾತನಾಡಿ", "maatanaadi"],
      ],
      blank: 1,
      notes:
        "Casual: ನಿಧಾನವಾಗಿ ಮಾತಾಡು (nidhaanavaagi maataadu). In speech: ಸ್ವಲ್ಪ ನಿಧಾನ ಮಾತಾಡಿ (svalpa nidhaana maataadi).",
    },
    whatDoesThisMean: {
      words: [
        ["ಇದರ", "idara"],
        ["ಅರ್ಥ", "artha"],
        ["ಏನು?", "enu?"],
      ],
      notes: 'Literally "its meaning what?". ಇದರ (idara) = of this.',
    },
    doYouSpeakEnglish: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಇಂಗ್ಲಿಷ್", "inglish"],
        ["ಮಾತನಾಡುತ್ತೀರಾ?", "maatanaadutteeraa?"],
      ],
      notes:
        "The question ending -ಆ turns a statement into a yes/no question. Very idiomatic alternative: ನಿಮಗೆ ಇಂಗ್ಲಿಷ್ ಬರುತ್ತಾ? (nimage inglish baruttaa?, does English come to you?).",
    },
    howDoYouSay: {
      words: [
        ["ಇದನ್ನು", "idannu"],
        ["ಕನ್ನಡದಲ್ಲಿ", "kannadadalli"],
        ["ಹೇಗೆ", "hege"],
        ["ಹೇಳುತ್ತಾರೆ?", "heluttaare?"],
      ],
      meaning: "How do you say this in Kannada?",
      blank: 1,
      notes:
        'Literally "how do they say this in Kannada?". Spoken: ಇದನ್ನ ಕನ್ನಡದಲ್ಲಿ ಏನಂತಾರೆ? (idanna kannadadalli enantaare?, what do they call this in Kannada?).',
    },
    // Family & people › Parents & children (lesson "parents-children")
    mother: {
      script: "ಅಮ್ಮ",
      roman: "amma",
      notes:
        "ಅಮ್ಮ is the everyday word; ತಾಯಿ (taayi) is the formal/written word. In North Karnataka you will also hear ಅವ್ವ (avva).",
    },
    father: {
      script: "ಅಪ್ಪ",
      roman: "appa",
      notes:
        "ಅಪ್ಪ is everyday; ತಂದೆ (tande) is formal. Some families say ಅಪ್ಪಾಜಿ (appaaji) respectfully.",
    },
    parents: {
      script: "ತಂದೆ-ತಾಯಿ",
      roman: "tande-taayi",
      notes:
        'Literally "father-mother". In speech: ಅಪ್ಪ-ಅಮ್ಮ (appa-amma). Formal word: ಪೋಷಕರು (poshakaru), seen on school forms.',
    },
    son: {
      script: "ಮಗ",
      roman: "maga",
      notes:
        'ಮಗ (maga) also turns up in Bengaluru slang as ಮಗಾ (magaa), "dude" — only among close friends.',
    },
    daughter: { script: "ಮಗಳು", roman: "magalu" },
    child: {
      script: "ಮಗು",
      roman: "magu",
      notes: "ಮಗು is a baby or small child; children in general are ಮಕ್ಕಳು (makkalu).",
    },
    family: {
      script: "ಕುಟುಂಬ",
      roman: "kutumba",
      notes: "In conversation people say ಮನೆಯವರು (maneyavaru, the people of the house) for family.",
    },
    // Family & people › Brothers, sisters & partners (lesson "siblings")
    elderBrother: {
      script: "ಅಣ್ಣ",
      roman: "anna",
      notes:
        "Also used to address any older man politely (a shopkeeper, an auto driver): ಅಣ್ಣ, ... Careful: ಅಣ್ಣ (anna, brother, retroflex ಣ) vs ಅನ್ನ (anna, rice).",
    },
    youngerBrother: {
      script: "ತಮ್ಮ",
      roman: "tamma",
      notes:
        "Not to be confused with ನಮ್ಮ (namma, our). Older people call any boy ತಮ್ಮಾ (tammaa) affectionately.",
    },
    elderSister: {
      script: "ಅಕ್ಕ",
      roman: "akka",
      notes:
        "Also the polite way to address a young woman slightly older than you, e.g. a shop assistant.",
    },
    youngerSister: { script: "ತಂಗಿ", roman: "tangi" },
    husband: {
      script: "ಗಂಡ",
      roman: "ganda",
      notes:
        'Formal: ಪತಿ (pati). Many women say ನಮ್ಮ ಯಜಮಾನರು (namma yajamaanaru, "our master") or "my husband" in English.',
    },
    wife: {
      script: "ಹೆಂಡತಿ",
      roman: "hendati",
      notes: 'Formal: ಪತ್ನಿ (patni). Men often say ನನ್ನ ಹೆಂಡತಿ or "my wife" in English.',
    },
    // Family & people › Grandparents & relatives (lesson "grandparents")
    grandfatherPaternal: {
      script: "ಅಜ್ಜ",
      roman: "ajja",
      notes:
        "Kannada uses ಅಜ್ಜ (ajja) for both grandfathers; ತಾತ (taata) is also common, especially around Bengaluru and Mysuru. To be specific: ಅಪ್ಪನ ಅಪ್ಪ (appana appa, father's father).",
    },
    grandmotherPaternal: {
      script: "ಅಜ್ಜಿ",
      roman: "ajji",
      notes:
        "ಅಜ್ಜಿ (ajji) is used for both grandmothers. To be specific: ಅಪ್ಪನ ಅಮ್ಮ (appana amma, father's mother).",
    },
    grandfatherMaternal: {
      script: "ಅಮ್ಮನ ಅಪ್ಪ",
      roman: "ammana appa",
      notes:
        "Literally \"mother's father\" — the way to be specific. When talking to him, you call him ಅಜ್ಜ (ajja) or ತಾತ (taata), just like your father's father.",
    },
    grandmotherMaternal: {
      script: "ಅಮ್ಮನ ಅಮ್ಮ",
      roman: "ammana amma",
      notes:
        "Literally \"mother's mother\". You call her ಅಜ್ಜಿ (ajji), the same as your father's mother.",
    },
    uncleMaternal: {
      script: "ಮಾವ",
      roman: "maava",
      notes:
        "ಮಾವ is mother's brother and also father-in-law (and father's sister's husband). Father's brothers are ದೊಡ್ಡಪ್ಪ (doddappa, elder) and ಚಿಕ್ಕಪ್ಪ (chikkappa, younger).",
    },
    auntPaternal: {
      script: "ಅತ್ತೆ",
      roman: "atte",
      notes:
        "ಅತ್ತೆ is father's sister and also mother-in-law (and mother's brother's wife). Mother's sisters are ದೊಡ್ಡಮ್ಮ (doddamma, elder) and ಚಿಕ್ಕಮ್ಮ (chikkamma, younger).",
    },
    // Family & people › People (lesson "people")
    man: {
      script: "ಗಂಡಸು",
      roman: "gandasu",
      notes: "Formal: ಪುರುಷ (purusha). To address a man politely, say ಸಾರ್ (saar) or ಅಣ್ಣ (anna).",
    },
    woman: {
      script: "ಹೆಂಗಸು",
      roman: "hengasu",
      notes:
        "Formal and more respectful: ಮಹಿಳೆ (mahile). To address a woman politely, say ಮೇಡಂ (medam), ಅಕ್ಕ (akka) or ಅಮ್ಮ (amma).",
    },
    boy: { script: "ಹುಡುಗ", roman: "huduga", notes: "Plural ಹುಡುಗರು (hudugaru)." },
    girl: { script: "ಹುಡುಗಿ", roman: "hudugi", notes: "Plural ಹುಡುಗಿಯರು (hudugiyaru)." },
    friend: {
      script: "ಸ್ನೇಹಿತ",
      roman: "snehita",
      notes:
        "A female friend is ಸ್ನೇಹಿತೆ (snehite); friends in general ಸ್ನೇಹಿತರು (snehitaru). ಗೆಳೆಯ / ಗೆಳತಿ (geleya / gelati) are warmer words, and young people often just say ಫ್ರೆಂಡ್ (frend).",
    },
    neighbour: {
      script: "ಪಕ್ಕದ ಮನೆಯವರು",
      roman: "pakkada maneyavaru",
      notes:
        'Literally "the people of the next house" — what people actually say. The formal word is ನೆರೆಹೊರೆಯವರು (nerehoreyavaru).',
    },
    person: {
      script: "ವ್ಯಕ್ತಿ",
      roman: "vyakti",
      notes: 'In speech you also hear ಮನುಷ್ಯ (manushya, human being); "people" is ಜನ (jana).',
    },
    doctor: {
      script: "ಡಾಕ್ಟರ್",
      roman: "daaktar",
      notes: "Everyone says ಡಾಕ್ಟರ್. The native word ವೈದ್ಯ (vaidya) is used in formal writing.",
    },
    // Family & people › Describing people (lesson "describing-people")
    tall: {
      script: "ಎತ್ತರ",
      roman: "ettara",
      notes: "ಎತ್ತರ means height or tall: ಅವನು ಎತ್ತರ ಇದ್ದಾನೆ (avanu ettara iddaane, he is tall).",
    },
    short: {
      script: "ಕುಳ್ಳ",
      roman: "kulla",
      notes:
        "ಕುಳ್ಳ (kulla) is direct and can sound teasing; more polite: ಸ್ವಲ್ಪ ಗಿಡ್ಡ (svalpa gidda) or ಎತ್ತರ ಕಡಿಮೆ (ettara kadime, less tall). For a woman: ಕುಳ್ಳಿ (kulli).",
    },
    good: {
      script: "ಒಳ್ಳೆಯ",
      roman: "olleya",
      notes:
        'ಒಳ್ಳೆಯ goes before a noun: ಒಳ್ಳೆಯ ಹುಡುಗ (good boy). "He/she is a good person" = ಅವರು ಒಳ್ಳೆಯವರು (avaru olleyavaru).',
    },
    beautiful: {
      script: "ಸುಂದರ",
      roman: "sundara",
      notes:
        "ಸುಂದರ is a little literary; in speech people say ಚೆನ್ನಾಗಿದ್ದಾಳೆ (chennaagiddaale, she looks nice) or ಚಂದ (chanda, pretty).",
    },
    young: {
      script: "ಚಿಕ್ಕ",
      roman: "chikka",
      notes:
        "ಚಿಕ್ಕ means small or young: ಚಿಕ್ಕ ಹುಡುಗ (a young boy), ಚಿಕ್ಕ ವಯಸ್ಸು (young age). The formal ಯುವ (yuva) appears in ಯುವಕ (yuvaka, young man).",
    },
    old: {
      script: "ವಯಸ್ಸಾದ",
      roman: "vayassaada",
      notes:
        'Literally "aged" — the polite way to describe an older person. Old things are ಹಳೆಯ (haleya): ಹಳೆಯ ಮನೆ (old house). ಮುದುಕ (muduka, old man) can sound rude.',
    },
    kind: {
      script: "ದಯಾಳು",
      roman: "dayaalu",
      notes:
        "In everyday speech people say ಒಳ್ಳೆಯ ಮನಸ್ಸಿನವರು (olleya manassinavaru, a person with a good heart).",
    },
    thisIsMyMother: {
      words: [
        ["ಇವರು", "ivaru"],
        ["ನನ್ನ", "nanna"],
        ["ಅಮ್ಮ", "amma"],
      ],
      notes:
        'ಇವರು (ivaru) is the respectful "this person", used for parents and elders. Many people say ನಮ್ಮ ಅಮ್ಮ (namma amma) instead of ನನ್ನ ಅಮ್ಮ.',
    },
    heIsMyFriend: {
      words: [
        ["ಅವನು", "avanu"],
        ["ನನ್ನ", "nanna"],
        ["ಸ್ನೇಹಿತ", "snehita"],
      ],
      notes:
        "If he is right here, say ಇವನು (ivanu). For a female friend: ಅವಳು ನನ್ನ ಸ್ನೇಹಿತೆ (avalu nanna snehite). For an older friend use ಅವರು (avaru).",
    },
    sheIsMySister: {
      words: [
        ["ಅವಳು", "avalu"],
        ["ನನ್ನ", "nanna"],
        ["ಅಕ್ಕ", "akka"],
      ],
      notes:
        "In the family ಅವಳು (avalu, she) is normal; to sound more respectful say ಅವರು ನನ್ನ ಅಕ್ಕ (avaru nanna akka). Younger sister: ಅವಳು ನನ್ನ ತಂಗಿ (avalu nanna tangi).",
    },
    myFatherIsADoctor: {
      words: [
        ["ನನ್ನ", "nanna"],
        ["ಅಪ್ಪ", "appa"],
        ["ಡಾಕ್ಟರ್", "daaktar"],
      ],
      notes:
        "No verb needed. More respectful: ನಮ್ಮ ಅಪ್ಪ ಡಾಕ್ಟರ್ ಆಗಿದ್ದಾರೆ (namma appa daaktar aagiddaare).",
    },
    // Family & people › Family review (lesson "family-review")
    howManyBrothers: {
      words: [
        ["ನಿಮಗೆ", "nimage"],
        ["ಎಷ್ಟು", "eshtu"],
        ["ಜನ", "jana"],
        ["ಅಣ್ಣ-ತಮ್ಮಂದಿರು", "anna-tammandiru"],
        ["ಇದ್ದಾರೆ?", "iddaare?"],
      ],
      blank: 3,
      notes:
        'Kannada has no single word for "brother": ಅಣ್ಣ-ತಮ್ಮಂದಿರು (elder-and-younger brothers) means brothers. "To you are there…" is how Kannada says "do you have". ಜನ (jana) counts people.',
    },
    iHaveOneBrother: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಒಬ್ಬ", "obba"],
        ["ತಮ್ಮ", "tamma"],
        ["ಇದ್ದಾನೆ", "iddaane"],
      ],
      blank: 2,
      notes:
        'Literally "to me one younger brother is there". People are counted with special forms: ಒಬ್ಬ (obba, one man), ಒಬ್ಬಳು (obbalu, one woman), ಇಬ್ಬರು (ibbaru, two people).',
    },
    iHaveTwoSisters: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಇಬ್ಬರು", "ibbaru"],
        ["ಅಕ್ಕ-ತಂಗಿಯರು", "akka-tangiyaru"],
        ["ಇದ್ದಾರೆ", "iddaare"],
      ],
      blank: 1,
      notes:
        "ಅಕ್ಕ-ತಂಗಿಯರು (akka-tangiyaru) = sisters (elder and younger). If both are elder: ಇಬ್ಬರು ಅಕ್ಕಂದಿರು (ibbaru akkandiru).",
    },
    // Food & drinks › Everyday food (lesson "food-staples")
    rice: {
      script: "ಅನ್ನ",
      roman: "anna",
      notes:
        "ಅನ್ನ is cooked rice; raw rice is ಅಕ್ಕಿ (akki). A typical Karnataka meal is ಅನ್ನ ಸಾರು (anna saaru, rice with a thin lentil curry).",
    },
    roti: {
      script: "ರೊಟ್ಟಿ",
      roman: "rotti",
      notes:
        "Karnataka has ಜೋಳದ ರೊಟ್ಟಿ (jolada rotti, jowar roti, North Karnataka) and ಅಕ್ಕಿ ರೊಟ್ಟಿ (akki rotti, rice roti). The soft wheat flatbread is called ಚಪಾತಿ (chapaati).",
    },
    dal: {
      script: "ಬೇಳೆ",
      roman: "bele",
      notes:
        "ಬೇಳೆ is split lentils (usually ತೊಗರಿ ಬೇಳೆ, toor dal). The cooked dish is ಸಾರು (saaru) or ಬೇಳೆ ಸಾರು; restaurants also say ದಾಲ್ (daal). Don't confuse with ಬೆಲೆ (bele, price).",
    },
    vegetables: {
      script: "ತರಕಾರಿ",
      roman: "tarakaari",
      notes:
        "A dry vegetable side dish is ಪಲ್ಯ (palya); a thick vegetable curry is ಹುಳಿ / ಸಾಂಬಾರ್ (huli / saambaar).",
    },
    curd: {
      script: "ಮೊಸರು",
      roman: "mosaru",
      notes: "Meals end with ಮೊಸರನ್ನ (mosaranna, curd rice).",
    },
    salt: {
      script: "ಉಪ್ಪು",
      roman: "uppu",
      notes: '"A little more salt" = ಸ್ವಲ್ಪ ಉಪ್ಪು ಬೇಕು (svalpa uppu beku).',
    },
    sugar: { script: "ಸಕ್ಕರೆ", roman: "sakkare", notes: "Jaggery is ಬೆಲ್ಲ (bella)." },
    sweets: {
      script: "ಸಿಹಿ ತಿಂಡಿ",
      roman: "sihi tindi",
      notes:
        'Literally "sweet snack"; people also just say ಸಿಹಿ (sihi) or ಸ್ವೀಟ್ (sweet). Famous Karnataka sweets: ಮೈಸೂರು ಪಾಕ್ (maisooru paak), ಹೋಳಿಗೆ (holige), ಧಾರವಾಡ ಪೇಡ (dhaaravaada peda).',
    },
    // Food & drinks › Drinks (lesson "drinks")
    tea: {
      script: "ಟೀ",
      roman: "tee",
      notes:
        "Also ಚಹಾ (chahaa), more common in North Karnataka. In Bengaluru, coffee is the default hot drink.",
    },
    coffee: {
      script: "ಕಾಫಿ",
      roman: "kaafi",
      notes:
        "Karnataka is coffee country: ask for ಫಿಲ್ಟರ್ ಕಾಫಿ (filtar kaafi), served in a steel tumbler.",
    },
    milk: {
      script: "ಹಾಲು",
      roman: "haalu",
      notes: "Careful: ಹಾಲು (haalu, milk) vs ಹಲ್ಲು (hallu, tooth).",
    },
    juice: {
      script: "ಜ್ಯೂಸ್",
      roman: "jyoos",
      notes: "Everyone says ಜ್ಯೂಸ್; the native phrase is ಹಣ್ಣಿನ ರಸ (hannina rasa, fruit juice).",
    },
    buttermilk: {
      script: "ಮಜ್ಜಿಗೆ",
      roman: "majjige",
      notes: "Thin spiced buttermilk, a favourite in hot weather and at the end of a meal.",
    },
    coconutWater: {
      script: "ಎಳನೀರು",
      roman: "elaneeru",
      notes: 'Literally "tender water" — sold from carts all over Karnataka.',
    },
    // Food & drinks › Fruits, vegetables & more (lesson "fruits-vegetables")
    fruit: {
      script: "ಹಣ್ಣು",
      roman: "hannu",
      notes:
        "Many fruit names end in -ಹಣ್ಣು: ಬಾಳೆಹಣ್ಣು (banana), ಮಾವಿನಹಣ್ಣು (mango). ಹಣ್ಣು (hannu, fruit) has ಣ; don't confuse with ಹಣ (hana, money).",
    },
    banana: {
      script: "ಬಾಳೆಹಣ್ಣು",
      roman: "baalehannu",
      notes:
        "ಬಾಳೆ (baale) is the banana plant; the leaf ಬಾಳೆ ಎಲೆ (baale ele) is used as a plate at festive meals.",
    },
    mango: {
      script: "ಮಾವಿನಹಣ್ಣು",
      roman: "maavinahannu",
      notes:
        "ಮಾವು (maavu) is the mango tree/raw mango; ಮಾವಿನಕಾಯಿ (maavinakaayi) is an unripe mango.",
    },
    apple: { script: "ಸೇಬು", roman: "sebu", notes: "ಆಪಲ್ (aapal) is also commonly said." },
    onion: { script: "ಈರುಳ್ಳಿ", roman: "eerulli" },
    tomato: { script: "ಟೊಮೆಟೊ", roman: "tometo", notes: "Also spelled ಟೊಮ್ಯಾಟೊ (tomyaato)." },
    potato: { script: "ಆಲೂಗಡ್ಡೆ", roman: "aaloogadde" },
    egg: { script: "ಮೊಟ್ಟೆ", roman: "motte" },
    fish: {
      script: "ಮೀನು",
      roman: "meenu",
      notes: "Fish curry, ಮೀನು ಸಾರು (meenu saaru), is a coastal (Mangaluru) speciality.",
    },
    chicken: {
      script: "ಕೋಳಿ",
      roman: "koli",
      notes:
        "ಕೋಳಿ is a hen/chicken (the bird and the meat); on menus you will mostly see ಚಿಕನ್ (chikan). Meat in general is ಮಾಂಸ (maamsa).",
    },
    // Food & drinks › Hungry & thirsty (lesson "hungry-thirsty")
    hungry: {
      script: "ಹಸಿವು",
      roman: "hasivu",
      notes: 'Literally "hunger" (a noun): Kannada says "to me hunger has come" — ನನಗೆ ಹಸಿವಾಗಿದೆ.',
    },
    thirsty: {
      script: "ಬಾಯಾರಿಕೆ",
      roman: "baayaarike",
      notes:
        'Literally "thirst" (from ಬಾಯಿ, mouth + ಆರು, to dry). Used like ಹಸಿವು: ನನಗೆ ಬಾಯಾರಿಕೆಯಾಗಿದೆ.',
    },
    tasty: {
      script: "ರುಚಿಯಾದ",
      roman: "ruchiyaada",
      notes:
        "From ರುಚಿ (ruchi, taste). To praise food say ರುಚಿಯಾಗಿದೆ (ruchiyaagide) or simply ಚೆನ್ನಾಗಿದೆ (chennaagide, it's nice).",
    },
    spicy: {
      script: "ಖಾರ",
      roman: "khaara",
      notes: 'ಖಾರ means spicy-hot (chilli). "Less spicy" = ಖಾರ ಕಡಿಮೆ (khaara kadime).',
    },
    sweetTaste: {
      script: "ಸಿಹಿ",
      roman: "sihi",
      notes: "Other tastes: ಉಪ್ಪು (salty), ಹುಳಿ (huli, sour), ಕಹಿ (kahi, bitter), ಖಾರ (spicy).",
    },
    iAmHungry: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಹಸಿವಾಗಿದೆ", "hasivaagide"],
      ],
      notes:
        'Literally "to me hunger has happened". Spoken: ಹಸಿವಾಗ್ತಿದೆ (hasivaagtide) or, very commonly, ಹೊಟ್ಟೆ ಹಸಿತಿದೆ (hotte hasitide, my stomach is hungry).',
    },
    iAmThirsty: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಬಾಯಾರಿಕೆಯಾಗಿದೆ", "baayaarikeyaagide"],
      ],
      notes:
        'Literally "to me thirst has happened". In speech people often just say ನೀರು ಬೇಕು (neeru beku, I need water).',
    },
    iWantWater: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ನೀರು", "neeru"],
        ["ಬೇಕು", "beku"],
      ],
      notes:
        'Literally "to me water is needed". ಬೇಕು (beku) = wanted/needed; its opposite ಬೇಡ (beda) = not wanted: ನನಗೆ ನೀರು ಬೇಡ.',
    },
    iWantTea: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಟೀ", "tee"],
        ["ಬೇಕು", "beku"],
      ],
      notes: "Ordering, you can drop ನನಗೆ: ಒಂದು ಟೀ ಬೇಕು (ondu tee beku).",
    },
    iWantFood: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಊಟ", "oota"],
        ["ಬೇಕು", "beku"],
      ],
      notes: "For a snack or breakfast: ನನಗೆ ತಿಂಡಿ ಬೇಕು (nanage tindi beku).",
    },
    iDontEatMeat: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಮಾಂಸ", "maamsa"],
        ["ತಿನ್ನುವುದಿಲ್ಲ", "tinnuvudilla"],
      ],
      notes:
        'Spoken: ನಾನು ನಾನ್‌ವೆಜ್ ತಿನ್ನಲ್ಲ (naanu naanvej tinnalla). Or simply ನಾನು ಸಸ್ಯಾಹಾರಿ (naanu sasyaahaari, I am vegetarian). Restaurants label food "veg" and "non-veg".',
    },
    // Food & drinks › Ordering food (lesson "ordering-food")
    breakfast: {
      script: "ತಿಂಡಿ",
      roman: "tindi",
      notes:
        'ತಿಂಡಿ means breakfast and also any snack/tiffin; "morning breakfast" is ಬೆಳಗಿನ ತಿಂಡಿ (belagina tindi). Typical: ಇಡ್ಲಿ, ದೋಸೆ, ಉಪ್ಪಿಟ್ಟು.',
    },
    lunch: {
      script: "ಮಧ್ಯಾಹ್ನದ ಊಟ",
      roman: "madhyaahnada oota",
      notes: 'Literally "afternoon meal"; in context people just say ಊಟ (oota).',
    },
    dinner: { script: "ರಾತ್ರಿ ಊಟ", roman: "raatri oota", notes: 'Literally "night meal".' },
    giveMeOneTea: {
      words: [
        ["ಒಂದು", "ondu"],
        ["ಟೀ", "tee"],
        ["ಕೊಡಿ", "kodi"],
      ],
      notes:
        'The polite ending of ಕೊಡಿ (kodi) already makes it "please"; add ದಯವಿಟ್ಟು for extra politeness. To a friend: ಒಂದು ಟೀ ಕೊಡು (kodu).',
    },
    whatWouldYouLike: {
      words: [
        ["ನಿಮಗೆ", "nimage"],
        ["ಏನು", "enu"],
        ["ಬೇಕು?", "beku?"],
      ],
      notes:
        'Literally "to you what is needed?". Waiters often say ಏನ್ ಕೊಡ್ಲಿ? (en kodli?, what shall I give?).',
    },
    billPlease: {
      words: [
        ["ಬಿಲ್", "bil"],
        ["ಕೊಡಿ", "kodi"],
      ],
      notes: 'Literally "give the bill". In a darshini you usually pay first at the counter.',
    },
    withoutSugar: {
      words: [
        ["ಸಕ್ಕರೆ", "sakkare"],
        ["ಹಾಕಬೇಡಿ", "haakabedi"],
      ],
      notes:
        'Literally "don\'t put sugar" — the natural way to ask. Less sugar: ಸಕ್ಕರೆ ಕಡಿಮೆ ಹಾಕಿ (sakkare kadime haaki). Also heard: ಶುಗರ್‌ಲೆಸ್ (shugarles).',
    },
    isItSpicy: {
      words: [
        ["ಇದು", "idu"],
        ["ಖಾರ", "khaara"],
        ["ಇದೆಯಾ?", "ideyaa?"],
      ],
      notes:
        'Literally "is there spice in this?". Formal written form: ಖಾರ ಇದೆಯೇ? (khaara ideye?). Answer: ಸ್ವಲ್ಪ ಖಾರ ಇದೆ (a little spicy).',
    },
    itIsVeryTasty: {
      words: [
        ["ತುಂಬಾ", "tumbaa"],
        ["ರುಚಿಯಾಗಿದೆ", "ruchiyaagide"],
      ],
      notes: "Also very common: ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ (tumbaa chennaagide).",
    },
    giveMeWater: {
      words: [
        ["ಸ್ವಲ್ಪ", "svalpa"],
        ["ನೀರು", "neeru"],
        ["ಕೊಡಿ", "kodi"],
      ],
      notes: "ಸ್ವಲ್ಪ (svalpa, a little) softens any request.",
    },
    oneMorePlease: {
      words: [
        ["ಇನ್ನೊಂದು", "innondu"],
        ["ಕೊಡಿ", "kodi"],
      ],
      notes:
        "ಇನ್ನೊಂದು = one more; ಇನ್ನು ಸ್ವಲ್ಪ (innu svalpa) = a little more. When you've had enough: ಸಾಕು (saaku).",
    },
    // Numbers, time & dates › Numbers 1–10 (lesson "numbers-1-10")
    one: {
      script: "ಒಂದು",
      roman: "ondu",
      notes: 'Also works like "a/an": ಒಂದು ಟೀ (a tea). Kannada digit: ೧.',
    },
    two: { script: "ಎರಡು", roman: "eradu", notes: "Kannada digit: ೨." },
    three: { script: "ಮೂರು", roman: "mooru", notes: "Kannada digit: ೩." },
    four: { script: "ನಾಲ್ಕು", roman: "naalku", notes: "Kannada digit: ೪." },
    five: { script: "ಐದು", roman: "aidu", notes: "Kannada digit: ೫." },
    six: {
      script: "ಆರು",
      roman: "aaru",
      notes: "Kannada digit: ೬. Careful: ಆರು (six) vs ಯಾರು (yaaru, who).",
    },
    seven: {
      script: "ಏಳು",
      roman: "elu",
      notes: 'Kannada digit: ೭. The same word ಏಳು also means "get up!".',
    },
    eight: { script: "ಎಂಟು", roman: "entu", notes: "Kannada digit: ೮." },
    nine: { script: "ಒಂಬತ್ತು", roman: "ombattu", notes: "Kannada digit: ೯." },
    ten: {
      script: "ಹತ್ತು",
      roman: "hattu",
      notes: 'Kannada digit: ೧೦. ಹತ್ತು also means "to climb/board" (ಬಸ್ ಹತ್ತು, get on the bus).',
    },
    // Numbers, time & dates › Numbers 11–20 (lesson "numbers-11-20")
    eleven: { script: "ಹನ್ನೊಂದು", roman: "hannondu", notes: "ಹನ್- (ten) + ಒಂದು (one)." },
    twelve: { script: "ಹನ್ನೆರಡು", roman: "hanneradu" },
    thirteen: {
      script: "ಹದಿಮೂರು",
      roman: "hadimooru",
      notes: 'From 13 to 18 the "ten" part is ಹದಿ- (hadi-).',
    },
    fourteen: { script: "ಹದಿನಾಲ್ಕು", roman: "hadinaalku" },
    fifteen: { script: "ಹದಿನೈದು", roman: "hadinaidu" },
    sixteen: { script: "ಹದಿನಾರು", roman: "hadinaaru" },
    seventeen: { script: "ಹದಿನೇಳು", roman: "hadinelu" },
    eighteen: { script: "ಹದಿನೆಂಟು", roman: "hadinentu" },
    nineteen: { script: "ಹತ್ತೊಂಬತ್ತು", roman: "hattombattu", notes: "Literally ten + nine." },
    twenty: {
      script: "ಇಪ್ಪತ್ತು",
      roman: "ippattu",
      notes: "21 = ಇಪ್ಪತ್ತೊಂದು (ippattondu), 22 = ಇಪ್ಪತ್ತೆರಡು (ippatteradu).",
    },
    // Numbers, time & dates › Tens & big numbers (lesson "big-numbers")
    thirty: { script: "ಮೂವತ್ತು", roman: "moovattu" },
    forty: { script: "ನಲವತ್ತು", roman: "nalavattu" },
    fifty: {
      script: "ಐವತ್ತು",
      roman: "aivattu",
      notes:
        "60 ಅರವತ್ತು (aravattu), 70 ಎಪ್ಪತ್ತು (eppattu), 80 ಎಂಬತ್ತು (embattu), 90 ತೊಂಬತ್ತು (tombattu).",
    },
    hundred: {
      script: "ನೂರು",
      roman: "nooru",
      notes:
        "200 = ಇನ್ನೂರು (innooru), 500 = ಐನೂರು (ainooru). Prices are often said in English numbers too.",
    },
    thousand: {
      script: "ಸಾವಿರ",
      roman: "saavira",
      notes: "1,00,000 = ಒಂದು ಲಕ್ಷ (ondu laksha); 1,00,00,000 = ಒಂದು ಕೋಟಿ (ondu koti).",
    },
    howMany: {
      words: [
        ["ಎಷ್ಟು", "eshtu"],
        ["ಇವೆ?", "ive?"],
      ],
      notes:
        'Literally "how many are there?" (for things). For people: ಎಷ್ಟು ಜನ ಇದ್ದಾರೆ? (eshtu jana iddaare?).',
    },
    // Numbers, time & dates › Age & phone numbers (lesson "age-phone")
    age: { script: "ವಯಸ್ಸು", roman: "vayassu" },
    year: {
      script: "ವರ್ಷ",
      roman: "varsha",
      notes: '"Next year" = ಮುಂದಿನ ವರ್ಷ (mundina varsha); "last year" = ಹೋದ ವರ್ಷ (hoda varsha).',
    },
    howOldAreYou: {
      words: [
        ["ನಿಮ್ಮ", "nimma"],
        ["ವಯಸ್ಸು", "vayassu"],
        ["ಎಷ್ಟು?", "eshtu?"],
      ],
      notes: "Also: ನಿಮಗೆ ಎಷ್ಟು ವಯಸ್ಸು? (nimage eshtu vayassu?). To a child: ನಿನ್ನ ವಯಸ್ಸು ಎಷ್ಟು?",
    },
    iAmTwentyYearsOld: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಇಪ್ಪತ್ತು", "ippattu"],
        ["ವರ್ಷ", "varsha"],
      ],
      blank: 1,
      notes: 'Literally "to me twenty years".',
    },
    phoneNumber: {
      script: "ಫೋನ್ ನಂಬರ್",
      roman: "fon nambar",
      notes: "Numbers are usually read out digit by digit, often in English.",
    },
    whatIsYourPhoneNumber: {
      words: [
        ["ನಿಮ್ಮ", "nimma"],
        ["ಫೋನ್", "fon"],
        ["ನಂಬರ್", "nambar"],
        ["ಏನು?", "enu?"],
      ],
      notes: "Casual: ನಿನ್ನ ನಂಬರ್ ಏನು? (ninna nambar enu?).",
    },
    // Numbers, time & dates › Time of day (lesson "time")
    time: {
      script: "ಸಮಯ",
      roman: "samaya",
      notes: "In speech ಟೈಮ್ (taim) is very common; clock time uses ಗಂಟೆ (gante, hour/o'clock).",
    },
    now: { script: "ಈಗ", roman: "eega", notes: '"Right now" = ಈಗಲೇ (eegale).' },
    today: {
      script: "ಇವತ್ತು",
      roman: "ivattu",
      notes: "ಇವತ್ತು is everyday speech; ಇಂದು (indu) is the written/formal word.",
    },
    tomorrow: { script: "ನಾಳೆ", roman: "naale", notes: "Day after tomorrow: ನಾಡಿದ್ದು (naadiddu)." },
    yesterday: {
      script: "ನಿನ್ನೆ",
      roman: "ninne",
      notes: 'Day before yesterday: ಮೊನ್ನೆ (monne) — also used loosely for "the other day".',
    },
    morning: {
      script: "ಬೆಳಿಗ್ಗೆ",
      roman: "beligge",
      notes: 'Also spelled ಬೆಳಗ್ಗೆ (belagge). It also means "in the morning".',
    },
    afternoon: { script: "ಮಧ್ಯಾಹ್ನ", roman: "madhyaahna" },
    evening: { script: "ಸಂಜೆ", roman: "sanje" },
    night: { script: "ರಾತ್ರಿ", roman: "raatri" },
    whatTimeIsIt: {
      words: [
        ["ಎಷ್ಟು", "eshtu"],
        ["ಗಂಟೆ", "gante"],
        ["ಆಯಿತು?", "aayitu?"],
      ],
      notes:
        'Literally "how many hours has it become?". Spoken: ಟೈಮ್ ಎಷ್ಟು ಆಯ್ತು? (taim eshtu aaytu?).',
    },
    itIsFiveOClock: {
      words: [
        ["ಐದು", "aidu"],
        ["ಗಂಟೆ", "gante"],
        ["ಆಯಿತು", "aayitu"],
      ],
      notes:
        'Half past five = ಐದೂವರೆ (aidoovare); quarter past = ಐದೂಕಾಲು (aidookaalu); quarter to six = ಐದೂಮುಕ್ಕಾಲು (aidoomukkaalu, "five and three-quarters").',
    },
    // Numbers, time & dates › Days of the week (lesson "days")
    monday: {
      script: "ಸೋಮವಾರ",
      roman: "somavaara",
      notes: "ವಾರ (vaara) means week/weekday. English day names are also widely used.",
    },
    tuesday: { script: "ಮಂಗಳವಾರ", roman: "mangalavaara" },
    wednesday: { script: "ಬುಧವಾರ", roman: "budhavaara" },
    thursday: { script: "ಗುರುವಾರ", roman: "guruvaara" },
    friday: { script: "ಶುಕ್ರವಾರ", roman: "shukravaara" },
    saturday: { script: "ಶನಿವಾರ", roman: "shanivaara" },
    sunday: {
      script: "ಭಾನುವಾರ",
      roman: "bhaanuvaara",
      notes: "Also ಆದಿತ್ಯವಾರ (aadityavaara), common in coastal Karnataka.",
    },
    day: { script: "ದಿನ", roman: "dina" },
    week: { script: "ವಾರ", roman: "vaara", notes: '"Next week" = ಮುಂದಿನ ವಾರ (mundina vaara).' },
    month: {
      script: "ತಿಂಗಳು",
      roman: "tingalu",
      notes: 'ತಿಂಗಳು also means "moon" in old Kannada.',
    },
    whatDayIsToday: {
      words: [
        ["ಇವತ್ತು", "ivattu"],
        ["ಯಾವ", "yaava"],
        ["ವಾರ?", "vaara?"],
      ],
      notes: 'Literally "today which weekday?". ಯಾವ (yaava) = which (before a noun).',
    },
    todayIsMonday: {
      words: [
        ["ಇವತ್ತು", "ivattu"],
        ["ಸೋಮವಾರ", "somavaara"],
      ],
      blank: 1,
      notes: 'No verb needed: "today Monday".',
    },
    // Daily life › Morning & evening (lesson "routine-verbs")
    wakeUp: {
      script: "ಎದ್ದೇಳು",
      roman: "eddelu",
      notes:
        '"Get up". The short form ಏಳು (elu) means the same (and is also the number seven); "I get up" = ಏಳುತ್ತೇನೆ (eluttene).',
    },
    sleep: {
      script: "ಮಲಗು",
      roman: "malagu",
      notes:
        'ಮಲಗು is "to lie down / go to sleep"; ನಿದ್ದೆ ಮಾಡು (nidde maadu) is "to sleep" (ನಿದ್ದೆ = sleep).',
    },
    bathe: { script: "ಸ್ನಾನ ಮಾಡು", roman: "snaana maadu", notes: 'Literally "do a bath".' },
    cook: {
      script: "ಅಡುಗೆ ಮಾಡು",
      roman: "aduge maadu",
      notes: "ಅಡುಗೆ (aduge) = cooking / cooked food; the kitchen is ಅಡುಗೆ ಮನೆ (aduge mane).",
    },
    wash: {
      script: "ತೊಳೆ",
      roman: "tole",
      notes: "Wash clothes = ಬಟ್ಟೆ ಒಗೆ (batte oge); wash hands = ಕೈ ತೊಳೆ (kai tole).",
    },
    wear: {
      script: "ಹಾಕಿಕೊಳ್ಳು",
      roman: "haakikollu",
      notes:
        'Literally "put on (oneself)". A saree is ಉಡು (udu): ಸೀರೆ ಉಡು. Formal: ಧರಿಸು (dharisu).',
    },
    // Daily life › Study, work & play (lesson "activity-verbs")
    study: {
      script: "ಅಭ್ಯಾಸ ಮಾಡು",
      roman: "abhyaasa maadu",
      notes:
        'Literally "do practice/study". In everyday speech students simply say ಓದು (odu, read) for studying: ನಾನು ಓದುತ್ತಿದ್ದೇನೆ = I am studying.',
    },
    work: { script: "ಕೆಲಸ ಮಾಡು", roman: "kelasa maadu", notes: "ಕೆಲಸ (kelasa) = work / job." },
    read: {
      script: "ಓದು",
      roman: "odu",
      notes:
        'Also means "to study". Note ಓದು (odu, read, dental ದ) vs ಓಡು (odu, run, retroflex ಡ).',
    },
    write: {
      script: "ಬರೆ",
      roman: "bare",
      notes: "Polite command: ಬರೆಯಿರಿ (bareyiri, please write).",
    },
    play: { script: "ಆಡು", roman: "aadu", notes: "ಆಟ (aata) = game; ಆಟ ಆಡು = to play a game." },
    listen: {
      script: "ಕೇಳು",
      roman: "kelu",
      notes:
        'ಕೇಳು means both "listen" and "ask". Polite: ಕೇಳಿ (keli). "Can you hear?" uses ಕೇಳಿಸು (kelisu, to be audible).',
    },
    speak: {
      script: "ಮಾತನಾಡು",
      roman: "maatanaadu",
      notes: "Usually pronounced ಮಾತಾಡು (maataadu). ಮಾತು (maatu) = word/talk.",
    },
    // Daily life › Sit, stand & wait (lesson "movement-verbs")
    sit: {
      script: "ಕುಳಿತುಕೊಳ್ಳು",
      roman: "kulitukollu",
      notes: "In speech: ಕೂತ್ಕೊ (kootko) / ಕೂರು (kooru). Polite: ಕುಳಿತುಕೊಳ್ಳಿ (kulitukolli).",
    },
    stand: {
      script: "ನಿಲ್ಲು",
      roman: "nillu",
      notes:
        '"Stop (the vehicle) here" uses the related ನಿಲ್ಲಿಸು (nillisu, to stop something): ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ.',
    },
    walk: { script: "ನಡೆ", roman: "nade", notes: '"On foot" = ನಡೆದುಕೊಂಡು (nadedukondu).' },
    run: {
      script: "ಓಡು",
      roman: "odu",
      notes:
        'Retroflex ಡ: ಓಡು (run) is different from ಓದು (read), though both are romanized "odu".',
    },
    wait: {
      script: "ಕಾಯಿ",
      roman: "kaayi",
      notes:
        'ಕಾಯಿ is the casual command "wait!" (dictionary form ಕಾಯು, kaayu). Polite: ಕಾಯಿರಿ (kaayiri, please wait); "I will wait" = ಕಾಯುತ್ತೇನೆ (kaayuttene). In daily speech ಸ್ವಲ್ಪ ಇರಿ (svalpa iri, hold on) is even more common. ಕಾಯಿ also means an unripe fruit or vegetable!',
    },
    open: {
      script: "ತೆಗೆ",
      roman: "tege",
      notes:
        "ತೆಗೆ = open / remove: ಬಾಗಿಲು ತೆಗೆ (baagilu tege, open the door). Formal: ತೆರೆ (tere).",
    },
    close: {
      script: "ಮುಚ್ಚು",
      roman: "mucchu",
      notes:
        "ಬಾಗಿಲು ಮುಚ್ಚಿ (baagilu mucchi, please close the door). Shops say ಮುಚ್ಚಿದೆ (mucchide, closed).",
    },
    // Daily life › What are you doing? (lesson "what-are-you-doing")
    whatAreYouDoing: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಏನು", "enu"],
        ["ಮಾಡುತ್ತಿದ್ದೀರಿ?", "maaduttiddeeri?"],
      ],
      notes:
        "Spoken: ಏನ್ ಮಾಡ್ತಿದ್ದೀರಾ? (en maadtiddeeraa?). To a friend: ಏನು ಮಾಡುತ್ತಿದ್ದೀಯ? / ಏನ್ ಮಾಡ್ತಿದ್ದೀಯಾ? (en maadtiddeeyaa?).",
    },
    iAmStudying: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಓದುತ್ತಿದ್ದೇನೆ", "oduttiddene"],
      ],
      notes:
        'Literally "I am reading" — the normal way to say "I am studying". Spoken: ಓದ್ತಿದ್ದೀನಿ (odtiddeeni).',
    },
    iAmEating: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಊಟ", "oota"],
        ["ಮಾಡುತ್ತಿದ್ದೇನೆ", "maaduttiddene"],
      ],
      notes:
        'Literally "I am doing the meal". For a snack: ತಿಂಡಿ ತಿನ್ನುತ್ತಿದ್ದೇನೆ (tindi tinnuttiddene). Spoken: ಊಟ ಮಾಡ್ತಿದ್ದೀನಿ (oota maadtiddeeni).',
    },
    iAmDrinkingWater: {
      words: [
        ["ನಾನು", "naanu"],
        ["ನೀರು", "neeru"],
        ["ಕುಡಿಯುತ್ತಿದ್ದೇನೆ", "kudiyuttiddene"],
      ],
      blank: 1,
    },
    iAmSleeping: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಮಲಗಿದ್ದೇನೆ", "malagiddene"],
      ],
      notes:
        'Literally "I am lying down" — the natural way to say you are in bed/asleep. Spoken: ಮಲಗಿದ್ದೀನಿ (malagiddeeni).',
    },
    iAmWorking: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಕೆಲಸ", "kelasa"],
        ["ಮಾಡುತ್ತಿದ್ದೇನೆ", "maaduttiddene"],
      ],
      blank: 1,
    },
    iAmComing: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಬರುತ್ತಿದ್ದೇನೆ", "baruttiddene"],
      ],
      notes:
        'Spoken: ಬರ್ತಿದ್ದೀನಿ (bartiddeeni). When someone calls you, Kannada speakers shout ಬಂದೆ! (bande!, literally "I came!") to mean "coming!".',
    },
    iAmGoing: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಹೋಗುತ್ತಿದ್ದೇನೆ", "hoguttiddene"],
      ],
      notes: "Spoken: ಹೋಗ್ತಿದ್ದೀನಿ (hogtiddeeni).",
    },
    // Daily life › My day (lesson "my-day")
    everyDay: {
      script: "ಪ್ರತಿದಿನ",
      roman: "pratidina",
      notes: "In speech: ದಿನಾ (dinaa) or ದಿನಾಲೂ (dinaaloo).",
    },
    iAmGoingHome: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಮನೆಗೆ", "manege"],
        ["ಹೋಗುತ್ತಿದ್ದೇನೆ", "hoguttiddene"],
      ],
      blank: 1,
      notes: "ಮನೆ + -ಗೆ (to) = ಮನೆಗೆ, to home.",
    },
    iAmGoingToCollege: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಕಾಲೇಜಿಗೆ", "kaalejige"],
        ["ಹೋಗುತ್ತಿದ್ದೇನೆ", "hoguttiddene"],
      ],
      blank: 1,
      notes: "ಕಾಲೇಜು + -ಇಗೆ = ಕಾಲೇಜಿಗೆ (to college).",
    },
    iWakeUpAtSix: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಆರು", "aaru"],
        ["ಗಂಟೆಗೆ", "gantege"],
        ["ಏಳುತ್ತೇನೆ", "eluttene"],
      ],
      blank: 3,
      notes: "ಗಂಟೆಗೆ (gantege) = at … o'clock. Spoken: ಆರು ಗಂಟೆಗೆ ಏಳ್ತೀನಿ (elteeni).",
    },
    iGoToCollegeEveryDay: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಪ್ರತಿದಿನ", "pratidina"],
        ["ಕಾಲೇಜಿಗೆ", "kaalejige"],
        ["ಹೋಗುತ್ತೇನೆ", "hoguttene"],
      ],
      blank: 1,
      notes: "Spoken: ದಿನಾ ಕಾಲೇಜಿಗೆ ಹೋಗ್ತೀನಿ (dinaa kaalejige hogteeni).",
    },
    iEatLunchAtOne: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಮಧ್ಯಾಹ್ನ", "madhyaahna"],
        ["ಒಂದು", "ondu"],
        ["ಗಂಟೆಗೆ", "gantege"],
        ["ಊಟ", "oota"],
        ["ಮಾಡುತ್ತೇನೆ", "maaduttene"],
      ],
      blank: 4,
      notes:
        'Literally "I at one o\'clock in the afternoon do the meal" — ಮಧ್ಯಾಹ್ನ makes clear it is lunch.',
    },
    iSleepAtTen: {
      words: [
        ["ನಾನು", "naanu"],
        ["ರಾತ್ರಿ", "raatri"],
        ["ಹತ್ತು", "hattu"],
        ["ಗಂಟೆಗೆ", "gantege"],
        ["ಮಲಗುತ್ತೇನೆ", "malaguttene"],
      ],
      blank: 4,
      notes: "Spoken: ರಾತ್ರಿ ಹತ್ತು ಗಂಟೆಗೆ ಮಲಗ್ತೀನಿ (malagteeni).",
    },
    // Places & directions › Places in town (lesson "places-1")
    school: { script: "ಶಾಲೆ", roman: "shaale", notes: "ಸ್ಕೂಲ್ (skool) is also very common." },
    college: { script: "ಕಾಲೇಜು", roman: "kaaleju", notes: "Also written ಕಾಲೇಜ್ (kaalej)." },
    office: {
      script: "ಆಫೀಸ್",
      roman: "aafees",
      notes:
        "The native word ಕಚೇರಿ (kacheri) is used for government offices: ಅಂಚೆ ಕಚೇರಿ (post office).",
    },
    shop: { script: "ಅಂಗಡಿ", roman: "angadi", notes: "A shopkeeper is ಅಂಗಡಿಯವರು (angadiyavaru)." },
    market: {
      script: "ಮಾರುಕಟ್ಟೆ",
      roman: "maarukatte",
      notes:
        "Also ಮಾರ್ಕೆಟ್ (maarket). A weekly village market is ಸಂತೆ (sante). Bengaluru's famous one is ಕೆ.ಆರ್. ಮಾರ್ಕೆಟ್ (KR Market).",
    },
    restaurant: {
      script: "ಹೋಟೆಲ್",
      roman: "hotel",
      notes:
        "In Karnataka ಹೋಟೆಲ್ usually means a place to eat, not to stay. A quick self-service eatery is a ದರ್ಶಿನಿ (darshini).",
    },
    // Places & directions › More places (lesson "places-2")
    hospital: { script: "ಆಸ್ಪತ್ರೆ", roman: "aaspatre" },
    station: {
      script: "ರೈಲು ನಿಲ್ದಾಣ",
      roman: "railu nildaana",
      notes:
        'Literally "train stop". In conversation most people say ರೈಲ್ವೆ ಸ್ಟೇಷನ್ (railve steshan) or just ಸ್ಟೇಷನ್.',
    },
    bank: { script: "ಬ್ಯಾಂಕ್", roman: "byaank" },
    temple: {
      script: "ದೇವಸ್ಥಾನ",
      roman: "devasthaana",
      notes: "A small temple is a ಗುಡಿ (gudi). ದೇವರು (devaru) = God.",
    },
    bathroom: {
      script: "ಬಾತ್ರೂಮ್",
      roman: "baatroom",
      notes:
        "People say ಬಾತ್ರೂಮ್ or ಟಾಯ್ಲೆಟ್ (taaylet). Public signs say ಶೌಚಾಲಯ (shauchaalaya, toilet).",
    },
    road: {
      script: "ರಸ್ತೆ",
      roman: "raste",
      notes:
        'ದಾರಿ (daari) is "way/route"; in Bengaluru addresses you\'ll see ಮುಖ್ಯ ರಸ್ತೆ (mukhya raste, main road) and ಅಡ್ಡ ರಸ್ತೆ (adda raste, cross road).',
    },
    // Places & directions › Near, far, left & right (lesson "position-words")
    near: {
      script: "ಹತ್ತಿರ",
      roman: "hattira",
      notes:
        '"Near the market" = ಮಾರುಕಟ್ಟೆ ಹತ್ತಿರ. ನನ್ನ ಹತ್ತಿರ (nanna hattira, near me) also means "I have (with me)".',
    },
    far: { script: "ದೂರ", roman: "doora" },
    left: {
      script: "ಎಡ",
      roman: "eda",
      notes: '"To the left" = ಎಡಕ್ಕೆ (edakke); "on the left side" = ಎಡಗಡೆ (edagade).',
    },
    right: {
      script: "ಬಲ",
      roman: "bala",
      notes:
        '"To the right" = ಬಲಕ್ಕೆ (balakke); "on the right side" = ಬಲಗಡೆ (balagade). ಬಲ also means strength.',
    },
    straight: {
      script: "ನೇರ",
      roman: "nera",
      notes: '"Straight ahead" = ನೇರವಾಗಿ (neravaagi); in speech also ಸೀದಾ (seedaa).',
    },
    inFront: {
      script: "ಮುಂದೆ",
      roman: "munde",
      notes:
        '"In front of the house" = ಮನೆಯ ಮುಂದೆ (maneya munde). Directly opposite = ಎದುರು (eduru).',
    },
    behind: {
      script: "ಹಿಂದೆ",
      roman: "hinde",
      notes:
        '"Behind the office" = ಆಫೀಸಿನ ಹಿಂದೆ (aafeesina hinde). ಹಿಂದೆ also means "before, in the past".',
    },
    inside: { script: "ಒಳಗೆ", roman: "olage", notes: "Come inside = ಒಳಗೆ ಬನ್ನಿ (olage banni)." },
    outside: { script: "ಹೊರಗೆ", roman: "horage" },
    // Places & directions › Asking for directions (lesson "asking-directions")
    where: {
      script: "ಎಲ್ಲಿ",
      roman: "elli",
      notes:
        '"Where is it?" = ಎಲ್ಲಿದೆ? (ellide?) from ಎಲ್ಲಿ + ಇದೆ; "where to?" = ಎಲ್ಲಿಗೆ? (ellige?).',
    },
    whereIsTheBathroom: {
      words: [
        ["ಬಾತ್ರೂಮ್", "baatroom"],
        ["ಎಲ್ಲಿದೆ?", "ellide?"],
      ],
      notes: "Also: ಟಾಯ್ಲೆಟ್ ಎಲ್ಲಿದೆ? (taaylet ellide?). Put the place first and add ಎಲ್ಲಿದೆ?",
    },
    whereIsTheStation: {
      words: [
        ["ರೈಲು", "railu"],
        ["ನಿಲ್ದಾಣ", "nildaana"],
        ["ಎಲ್ಲಿದೆ?", "ellide?"],
      ],
      notes:
        "Spoken: ರೈಲ್ವೆ ಸ್ಟೇಷನ್ ಎಲ್ಲಿದೆ? (railve steshan ellide?). Start with ಸ್ವಲ್ಪ ನೋಡಿ or ಕ್ಷಮಿಸಿ to be polite.",
    },
    goStraight: {
      words: [
        ["ನೇರವಾಗಿ", "neravaagi"],
        ["ಹೋಗಿ", "hogi"],
      ],
      notes: "Casual: ನೇರವಾಗಿ ಹೋಗು (hogu). In speech: ಸೀದಾ ಹೋಗಿ (seedaa hogi).",
    },
    turnLeft: {
      words: [
        ["ಎಡಕ್ಕೆ", "edakke"],
        ["ತಿರುಗಿ", "tirugi"],
      ],
      notes: "ಎಡ + -ಕ್ಕೆ (to) = to the left. Casual: ಎಡಕ್ಕೆ ತಿರುಗು.",
    },
    turnRight: {
      words: [
        ["ಬಲಕ್ಕೆ", "balakke"],
        ["ತಿರುಗಿ", "tirugi"],
      ],
      notes: "Casual: ಬಲಕ್ಕೆ ತಿರುಗು (tirugu).",
    },
    itIsNear: {
      words: [
        ["ಹತ್ತಿರ", "hattira"],
        ["ಇದೆ", "ide"],
      ],
      notes: '"Very near" = ತುಂಬಾ ಹತ್ತಿರ ಇದೆ; "right nearby" = ಇಲ್ಲೇ ಹತ್ತಿರ (ille hattira).',
    },
    itIsFar: {
      words: [
        ["ದೂರ", "doora"],
        ["ಇದೆ", "ide"],
      ],
      notes: '"Not far" = ಜಾಸ್ತಿ ದೂರ ಇಲ್ಲ (jaasti doora illa).',
    },
    howFarIsIt: {
      words: [
        ["ಎಷ್ಟು", "eshtu"],
        ["ದೂರ", "doora"],
        ["ಇದೆ?", "ide?"],
      ],
    },
    // Places & directions › Where are you going? (lesson "where-are-you-going")
    whereAreYouGoing: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಎಲ್ಲಿಗೆ", "ellige"],
        ["ಹೋಗುತ್ತಿದ್ದೀರಿ?", "hoguttiddeeri?"],
      ],
      notes:
        "Neighbours ask this as a friendly greeting; spoken: ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀರಾ? or just ಎಲ್ಲಿಗೆ? To a friend: ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯಾ? (ellige hogtiddeeyaa?).",
    },
    iAmGoingToTheMarket: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಮಾರುಕಟ್ಟೆಗೆ", "maarukattege"],
        ["ಹೋಗುತ್ತಿದ್ದೇನೆ", "hoguttiddene"],
      ],
      blank: 1,
    },
    whereAreYou: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಎಲ್ಲಿದ್ದೀರಿ?", "elliddeeri?"],
      ],
      notes:
        "Casual: ನೀನು ಎಲ್ಲಿದ್ದೀಯ? (neenu elliddeeya?). On the phone: ಎಲ್ಲಿದ್ದೀಯಾ? (elliddeeyaa?).",
    },
    iAmAtHome: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಮನೆಯಲ್ಲಿ", "maneyalli"],
        ["ಇದ್ದೇನೆ", "iddene"],
      ],
      blank: 1,
      notes: "ಮನೆ + -ಅಲ್ಲಿ (in) = ಮನೆಯಲ್ಲಿ. Spoken: ಮನೆಯಲ್ಲಿ ಇದ್ದೀನಿ (iddeeni).",
    },
    comeHere: {
      words: [
        ["ಇಲ್ಲಿ", "illi"],
        ["ಬನ್ನಿ", "banni"],
      ],
      notes: "Polite. To a friend or child: ಇಲ್ಲಿ ಬಾ (illi baa).",
    },
    waitHere: {
      words: [
        ["ದಯವಿಟ್ಟು", "dayavittu"],
        ["ಇಲ್ಲೇ", "ille"],
        ["ಕಾಯಿರಿ", "kaayiri"],
      ],
      blank: 2,
      notes:
        "ಇಲ್ಲೇ (ille) = right here. Casual: ಇಲ್ಲೇ ಕಾಯಿ (ille kaayi) or ಇಲ್ಲೇ ಇರು (ille iru, stay right here).",
    },
    // Shopping & money › Money & prices (lesson "money-words")
    rupee: {
      script: "ರೂಪಾಯಿ",
      roman: "roopaayi",
      notes: "Prices: ಐವತ್ತು ರೂಪಾಯಿ (50 rupees). Plural is not needed after a number.",
    },
    price: {
      script: "ಬೆಲೆ",
      roman: "bele",
      notes: "ಬೆಲೆ (bele, price, short ಎ) vs ಬೇಳೆ (bele, lentils, long ಏ).",
    },
    buy: {
      script: "ಕೊಳ್ಳು",
      roman: "kollu",
      notes:
        'In speech "to buy" is usually ತೆಗೆದುಕೊಳ್ಳು (take): ಮಾರ್ಕೆಟ್‌ನಲ್ಲಿ ತರಕಾರಿ ತಗೊಂಡೆ (I bought vegetables). Formal: ಖರೀದಿಸು (khareedisu).',
    },
    sell: {
      script: "ಮಾರು",
      roman: "maaru",
      notes: "ಮಾರು + ಕಟ್ಟೆ (platform) = ಮಾರುಕಟ್ಟೆ (market).",
    },
    expensive: {
      script: "ದುಬಾರಿ",
      roman: "dubaari",
      notes: "Also ಜಾಸ್ತಿ ಬೆಲೆ (jaasti bele, high price).",
    },
    cheap: {
      script: "ಅಗ್ಗ",
      roman: "agga",
      notes: "Also ಕಡಿಮೆ ಬೆಲೆ (kadime bele, low price); people also say ಚೀಪ್ (cheep).",
    },
    howMuch: {
      script: "ಎಷ್ಟು",
      roman: "eshtu",
      notes: 'ಎಷ್ಟು covers "how much" and "how many": ಇದು ಎಷ್ಟು? (how much is this?).',
    },
    // Shopping & money › Colours (lesson "colours")
    colour: {
      script: "ಬಣ್ಣ",
      roman: "banna",
      notes: '"Which colour?" = ಯಾವ ಬಣ್ಣ? (yaava banna?).',
    },
    red: {
      script: "ಕೆಂಪು",
      roman: "kempu",
      notes: "The red-and-yellow Kannada flag is the ಕನ್ನಡ ಬಾವುಟ (kannada baavuta).",
    },
    blue: { script: "ನೀಲಿ", roman: "neeli" },
    green: { script: "ಹಸಿರು", roman: "hasiru" },
    yellow: { script: "ಹಳದಿ", roman: "haladi" },
    white: { script: "ಬಿಳಿ", roman: "bili" },
    black: { script: "ಕಪ್ಪು", roman: "kappu" },
    // Shopping & money › Clothes (lesson "clothes")
    clothes: { script: "ಬಟ್ಟೆ", roman: "batte", notes: "ಬಟ್ಟೆ means both clothes and cloth." },
    shirt: { script: "ಅಂಗಿ", roman: "angi", notes: "ಶರ್ಟ್ (shart) is just as common in cities." },
    trousers: { script: "ಪ್ಯಾಂಟ್", roman: "pyaant" },
    saree: {
      script: "ಸೀರೆ",
      roman: "seere",
      notes:
        '"To wear a saree" = ಸೀರೆ ಉಡು (seere udu). Mysuru silk sarees (ಮೈಸೂರು ರೇಷ್ಮೆ ಸೀರೆ) are famous.',
    },
    shoes: {
      script: "ಬೂಟು",
      roman: "bootu",
      notes: "ಶೂ (shoo) is also common. Remove footwear before entering homes and temples.",
    },
    slippers: { script: "ಚಪ್ಪಲಿ", roman: "chappali" },
    // Shopping & money › At the shop (lesson "at-the-shop")
    howMuchIsThis: {
      words: [
        ["ಇದರ", "idara"],
        ["ಬೆಲೆ", "bele"],
        ["ಎಷ್ಟು?", "eshtu?"],
      ],
      notes:
        'Literally "its price how much?". Shorter: ಇದು ಎಷ್ಟು? (idu eshtu?). For the total: ಎಷ್ಟು ಆಯಿತು? (eshtu aayitu?, how much has it come to?).',
    },
    thisIsTooExpensive: {
      words: [
        ["ಇದು", "idu"],
        ["ತುಂಬಾ", "tumbaa"],
        ["ದುಬಾರಿ", "dubaari"],
      ],
      blank: 2,
      notes: "Spoken bargaining: ತುಂಬಾ ಜಾಸ್ತಿ ಆಯ್ತು (tumbaa jaasti aaytu, that's too much).",
    },
    reduceThePrice: {
      words: [
        ["ಸ್ವಲ್ಪ", "svalpa"],
        ["ಕಡಿಮೆ", "kadime"],
        ["ಮಾಡಿ", "maadi"],
      ],
      notes:
        'Literally "make it a little less" — the standard bargaining phrase. Add ಅಣ್ಣ (anna) or ಅಕ್ಕ (akka) to sound friendly: ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಅಣ್ಣ.',
    },
    doYouHaveMangoes: {
      words: [
        ["ಮಾವಿನಹಣ್ಣು", "maavinahannu"],
        ["ಇದೆಯಾ?", "ideyaa?"],
      ],
      notes:
        'Literally "is there mango?". Written form: ಮಾವಿನಹಣ್ಣು ಇದೆಯೇ? Answer: ಇದೆ (ide, there is) / ಇಲ್ಲ (illa, there isn\'t).',
    },
    iNeedABag: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಒಂದು", "ondu"],
        ["ಚೀಲ", "cheela"],
        ["ಬೇಕು", "beku"],
      ],
      blank: 2,
      notes: "In shops a plastic carry bag is a ಕವರ್ (kavar): ಒಂದು ಕವರ್ ಕೊಡಿ.",
    },
    giveMeThisOne: {
      words: [
        ["ಇದನ್ನು", "idannu"],
        ["ಕೊಡಿ", "kodi"],
      ],
      notes:
        'ಇದನ್ನು = this (as object). "This very one" = ಇದನ್ನೇ ಕೊಡಿ (idanne kodi). Spoken: ಇದನ್ನ ಕೊಡಿ.',
    },
    iWillTakeIt: {
      words: [
        ["ಇದನ್ನು", "idannu"],
        ["ತೆಗೆದುಕೊಳ್ಳುತ್ತೇನೆ", "tegedukolluttene"],
      ],
      notes: "Spoken: ಇದನ್ನ ತಗೊಳ್ತೀನಿ (idanna tagolteeni).",
    },
    showMeThatOne: {
      words: [
        ["ಅದನ್ನು", "adannu"],
        ["ತೋರಿಸಿ", "torisi"],
      ],
      notes: "Casual: ಅದನ್ನು ತೋರಿಸು (torisu).",
    },
    doYouHaveARedOne: {
      words: [
        ["ಕೆಂಪು", "kempu"],
        ["ಬಣ್ಣದ್ದು", "bannaddu"],
        ["ಇದೆಯಾ?", "ideyaa?"],
      ],
      blank: 0,
      notes: 'ಬಣ್ಣದ್ದು (bannaddu) = "one of the colour": literally "is there a red-coloured one?".',
    },
    // Travel & transport › Getting around (lesson "vehicles")
    bus: {
      script: "ಬಸ್",
      roman: "bas",
      notes: "City buses in Bengaluru are BMTC; intercity buses are KSRTC.",
    },
    train: { script: "ರೈಲು", roman: "railu" },
    autoRickshaw: {
      script: "ಆಟೋ",
      roman: "aato",
      notes: "Ask the driver ಮೀಟರ್ ಹಾಕಿ (meetar haaki, please put the meter on).",
    },
    taxi: { script: "ಟ್ಯಾಕ್ಸಿ", roman: "tyaaksi", notes: "App taxis are called ಕ್ಯಾಬ್ (kyaab)." },
    car: { script: "ಕಾರು", roman: "kaaru" },
    bike: {
      script: "ಬೈಕ್",
      roman: "baik",
      notes: "Any two-wheeler or vehicle is casually a ಗಾಡಿ (gaadi).",
    },
    // Travel & transport › Tickets & stations (lesson "travel-words")
    ticket: {
      script: "ಟಿಕೆಟ್",
      roman: "tiket",
      notes: "The native word ಚೀಟಿ (cheeti, slip) is rarely used for tickets today.",
    },
    platform: { script: "ಪ್ಲಾಟ್ಫಾರ್ಮ್", roman: "plaatfaarm" },
    busStop: {
      script: "ಬಸ್ ನಿಲ್ದಾಣ",
      roman: "bas nildaana",
      notes: "In speech ಬಸ್ ಸ್ಟಾಪ್ (bas staap); a big bus station is ಬಸ್ ಸ್ಟ್ಯಾಂಡ್ (bas styaand).",
    },
    airport: {
      script: "ವಿಮಾನ ನಿಲ್ದಾಣ",
      roman: "vimaana nildaana",
      notes: 'Literally "aeroplane stop"; people usually say ಏರ್ಪೋರ್ಟ್ (erport).',
    },
    luggage: {
      script: "ಸಾಮಾನು",
      roman: "saamaanu",
      notes: "ಸಾಮಾನು means things / belongings / luggage; ಲಗೇಜ್ (lagej) is also used.",
    },
    journey: {
      script: "ಪ್ರಯಾಣ",
      roman: "prayaana",
      notes: '"Have a good journey" = ಶುಭ ಪ್ರಯಾಣ (shubha prayaana) or ಹುಷಾರಾಗಿ ಹೋಗಿ ಬನ್ನಿ.',
    },
    // Travel & transport › When & how long? (lesson "when-how-long")
    when: { script: "ಯಾವಾಗ", roman: "yaavaaga" },
    howLong: {
      script: "ಎಷ್ಟು ಹೊತ್ತು",
      roman: "eshtu hottu",
      notes: "ಹೊತ್ತು (hottu) = a stretch of time. For days: ಎಷ್ಟು ದಿನ (eshtu dina, how many days).",
    },
    late: {
      script: "ತಡ",
      roman: "tada",
      notes:
        '"Late" as an adverb: ತಡವಾಗಿ (tadavaagi). Everyday speech uses English: ಲೇಟ್ ಆಯ್ತು (let aaytu, I\'m late).',
    },
    early: {
      script: "ಬೇಗ",
      roman: "bega",
      notes: 'ಬೇಗ means both "early" and "soon/quickly": ಬೇಗ ಬನ್ನಿ (come soon).',
    },
    quickly: {
      script: "ಬೇಗ ಬೇಗ",
      roman: "bega bega",
      notes:
        "Doubling ಬೇಗ stresses the speed: ಬೇಗ ಬೇಗ ಬಾ (come quickly). ವೇಗವಾಗಿ (vegavaagi) = at high speed.",
    },
    slowly: {
      script: "ನಿಧಾನವಾಗಿ",
      roman: "nidhaanavaagi",
      notes: "Spoken: ನಿಧಾನಕ್ಕೆ (nidhaanakke) or ನಿಧಾನ.",
    },
    whenDoesTheBusCome: {
      words: [
        ["ಬಸ್", "bas"],
        ["ಯಾವಾಗ", "yaavaaga"],
        ["ಬರುತ್ತದೆ?", "baruttade?"],
      ],
      blank: 1,
      notes: "Spoken: ಬಸ್ ಯಾವಾಗ ಬರುತ್ತೆ? (bas yaavaaga barutte?).",
    },
    howLongDoesItTake: {
      words: [
        ["ಎಷ್ಟು", "eshtu"],
        ["ಹೊತ್ತು", "hottu"],
        ["ಆಗುತ್ತದೆ?", "aaguttade?"],
      ],
      notes: "Spoken: ಎಷ್ಟು ಹೊತ್ತು ಆಗುತ್ತೆ? (aagutte?) or ಎಷ್ಟು ಟೈಮ್ ಆಗುತ್ತೆ?",
    },
    theTrainIsLate: {
      words: [
        ["ರೈಲು", "railu"],
        ["ತಡವಾಗಿದೆ", "tadavaagide"],
      ],
      notes: "Spoken: ಟ್ರೈನ್ ಲೇಟ್ ಆಗಿದೆ (train let aagide).",
    },
    // Travel & transport › Travel phrases (lesson "travel-phrases")
    oneTicketPlease: {
      words: [
        ["ಮೈಸೂರಿಗೆ", "maisoorige"],
        ["ಒಂದು", "ondu"],
        ["ಟಿಕೆಟ್", "tiket"],
        ["ಕೊಡಿ", "kodi"],
      ],
      meaning: "One ticket to Mysuru, please.",
      blank: 0,
      notes:
        "Place + -ಗೆ (to): ಮೈಸೂರು → ಮೈಸೂರಿಗೆ, ಬೆಂಗಳೂರು → ಬೆಂಗಳೂರಿಗೆ, ಹುಬ್ಬಳ್ಳಿ → ಹುಬ್ಬಳ್ಳಿಗೆ. Two tickets: ಎರಡು ಟಿಕೆಟ್ ಕೊಡಿ.",
    },
    whichPlatform: {
      words: [
        ["ಯಾವ", "yaava"],
        ["ಪ್ಲಾಟ್ಫಾರ್ಮ್?", "plaatfaarm?"],
      ],
      notes:
        "Full question: ಮೈಸೂರು ರೈಲು ಯಾವ ಪ್ಲಾಟ್ಫಾರ್ಮ್‌ಗೆ ಬರುತ್ತದೆ? (which platform does the Mysuru train come to?).",
    },
    stopHerePlease: {
      words: [
        ["ಇಲ್ಲಿ", "illi"],
        ["ನಿಲ್ಲಿಸಿ", "nillisi"],
      ],
      notes: "To an auto driver you might hear ಇಲ್ಲೇ ನಿಲ್ಸಿ (ille nilsi, stop right here).",
    },
    goSlowlyPlease: {
      words: [
        ["ಸ್ವಲ್ಪ", "svalpa"],
        ["ನಿಧಾನವಾಗಿ", "nidhaanavaagi"],
        ["ಹೋಗಿ", "hogi"],
      ],
      notes: "Spoken: ಸ್ವಲ್ಪ ನಿಧಾನ ಹೋಗಿ (svalpa nidhaana hogi).",
    },
    howMuchToStation: {
      words: [
        ["ರೈಲು", "railu"],
        ["ನಿಲ್ದಾಣಕ್ಕೆ", "nildaanakke"],
        ["ಎಷ್ಟು?", "eshtu?"],
      ],
      notes:
        "With auto drivers people mostly say ಸ್ಟೇಷನ್‌ಗೆ ಎಷ್ಟು? (steshange eshtu?) or ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಎಷ್ಟು? in Bengaluru.",
    },
    iAmLost: {
      words: [
        ["ನಾನು", "naanu"],
        ["ದಾರಿ", "daari"],
        ["ತಪ್ಪಿದ್ದೇನೆ", "tappiddene"],
      ],
      notes:
        'Literally "I have missed the way". Also natural: ನನಗೆ ದಾರಿ ಗೊತ್ತಾಗುತ್ತಿಲ್ಲ (nanage daari gottaaguttilla, I can\'t find the way).',
    },
    doesThisBusGoToStation: {
      words: [
        ["ಈ", "ee"],
        ["ಬಸ್", "bas"],
        ["ರೈಲು", "railu"],
        ["ನಿಲ್ದಾಣಕ್ಕೆ", "nildaanakke"],
        ["ಹೋಗುತ್ತದೆಯಾ?", "hoguttadeyaa?"],
      ],
      blank: 3,
      notes:
        "Spoken: ಈ ಬಸ್ ಸ್ಟೇಷನ್‌ಗೆ ಹೋಗುತ್ತಾ? (ee bas steshange hoguttaa?). Formal written: ಹೋಗುತ್ತದೆಯೇ?",
    },
    // Everyday conversations › Meeting a friend (lesson "conv-friend")
    whatsNew: {
      words: [
        ["ಏನು", "enu"],
        ["ಸಮಾಚಾರ?", "samaachaara?"],
      ],
      notes:
        'Literally "what news?" — the classic friendly greeting. Spoken: ಏನ್ ಸಮಾಚಾರ? Bengaluru slang: ಏನ್ ಗುರು? (en guru?).',
    },
    longTimeNoSee: {
      words: [
        ["ನಿಮ್ಮನ್ನು", "nimmannu"],
        ["ನೋಡಿ", "nodi"],
        ["ತುಂಬಾ", "tumbaa"],
        ["ದಿನ", "dina"],
        ["ಆಯಿತು", "aayitu"],
      ],
      notes:
        'Literally "many days have passed since seeing you". To a friend: ನಿನ್ನನ್ನ ನೋಡಿ ತುಂಬಾ ದಿನ ಆಯ್ತು (ninnanna nodi tumbaa dina aaytu).',
    },
    haveYouEaten: {
      words: [
        ["ಊಟ", "oota"],
        ["ಆಯಿತಾ?", "aayitaa?"],
      ],
      notes:
        'Literally "has the meal happened?" — a very common caring greeting, not an invitation. Spoken: ಊಟ ಆಯ್ತಾ? (oota aaytaa?). In the morning: ತಿಂಡಿ ಆಯ್ತಾ? (tindi aaytaa?).',
    },
    yesIAte: {
      words: [
        ["ಹೌದು,", "haudu,"],
        ["ಊಟ", "oota"],
        ["ಆಯಿತು", "aayitu"],
      ],
      notes:
        "Spoken: ಹಾ, ಆಯ್ತು (haa, aaytu). Then return the question: ನಿಮ್ದು? (nimdu?, and yours?).",
    },
    // Everyday conversations › At college (lesson "conv-college")
    whereIsTheClass: {
      words: [
        ["ಕ್ಲಾಸ್", "klaas"],
        ["ಎಲ್ಲಿದೆ?", "ellide?"],
      ],
      notes: "Students say ಕ್ಲಾಸ್ (klaas); the formal word is ತರಗತಿ (taragati): ತರಗತಿ ಎಲ್ಲಿದೆ?",
    },
    whenIsTheExam: {
      words: [
        ["ಪರೀಕ್ಷೆ", "pareekshe"],
        ["ಯಾವಾಗ?", "yaavaaga?"],
      ],
      notes: "Students also say ಎಕ್ಸಾಮ್ ಯಾವಾಗ? (eksaam yaavaaga?).",
    },
    canIComeIn: {
      words: [
        ["ಒಳಗೆ", "olage"],
        ["ಬರಬಹುದಾ?", "barabahudaa?"],
      ],
      notes:
        'Literally "may (I) come inside?". Add ಸಾರ್ / ಮೇಡಂ for a teacher. Formal written: ಒಳಗೆ ಬರಬಹುದೇ?',
    },
    isThisSeatFree: {
      words: [
        ["ಈ", "ee"],
        ["ಸೀಟು", "seetu"],
        ["ಖಾಲಿ", "khaali"],
        ["ಇದೆಯಾ?", "ideyaa?"],
      ],
      blank: 2,
      notes: "ಖಾಲಿ (khaali) = empty/free. Can I sit here? = ಇಲ್ಲಿ ಕೂರಬಹುದಾ? (illi koorabahudaa?).",
    },
    // Everyday conversations › On the phone (lesson "conv-phone")
    hello_onPhone: {
      words: [["ಹಲೋ?", "halo?"]],
      notes: "On the phone everyone says ಹಲೋ, never ನಮಸ್ಕಾರ first.",
    },
    whoIsSpeaking: {
      words: [
        ["ಯಾರು", "yaaru"],
        ["ಮಾತನಾಡುತ್ತಿರುವುದು?", "maatanaaduttiruvudu?"],
      ],
      notes:
        'Literally "who is it that is speaking?". Spoken: ಯಾರು ಮಾತಾಡ್ತಿರೋದು? (yaaru maataadtirodu?).',
    },
    callYouLater: {
      words: [
        ["ನಾನು", "naanu"],
        ["ನಿಮಗೆ", "nimage"],
        ["ಆಮೇಲೆ", "aamele"],
        ["ಫೋನ್", "fon"],
        ["ಮಾಡುತ್ತೇನೆ", "maaduttene"],
      ],
      blank: 2,
      notes:
        "To a friend: ಆಮೇಲೆ ಫೋನ್ ಮಾಡ್ತೀನಿ (aamele fon maadteeni). ಕಾಲ್ ಮಾಡ್ತೀನಿ (kaal maadteeni) is also common.",
    },
    canYouHearMe: {
      words: [
        ["ನಿಮಗೆ", "nimage"],
        ["ಕೇಳಿಸುತ್ತಿದೆಯಾ?", "kelisuttideyaa?"],
      ],
      notes: 'Literally "is it audible to you?". Spoken: ಕೇಳಿಸ್ತಿದೆಯಾ? (kelistideyaa?).',
    },
    justAMinute: {
      words: [
        ["ಒಂದು", "ondu"],
        ["ನಿಮಿಷ", "nimisha"],
      ],
      notes: "ನಿಮಿಷ (nimisha) = minute. Also: ಸ್ವಲ್ಪ ಇರಿ (svalpa iri, hold on a moment).",
    },
    // Everyday conversations › Asking for help (lesson "conv-help")
    whatIsTheNameOfThisPlace: {
      words: [
        ["ಈ", "ee"],
        ["ಜಾಗದ", "jaagada"],
        ["ಹೆಸರು", "hesaru"],
        ["ಏನು?", "enu?"],
      ],
      blank: 1,
      notes: "ಜಾಗ (jaaga) = place. For a town or area: ಈ ಊರಿನ ಹೆಸರು ಏನು? (ee oorina hesaru enu?).",
    },
    ofCourse: {
      words: [["ಖಂಡಿತ", "khandita"]],
      notes:
        'Means "certainly, definitely". Often ಖಂಡಿತ ಬರುತ್ತೇನೆ (I\'ll definitely come). Casual agreement: ಹೌದು ಮತ್ತೆ (haudu matte, yes, of course).',
    },
    // Grammar & sentence building › I, you, he, she… (lesson "pronouns")
    youCasual: {
      script: "ನೀನು",
      roman: "neenu",
      notes:
        "For close friends, younger people and children. Using it with an elder or stranger sounds rude; use ನೀವು (neevu) instead.",
    },
    he: {
      script: "ಅವನು",
      roman: "avanu",
      notes:
        "For a man you don't need to show respect to (friend, younger). For an elder or respected man use ಅವರು (avaru). Nearby: ಇವನು (ivanu).",
    },
    she: {
      script: "ಅವಳು",
      roman: "avalu",
      notes: "Respectful: ಅವರು (avaru). Nearby: ಇವಳು (ivalu).",
    },
    we: {
      script: "ನಾವು",
      roman: "naavu",
      notes: "Our = ನಮ್ಮ (namma), as in ನಮ್ಮ ಬೆಂಗಳೂರು (our Bengaluru).",
    },
    they: {
      script: "ಅವರು",
      roman: "avaru",
      notes:
        'ಅವರು is also the respectful "he/she". For things (they = those things) use ಅವು (avu).',
    },
    itPronoun: {
      script: "ಅದು",
      roman: "adu",
      notes:
        'ಅದು means both "it" and "that (one)"; ಇದು (idu) is "this (one)". Kannada uses ಅದು for animals and things, not for people.',
    },
    // Grammar & sentence building › Word order & the present (lesson "word-order")
    iEatRice: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಅನ್ನ", "anna"],
        ["ತಿನ್ನುತ್ತೇನೆ", "tinnuttene"],
      ],
      blank: 1,
      notes:
        'Literally "I rice eat" — the verb comes last. This form also means "I will eat". Spoken: ತಿನ್ತೀನಿ (tinteeni).',
    },
    sheDrinksTea: {
      words: [
        ["ಅವಳು", "avalu"],
        ["ಟೀ", "tee"],
        ["ಕುಡಿಯುತ್ತಾಳೆ", "kudiyuttaale"],
      ],
      blank: 2,
      notes:
        'The ending -ಆಳೆ (-aale) marks "she". He drinks: ಕುಡಿಯುತ್ತಾನೆ (kudiyuttaane). Respectful: ಕುಡಿಯುತ್ತಾರೆ.',
    },
    weGoToCollege: {
      words: [
        ["ನಾವು", "naavu"],
        ["ಕಾಲೇಜಿಗೆ", "kaalejige"],
        ["ಹೋಗುತ್ತೇವೆ", "hogutteve"],
      ],
      blank: 2,
      notes: 'The ending -ಏವೆ (-eve) marks "we". Spoken: ಹೋಗ್ತೀವಿ (hogteevi).',
    },
    heReadsABook: {
      words: [
        ["ಅವನು", "avanu"],
        ["ಪುಸ್ತಕ", "pustaka"],
        ["ಓದುತ್ತಾನೆ", "oduttaane"],
      ],
      blank: 2,
      notes: 'The ending -ಆನೆ (-aane) marks "he". Kannada has no word for "a/the".',
    },
    theyLiveInIndia: {
      words: [
        ["ಅವರು", "avaru"],
        ["ಭಾರತದಲ್ಲಿ", "bhaaratadalli"],
        ["ಇರುತ್ತಾರೆ", "iruttaare"],
      ],
      blank: 1,
      notes: "ಭಾರತ + -ದಲ್ಲಿ (in). Formal: ವಾಸಿಸುತ್ತಾರೆ (vaasisuttaare, reside).",
    },
    myMotherCooksFood: {
      words: [
        ["ನನ್ನ", "nanna"],
        ["ಅಮ್ಮ", "amma"],
        ["ಅಡುಗೆ", "aduge"],
        ["ಮಾಡುತ್ತಾರೆ", "maaduttaare"],
      ],
      blank: 2,
      notes:
        "The respectful ending -ಆರೆ (-aare) is used for a mother; ಮಾಡುತ್ತಾಳೆ (maaduttaale) is also heard in close families. ಅಡುಗೆ ಮಾಡು = to cook.",
    },
    iSpeakEnglish: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಇಂಗ್ಲಿಷ್", "inglish"],
        ["ಮಾತನಾಡುತ್ತೇನೆ", "maatanaaduttene"],
      ],
      blank: 2,
      notes: "Idiomatic: ನನಗೆ ಇಂಗ್ಲಿಷ್ ಬರುತ್ತದೆ (nanage inglish baruttade, English comes to me).",
    },
    // Grammar & sentence building › Past & future (lesson "past-future")
    iAteRice: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಅನ್ನ", "anna"],
        ["ತಿಂದೆ", "tinde"],
      ],
      blank: 2,
      notes:
        'Past tense "I" ending -ಎ: ತಿಂದೆ (ate), ಹೋದೆ (went), ಬಂದೆ (came). Negative: ತಿನ್ನಲಿಲ್ಲ (tinnalilla, didn\'t eat).',
    },
    iWillEatRice: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಆಮೇಲೆ", "aamele"],
        ["ಅನ್ನ", "anna"],
        ["ತಿನ್ನುತ್ತೇನೆ", "tinnuttene"],
      ],
      meaning: "I will eat rice later.",
      accept: ["I will eat rice"],
      blank: 3,
      notes:
        'Kannada uses the same form for "I eat" and "I will eat"; a time word like ಆಮೇಲೆ (aamele, later) or ನಾಳೆ (tomorrow) makes the future clear.',
    },
    iWentToTheMarketYesterday: {
      words: [
        ["ನಾನು", "naanu"],
        ["ನಿನ್ನೆ", "ninne"],
        ["ಮಾರುಕಟ್ಟೆಗೆ", "maarukattege"],
        ["ಹೋದೆ", "hode"],
      ],
      blank: 3,
      notes:
        "Time words usually come early in the sentence. Spoken: ನಿನ್ನೆ ಮಾರ್ಕೆಟ್‌ಗೆ ಹೋಗಿದ್ದೆ (hogidde, I had gone).",
    },
    iWillGoTomorrow: {
      words: [
        ["ನಾನು", "naanu"],
        ["ನಾಳೆ", "naale"],
        ["ಹೋಗುತ್ತೇನೆ", "hoguttene"],
      ],
      blank: 1,
      notes: "Spoken: ನಾಳೆ ಹೋಗ್ತೀನಿ (naale hogteeni).",
    },
    sheCameYesterday: {
      words: [
        ["ಅವಳು", "avalu"],
        ["ನಿನ್ನೆ", "ninne"],
        ["ಬಂದಳು", "bandalu"],
      ],
      blank: 2,
      notes:
        "He came = ಅವನು ಬಂದನು / ಬಂದ (banda); respectful/they came = ಅವರು ಬಂದರು (bandaru); it came = ಅದು ಬಂತು (bantu).",
    },
    weWillComeTomorrow: {
      words: [
        ["ನಾವು", "naavu"],
        ["ನಾಳೆ", "naale"],
        ["ಬರುತ್ತೇವೆ", "barutteve"],
      ],
      blank: 2,
      notes: "Spoken: ನಾಳೆ ಬರ್ತೀವಿ (barteevi).",
    },
    // Grammar & sentence building › Questions & negatives (lesson "questions-negatives")
    why: { script: "ಯಾಕೆ", roman: "yaake", notes: "Formal: ಏಕೆ (eke)." },
    how: { script: "ಹೇಗೆ", roman: "hege" },
    which: {
      script: "ಯಾವುದು",
      roman: "yaavudu",
      notes: "Alone: ಯಾವುದು? (which one?). Before a noun use ಯಾವ (yaava): ಯಾವ ಬಸ್? (which bus?).",
    },
    doYouEatMeat: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಮಾಂಸ", "maamsa"],
        ["ತಿನ್ನುತ್ತೀರಾ?", "tinnutteeraa?"],
      ],
      notes:
        "The -ಆ at the end makes a yes/no question. People commonly ask ನೀವು ನಾನ್‌ವೆಜ್ ತಿನ್ನುತ್ತೀರಾ? (naanvej). Casual: ನೀನು ಮಾಂಸ ತಿನ್ನುತ್ತೀಯಾ?",
    },
    iDontKnow: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಗೊತ್ತಿಲ್ಲ", "gottilla"],
      ],
      notes: 'Literally "to me it is not known". "I know" = ನನಗೆ ಗೊತ್ತು (nanage gottu).',
    },
    isThisYourBook: {
      words: [
        ["ಇದು", "idu"],
        ["ನಿಮ್ಮ", "nimma"],
        ["ಪುಸ್ತಕವಾ?", "pustakavaa?"],
      ],
      blank: 2,
      notes: "ಪುಸ್ತಕ + -ಆ (question) = ಪುಸ್ತಕವಾ? Formal written: ಪುಸ್ತಕವೇ? (pustakave?).",
    },
    thisIsNotMyBook: {
      words: [
        ["ಇದು", "idu"],
        ["ನನ್ನ", "nanna"],
        ["ಪುಸ್ತಕ", "pustaka"],
        ["ಅಲ್ಲ", "alla"],
      ],
      blank: 3,
      notes:
        'ಅಲ್ಲ (alla) denies identity ("is not"); ಇಲ್ಲ (illa) denies existence ("there isn\'t").',
    },
    whyAreYouLate: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಯಾಕೆ", "yaake"],
        ["ತಡವಾಗಿ", "tadavaagi"],
        ["ಬಂದಿರಿ?", "bandiri?"],
      ],
      blank: 1,
      notes: 'Literally "why did you come late?". Spoken: ಯಾಕೆ ಲೇಟ್ ಆಯ್ತು? (yaake let aaytu?).',
    },
    howDoYouGoToCollege: {
      words: [
        ["ನೀವು", "neevu"],
        ["ಕಾಲೇಜಿಗೆ", "kaalejige"],
        ["ಹೇಗೆ", "hege"],
        ["ಹೋಗುತ್ತೀರಿ?", "hogutteeri?"],
      ],
      blank: 2,
      notes:
        "Answer: ಬಸ್ಸಿನಲ್ಲಿ (bassinalli, by bus), ಮೆಟ್ರೋದಲ್ಲಿ (by metro), ನಡೆದುಕೊಂಡು (on foot).",
    },
    // Grammar & sentence building › My, your & small words (lesson "possession")
    inPostposition: {
      script: "-ಅಲ್ಲಿ",
      roman: "-alli",
      notes:
        "An ending, not a separate word: ಮನೆ → ಮನೆಯಲ್ಲಿ (in the house), ಬೆಂಗಳೂರು → ಬೆಂಗಳೂರಿನಲ್ಲಿ (in Bengaluru). Spoken Kannada often shortens it to -ಲ್ಲಿ: ಬೆಂಗಳೂರಲ್ಲಿ.",
    },
    onPostposition: {
      script: "ಮೇಲೆ",
      roman: "mele",
      notes:
        'Comes after the noun with -ಅ/-ಇನ: ಮೇಜಿನ ಮೇಲೆ (on the table). ಮೇಲೆ also means "above" and "after": ಊಟದ ಮೇಲೆ (after the meal).',
    },
    withPostposition: {
      script: "ಜೊತೆ",
      roman: "jote",
      notes:
        "Follows a noun in the -ಅ form: ಅಮ್ಮನ ಜೊತೆ (with mother), ನನ್ನ ಜೊತೆ (with me). Also ಜೊತೆಗೆ (jotege); formal: ಒಡನೆ (odane).",
    },
    fromPostposition: {
      script: "-ಇಂದ",
      roman: "-inda",
      notes:
        'An ending: ಮನೆ → ಮನೆಯಿಂದ (from home), ಮೈಸೂರು → ಮೈಸೂರಿನಿಂದ (from Mysuru). It also means "by means of": ಬಸ್ಸಿನಿಂದ (by bus).',
    },
    table: { script: "ಮೇಜು", roman: "meju", notes: "ಟೇಬಲ್ (tebal) is common in speech." },
    thisIsMyBook: {
      words: [
        ["ಇದು", "idu"],
        ["ನನ್ನ", "nanna"],
        ["ಪುಸ್ತಕ", "pustaka"],
      ],
      blank: 1,
    },
    hisNameIsRavi: {
      words: [
        ["ಅವನ", "avana"],
        ["ಹೆಸರು", "hesaru"],
        ["ರವಿ", "Ravi"],
      ],
      blank: 0,
      notes:
        "ಅವನ (avana) = his; her = ಅವಳ (avala); respectful his/her = ಅವರ (avara): ಅವರ ಹೆಸರು ರವಿ.",
    },
    theBookIsOnTheTable: {
      words: [
        ["ಪುಸ್ತಕ", "pustaka"],
        ["ಮೇಜಿನ", "mejina"],
        ["ಮೇಲೆ", "mele"],
        ["ಇದೆ", "ide"],
      ],
      blank: 2,
      notes:
        'Literally "book table\'s on-top is". ಮೇಜು + -ಇನ = ಮೇಜಿನ (of the table). ಇದೆ (ide) = it is (there).',
    },
    iGoWithMyFriend: {
      words: [
        ["ನಾನು", "naanu"],
        ["ನನ್ನ", "nanna"],
        ["ಸ್ನೇಹಿತನ", "snehitana"],
        ["ಜೊತೆ", "jote"],
        ["ಹೋಗುತ್ತೇನೆ", "hoguttene"],
      ],
      blank: 3,
      notes:
        "ಸ್ನೇಹಿತ + -ಅನ = ಸ್ನೇಹಿತನ (friend's) + ಜೊತೆ (with). With a female friend: ಸ್ನೇಹಿತೆಯ ಜೊತೆ (snehiteya jote).",
    },
    sheIsComingFromHome: {
      words: [
        ["ಅವಳು", "avalu"],
        ["ಮನೆಯಿಂದ", "maneyinda"],
        ["ಬರುತ್ತಿದ್ದಾಳೆ", "baruttiddaale"],
      ],
      blank: 1,
      notes: "ಮನೆ + -ಇಂದ (from) = ಮನೆಯಿಂದ. Spoken: ಮನೆಯಿಂದ ಬರ್ತಿದ್ದಾಳೆ (bartiddaale).",
    },
    // Grammar & sentence building › Polite & casual (lesson "polite-casual")
    comeCasual: {
      words: [["ಬಾ", "baa"]],
      notes: "Casual command for friends, children and younger people. Polite: ಬನ್ನಿ (banni).",
    },
    comePolite: {
      words: [["ಬನ್ನಿ", "banni"]],
      notes:
        "Already polite on its own (the -ಇ ending). Hosts repeat it warmly: ಬನ್ನಿ ಬನ್ನಿ, ಒಳಗೆ ಬನ್ನಿ (come in, come in).",
    },
    sitCasual: {
      words: [["ಕುಳಿತುಕೋ", "kulituko"]],
      notes: "In everyday speech: ಕೂತ್ಕೋ (kootko) or ಕೂರು (kooru).",
    },
    sitPolite: {
      words: [["ಕುಳಿತುಕೊಳ್ಳಿ", "kulitukolli"]],
      notes: "Spoken: ಕೂತ್ಕೊಳ್ಳಿ (kootkolli) or ಕೂರಿ (koori). Add ದಯವಿಟ್ಟು for extra politeness.",
    },
    eatPolite: {
      words: [
        ["ಊಟ", "oota"],
        ["ಮಾಡಿ", "maadi"],
      ],
      notes:
        'Literally "please do the meal" — what hosts say to guests, often repeated: ಇನ್ನೂ ಸ್ವಲ್ಪ ತಗೊಳ್ಳಿ (have a little more). Casual: ಊಟ ಮಾಡು (oota maadu) or ತಿನ್ನು (tinnu).',
    },
    howAreYouCasual: {
      words: [
        ["ನೀನು", "neenu"],
        ["ಹೇಗಿದ್ದೀಯ?", "hegiddeeya?"],
      ],
      notes:
        "Casual, for friends. Spoken: ಹೇಗಿದ್ದೀಯಾ? (hegiddeeyaa?) or ಹೇಗಿದೀಯಾ? Among Bengaluru friends: ಏನ್ ಗುರು, ಹೇಗಿದೀಯಾ?",
    },
    // Feelings, health & relationships › How do you feel? (lesson "feelings")
    happy: {
      script: "ಸಂತೋಷ",
      roman: "santosha",
      notes:
        "A noun (happiness). In speech ಖುಷಿ (khushi) is just as common: ನನಗೆ ತುಂಬಾ ಖುಷಿ ಆಯ್ತು (I'm so happy).",
    },
    sad: {
      script: "ದುಃಖ",
      roman: "duhkha",
      notes:
        "ದುಃಖ is deep sorrow. Everyday sadness or feeling low is ಬೇಸರ (besara), spoken ಬೇಜಾರು (bejaaru).",
    },
    angry: {
      script: "ಕೋಪ",
      roman: "kopa",
      notes: 'A noun (anger): Kannada says anger "comes" to you — ನನಗೆ ಕೋಪ ಬಂತು (I got angry).',
    },
    tired: {
      script: "ಸುಸ್ತು",
      roman: "sustu",
      notes: "A noun (tiredness): ನನಗೆ ಸುಸ್ತಾಗಿದೆ (I'm tired).",
    },
    scared: {
      script: "ಭಯ",
      roman: "bhaya",
      notes:
        'A noun (fear). Spoken alternative: ಹೆದರಿಕೆ (hedarike); "don\'t be scared" = ಹೆದರಬೇಡಿ (hedarabedi).',
    },
    worried: {
      script: "ಚಿಂತೆ",
      roman: "chinte",
      notes: "A noun (worry). Young people say ಟೆನ್ಶನ್ (tenshan): ಟೆನ್ಶನ್ ಆಗ್ತಿದೆ (I'm stressed).",
    },
    iAmHappy: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಸಂತೋಷವಾಗಿದ್ದೇನೆ", "santoshavaagiddene"],
      ],
      notes:
        "Spoken: ನಾನು ಖುಷಿಯಾಗಿದ್ದೀನಿ (naanu khushiyaagiddeeni). Happy about news: ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ಆಯಿತು.",
    },
    iAmSad: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಬೇಸರವಾಗಿದೆ", "besaravaagide"],
      ],
      notes:
        'Literally "to me sadness has happened". Spoken: ಬೇಜಾರಾಗಿದೆ (bejaaraagide). ಬೇಸರ also covers feeling bored or upset.',
    },
    iAmTired: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಸುಸ್ತಾಗಿದೆ", "sustaagide"],
      ],
      notes:
        'Literally "to me tiredness has happened". Spoken: ತುಂಬಾ ಸುಸ್ತಾಗಿದೆ (tumbaa sustaagide).',
    },
    // Feelings, health & relationships › I'm okay, don't worry (lesson "feelings-2")
    iAmAngry: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಕೋಪ", "kopa"],
        ["ಬಂದಿದೆ", "bandide"],
      ],
      blank: 1,
      notes: 'Literally "anger has come to me".',
    },
    iAmOkay: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಆರಾಮಾಗಿದ್ದೇನೆ", "aaraamaagiddene"],
      ],
      notes:
        "ಆರಾಮ (aaraama) = comfort, ease. Spoken: ಆರಾಮಾಗಿದ್ದೀನಿ. People also ask ಆರಾಮಾ? (all well?).",
    },
    iAmNotFeelingWell: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಹುಷಾರಿಲ್ಲ", "hushaarilla"],
      ],
      notes:
        "The everyday way to say you are unwell (ಹುಷಾರು = well/alert + ಇಲ್ಲ). Also ಮೈ ಸರಿ ಇಲ್ಲ (mai sari illa, my body isn't right).",
    },
    dontWorry: {
      words: [
        ["ಚಿಂತೆ", "chinte"],
        ["ಮಾಡಬೇಡಿ", "maadabedi"],
      ],
      notes: "Polite. Casual: ಚಿಂತೆ ಮಾಡಬೇಡ (maadabeda). Spoken: ಟೆನ್ಶನ್ ತಗೋಬೇಡ (tenshan tagobeda).",
    },
    iAmScared: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಭಯ", "bhaya"],
        ["ಆಗುತ್ತಿದೆ", "aaguttide"],
      ],
      blank: 1,
      notes: 'Literally "fear is happening to me". Spoken: ಭಯ ಆಗ್ತಿದೆ (bhaya aagtide).',
    },
    // Feelings, health & relationships › The body (lesson "body")
    head: { script: "ತಲೆ", roman: "tale" },
    hand: { script: "ಕೈ", roman: "kai" },
    leg: {
      script: "ಕಾಲು",
      roman: "kaalu",
      notes: 'ಕಾಲು means leg and foot; it also means "a quarter". Careful: ಕಲ್ಲು (kallu) = stone.',
    },
    eye: { script: "ಕಣ್ಣು", roman: "kannu" },
    ear: { script: "ಕಿವಿ", roman: "kivi" },
    mouth: { script: "ಬಾಯಿ", roman: "baayi" },
    stomach: { script: "ಹೊಟ್ಟೆ", roman: "hotte" },
    tooth: {
      script: "ಹಲ್ಲು",
      roman: "hallu",
      notes: "Careful: ಹಲ್ಲು (hallu, tooth) vs ಹಾಲು (haalu, milk).",
    },
    // Feelings, health & relationships › At the doctor (lesson "health")
    fever: { script: "ಜ್ವರ", roman: "jvara" },
    medicine: {
      script: "ಔಷಧಿ",
      roman: "aushadhi",
      notes:
        "A tablet is ಮಾತ್ರೆ (maatre); people also say ಮೆಡಿಸಿನ್ (medisin). A pharmacy is a ಮೆಡಿಕಲ್ ಶಾಪ್ (medikal shaap).",
    },
    iHaveAFever: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಜ್ವರ", "jvara"],
        ["ಇದೆ", "ide"],
      ],
      blank: 1,
      notes: 'Literally "to me fever is there". Also: ಜ್ವರ ಬಂದಿದೆ (jvara bandide, fever has come).',
    },
    iHaveAHeadache: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ತಲೆನೋವು", "talenovu"],
        ["ಇದೆ", "ide"],
      ],
      blank: 1,
      notes:
        "ತಲೆ (head) + ನೋವು (novu, pain). Also: ತಲೆ ನೋಯುತ್ತಿದೆ (tale noyuttide, my head hurts).",
    },
    myStomachHurts: {
      words: [
        ["ನನ್ನ", "nanna"],
        ["ಹೊಟ್ಟೆ", "hotte"],
        ["ನೋಯುತ್ತಿದೆ", "noyuttide"],
      ],
      blank: 1,
      notes: "Also: ನನಗೆ ಹೊಟ್ಟೆ ನೋವು ಇದೆ (nanage hotte novu ide, I have a stomach ache).",
    },
    iNeedADoctor: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಡಾಕ್ಟರ್", "daaktar"],
        ["ಬೇಕು", "beku"],
      ],
      blank: 1,
    },
    callADoctor: {
      words: [
        ["ದಯವಿಟ್ಟು", "dayavittu"],
        ["ಡಾಕ್ಟರನ್ನು", "daaktarannu"],
        ["ಕರೆಯಿರಿ", "kareyiri"],
      ],
      blank: 1,
      notes:
        "ಕರೆ (kare) = to call (someone to come). Spoken: ಡಾಕ್ಟರ್‌ನ ಕರೀರಿ (daaktarna kareeri). Ambulance number: 108.",
    },
    takeThisMedicine: {
      words: [
        ["ಈ", "ee"],
        ["ಔಷಧಿ", "aushadhi"],
        ["ತೆಗೆದುಕೊಳ್ಳಿ", "tegedukolli"],
      ],
      blank: 1,
      notes:
        "Polite. Spoken: ಈ ಮಾತ್ರೆ ತಗೊಳ್ಳಿ (ee maatre tagolli, take this tablet). Casual: ತೆಗೆದುಕೋ (tegeduko).",
    },
    // Feelings, health & relationships › Love & friendship (lesson "love-friendship")
    iLoveYou: {
      words: [
        ["ನಾನು", "naanu"],
        ["ನಿನ್ನನ್ನು", "ninnannu"],
        ["ಪ್ರೀತಿಸುತ್ತೇನೆ", "preetisuttene"],
      ],
      blank: 2,
      notes:
        'Romantic, and quite serious — people say it in films and to a partner, not casually. Couples often use ನೀನು (neenu) with each other. Spoken: ನಾನು ನಿನ್ನ ಪ್ರೀತಿಸ್ತೀನಿ (naanu ninna preetisteeni); many young people simply say "I love you" in English.',
    },
    iLikeYou: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ನೀನು", "neenu"],
        ["ಇಷ್ಟ", "ishta"],
      ],
      blank: 2,
      notes:
        'Literally "to me you are liked". Can sound romantic; to a friend or colleague use the polite ನನಗೆ ನೀವು ಇಷ್ಟ (nanage neevu ishta) or praise something specific instead.',
    },
    iMissYou: {
      words: [
        ["ನಿನ್ನ", "ninna"],
        ["ನೆನಪು", "nenapu"],
        ["ತುಂಬಾ", "tumbaa"],
        ["ಆಗುತ್ತಿದೆ", "aaguttide"],
      ],
      blank: 1,
      notes:
        'Literally "your memory is coming (to me) a lot" — the warm native way, fine for family and friends. Polite: ನಿಮ್ಮ ನೆನಪು ತುಂಬಾ ಆಗುತ್ತಿದೆ. Young people often say ಮಿಸ್ ಮಾಡ್ಕೊಳ್ತಿದ್ದೀನಿ (mis maadkoltiddeeni).',
    },
    iLoveMyFamily: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ನನ್ನ", "nanna"],
        ["ಕುಟುಂಬ", "kutumba"],
        ["ಅಂದರೆ", "andare"],
        ["ತುಂಬಾ", "tumbaa"],
        ["ಪ್ರೀತಿ", "preeti"],
      ],
      blank: 2,
      notes:
        'Literally "to me, my family means a lot of love" — how people naturally express it. The literal ನಾನು ನನ್ನ ಕುಟುಂಬವನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ sounds bookish. Spoken: ನನಗೆ ನಮ್ಮ ಮನೆಯವರು ಅಂದ್ರೆ ತುಂಬಾ ಇಷ್ಟ.',
    },
    youAreMyFriend: {
      words: [
        ["ನೀನು", "neenu"],
        ["ನನ್ನ", "nanna"],
        ["ಸ್ನೇಹಿತ", "snehita"],
      ],
      blank: 2,
      notes:
        "Said to a male friend; to a female friend: ನೀನು ನನ್ನ ಸ್ನೇಹಿತೆ (snehite). Polite/plural: ನೀವು ನನ್ನ ಸ್ನೇಹಿತರು (neevu nanna snehitaru). Friends usually use ನೀನು with each other.",
    },
    youAreMyBestFriend: {
      words: [
        ["ನೀನು", "neenu"],
        ["ನನ್ನ", "nanna"],
        ["ಆತ್ಮೀಯ", "aatmeeya"],
        ["ಸ್ನೇಹಿತ", "snehita"],
      ],
      blank: 2,
      notes:
        "ಆತ್ಮೀಯ (aatmeeya) = close, dear. In real life most people say ನೀನು ನನ್ನ ಬೆಸ್ಟ್ ಫ್ರೆಂಡ್ (best frend). For a woman: ಆತ್ಮೀಯ ಸ್ನೇಹಿತೆ.",
    },
    iLikeThis: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಇದು", "idu"],
        ["ಇಷ್ಟ", "ishta"],
      ],
      blank: 2,
      notes: 'Literally "to me this is liked". Also: ಇದು ನನಗೆ ಇಷ್ಟ ಆಯ್ತು (I liked this).',
    },
    iDontLikeThis: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಇದು", "idu"],
        ["ಇಷ್ಟ", "ishta"],
        ["ಇಲ್ಲ", "illa"],
      ],
      blank: 3,
      notes:
        "Written also as one word ಇಷ್ಟವಿಲ್ಲ (ishtavilla). A softer refusal: ಇದು ಬೇಡ (I don't want this).",
    },
    takeCare: {
      words: [["ಹುಷಾರಾಗಿರಿ", "hushaaraagiri"]],
      notes:
        'Polite ("stay well/careful"). Casual: ಹುಷಾರು! (hushaaru!) or ಹುಷಾರಾಗಿರು (hushaaraagiru). Elders also say ಜೋಪಾನ (jopaana).',
    },
    // Practical communication › Weather (lesson "weather")
    weather: {
      script: "ಹವಾಮಾನ",
      roman: "havaamaana",
      notes:
        "Formal (weather reports). In conversation people talk about ಬಿಸಿಲು (sunshine), ಮಳೆ (rain) and ಚಳಿ (cold) directly.",
    },
    hot: {
      script: "ಬಿಸಿ",
      roman: "bisi",
      notes:
        "ಬಿಸಿ is hot to the touch (ಬಿಸಿ ನೀರು, hot water). Hot, sticky weather is ಸೆಕೆ (seke); strong sun is ಬಿಸಿಲು (bisilu).",
    },
    cold: {
      script: "ಚಳಿ",
      roman: "chali",
      notes:
        "ಚಳಿ is cold weather / feeling cold. Cold food or water is ತಣ್ಣಗೆ (tannage): ತಣ್ಣಗಿನ ನೀರು (cold water).",
    },
    rain: {
      script: "ಮಳೆ",
      roman: "male",
      notes: 'Rain "comes" in Kannada: ಮಳೆ ಬರುತ್ತಿದೆ (it\'s raining).',
    },
    sun: {
      script: "ಸೂರ್ಯ",
      roman: "soorya",
      notes: "Sunshine / the heat of the sun is ಬಿಸಿಲು (bisilu).",
    },
    wind: { script: "ಗಾಳಿ", roman: "gaali", notes: "ಗಾಳಿ also means air." },
    itIsHotToday: {
      words: [
        ["ಇವತ್ತು", "ivattu"],
        ["ತುಂಬಾ", "tumbaa"],
        ["ಸೆಕೆ", "seke"],
        ["ಇದೆ", "ide"],
      ],
      blank: 2,
      accept: ["It is very hot today"],
      notes:
        "ಸೆಕೆ (seke) = hot, humid weather. For strong sun: ಇವತ್ತು ಬಿಸಿಲು ಜಾಸ್ತಿ (ivattu bisilu jaasti).",
    },
    itIsRaining: {
      words: [
        ["ಮಳೆ", "male"],
        ["ಬರುತ್ತಿದೆ", "baruttide"],
      ],
      notes: 'Literally "rain is coming". Spoken: ಮಳೆ ಬರ್ತಿದೆ (male bartide).',
    },
    itIsColdToday: {
      words: [
        ["ಇವತ್ತು", "ivattu"],
        ["ಚಳಿ", "chali"],
        ["ಇದೆ", "ide"],
      ],
      blank: 1,
      notes: 'Literally "today cold is there".',
    },
    // Practical communication › College & work (lesson "college-work")
    classroom: { script: "ತರಗತಿ", roman: "taragati", notes: "Students mostly say ಕ್ಲಾಸ್ (klaas)." },
    exam: {
      script: "ಪರೀಕ್ಷೆ",
      roman: "pareekshe",
      notes: "Also ಎಕ್ಸಾಮ್ (eksaam). Results = ಫಲಿತಾಂಶ (phalitaamsha) or ರಿಸಲ್ಟ್.",
    },
    homework: {
      script: "ಮನೆಗೆಲಸ",
      roman: "manegelasa",
      notes:
        'Literally "house-work" (it also means household chores). Students usually say ಹೋಂವರ್ಕ್ (homvark).',
    },
    job: {
      script: "ಕೆಲಸ",
      roman: "kelasa",
      notes:
        "ಕೆಲಸ = work / job. Formal: ಉದ್ಯೋಗ (udyoga); a government job is ಸರ್ಕಾರಿ ಕೆಲಸ (sarkaari kelasa).",
    },
    holiday: {
      script: "ರಜೆ",
      roman: "raje",
      notes: "Also ರಜಾ (rajaa). Summer holidays = ಬೇಸಿಗೆ ರಜೆ (besige raje).",
    },
    iHaveAnExamTomorrow: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ನಾಳೆ", "naale"],
        ["ಪರೀಕ್ಷೆ", "pareekshe"],
        ["ಇದೆ", "ide"],
      ],
      blank: 2,
      notes: 'Literally "to me tomorrow an exam is there".',
    },
    todayIsAHoliday: {
      words: [
        ["ಇವತ್ತು", "ivattu"],
        ["ರಜೆ", "raje"],
      ],
      blank: 1,
      notes: "Spoken: ಇವತ್ತು ರಜಾ (ivattu rajaa).",
    },
    iWorkInAnOffice: {
      words: [
        ["ನಾನು", "naanu"],
        ["ಆಫೀಸಿನಲ್ಲಿ", "aafeesinalli"],
        ["ಕೆಲಸ", "kelasa"],
        ["ಮಾಡುತ್ತೇನೆ", "maaduttene"],
      ],
      blank: 1,
      notes:
        "ಆಫೀಸ್ + -ಇನಲ್ಲಿ = in the office. Spoken: ಆಫೀಸಲ್ಲಿ ಕೆಲಸ ಮಾಡ್ತೀನಿ (aafeesalli kelasa maadteeni).",
    },
    // Practical communication › Hobbies & likes (lesson "hobbies")
    music: {
      script: "ಸಂಗೀತ",
      roman: "sangeeta",
      notes: "Karnataka is home to Carnatic music and Hindustani music (in Dharwad).",
    },
    movie: {
      script: "ಸಿನಿಮಾ",
      roman: "sinimaa",
      notes: "Formal: ಚಲನಚಿತ್ರ (chalanachitra). Kannada film industry = Sandalwood.",
    },
    song: {
      script: "ಹಾಡು",
      roman: "haadu",
      notes: 'ಹಾಡು is also the verb "to sing": ಹಾಡು ಹಾಡು (sing a song).',
    },
    cricket: { script: "ಕ್ರಿಕೆಟ್", roman: "kriket" },
    dance: {
      script: "ಡ್ಯಾನ್ಸ್",
      roman: "dyaans",
      notes:
        "The native word ನೃತ್ಯ (nrutya) is used for classical dance; folk dancing is ಕುಣಿತ (kunita), e.g. ಡೊಳ್ಳು ಕುಣಿತ (dollu kunita).",
    },
    iLikeMusic: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಸಂಗೀತ", "sangeeta"],
        ["ಇಷ್ಟ", "ishta"],
      ],
      blank: 1,
      notes: 'Literally "to me music is liked". "I like it very much" = ತುಂಬಾ ಇಷ್ಟ.',
    },
    doYouLikeCricket: {
      words: [
        ["ನಿಮಗೆ", "nimage"],
        ["ಕ್ರಿಕೆಟ್", "kriket"],
        ["ಇಷ್ಟವಾ?", "ishtavaa?"],
      ],
      blank: 1,
      notes:
        "ಇಷ್ಟ + -ಆ (question) = ಇಷ್ಟವಾ? Casual: ನಿನಗೆ ಕ್ರಿಕೆಟ್ ಇಷ್ಟವಾ? (ninage kriket ishtavaa?).",
    },
    iLikeWatchingMovies: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಸಿನಿಮಾ", "sinimaa"],
        ["ನೋಡುವುದು", "noduvudu"],
        ["ಇಷ್ಟ", "ishta"],
      ],
      blank: 2,
      notes:
        "ನೋಡುವುದು (noduvudu) = watching (verb as a noun). Spoken: ಸಿನಿಮಾ ನೋಡೋದು ಇಷ್ಟ (nododu).",
    },
    whatIsYourHobby: {
      words: [
        ["ನಿಮ್ಮ", "nimma"],
        ["ಹವ್ಯಾಸ", "havyaasa"],
        ["ಏನು?", "enu?"],
      ],
      blank: 1,
      notes: "ಹವ್ಯಾಸ = hobby. In speech: ನಿಮ್ ಹಾಬಿ ಏನು? (nim haabi enu?).",
    },
    // Practical communication › Plans & invitations (lesson "plans")
    letsGo: {
      words: [["ಹೋಗೋಣ", "hogona"]],
      notes:
        "The -ಓಣ (-ona) ending means \"let's\": ತಿನ್ನೋಣ (let's eat), ನೋಡೋಣ (let's see — also \"we'll see\"). Often ಬಾ, ಹೋಗೋಣ (come, let's go).",
    },
    comeToMyHouse: {
      words: [
        ["ನಮ್ಮ", "namma"],
        ["ಮನೆಗೆ", "manege"],
        ["ಬನ್ನಿ", "banni"],
      ],
      blank: 1,
      notes:
        "Kannada says ನಮ್ಮ ಮನೆ (our house), not ನನ್ನ ಮನೆ, for one's home. To a friend: ನಮ್ಮ ಮನೆಗೆ ಬಾ (baa).",
    },
    areYouFreeTomorrow: {
      words: [
        ["ನಾಳೆ", "naale"],
        ["ನಿಮಗೆ", "nimage"],
        ["ಬಿಡುವು", "biduvu"],
        ["ಇದೆಯಾ?", "ideyaa?"],
      ],
      blank: 2,
      notes:
        "ಬಿಡುವು (biduvu) = free time. What most people actually say: ನಾಳೆ ಫ್ರೀ ಇದ್ದೀರಾ? (naale free iddeeraa?); to a friend ನಾಳೆ ಫ್ರೀ ಇದ್ದೀಯಾ?",
    },
    yesIWillCome: {
      words: [
        ["ಸರಿ,", "sari,"],
        ["ನಾನು", "naanu"],
        ["ಬರುತ್ತೇನೆ", "baruttene"],
      ],
      blank: 2,
      accept: ["Okay, I will come", "Yes, I will come"],
      notes:
        "Accepting an invitation, Kannada uses ಸರಿ (okay) rather than ಹೌದು (that's true). Spoken: ಸರಿ, ಬರ್ತೀನಿ (sari, barteeni). Emphatic: ಖಂಡಿತ ಬರುತ್ತೇನೆ.",
    },
    sorryICantCome: {
      words: [
        ["ಕ್ಷಮಿಸಿ,", "kshamisi,"],
        ["ನನಗೆ", "nanage"],
        ["ಬರಲು", "baralu"],
        ["ಆಗುವುದಿಲ್ಲ", "aaguvudilla"],
      ],
      blank: 3,
      notes:
        'Literally "sorry, coming will not be possible for me". Spoken: ಸಾರಿ, ನನಗೆ ಬರೋಕೆ ಆಗಲ್ಲ (saari, nanage baroke aagalla).',
    },
    seeYouTomorrow: {
      words: [
        ["ನಾಳೆ", "naale"],
        ["ಸಿಗೋಣ", "sigona"],
      ],
      notes: 'Literally "let\'s meet tomorrow".',
    },
    // Practical communication › Requests & help (lesson "requests-help")
    canYouHelpMe: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಸ್ವಲ್ಪ", "svalpa"],
        ["ಸಹಾಯ", "sahaaya"],
        ["ಮಾಡುತ್ತೀರಾ?", "maadutteeraa?"],
      ],
      blank: 2,
      notes:
        'Literally "will you do me a little help?". Also: ಸ್ವಲ್ಪ ಸಹಾಯ ಮಾಡಬಹುದಾ? (could you help a little?). Casual: ಸ್ವಲ್ಪ ಹೆಲ್ಪ್ ಮಾಡ್ತೀಯಾ?',
    },
    iNeedHelp: {
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಸಹಾಯ", "sahaaya"],
        ["ಬೇಕು", "beku"],
      ],
      blank: 1,
    },
    pleaseHelpMe: {
      words: [
        ["ದಯವಿಟ್ಟು", "dayavittu"],
        ["ನನಗೆ", "nanage"],
        ["ಸಹಾಯ", "sahaaya"],
        ["ಮಾಡಿ", "maadi"],
      ],
      blank: 2,
    },
    pleaseWait: {
      words: [
        ["ಸ್ವಲ್ಪ", "svalpa"],
        ["ಕಾಯಿರಿ", "kaayiri"],
      ],
      notes:
        'Literally "wait a little". Also very common: ಒಂದು ನಿಮಿಷ (one minute) or ಸ್ವಲ್ಪ ಇರಿ (svalpa iri). Casual: ಸ್ವಲ್ಪ ಇರು.',
    },
    pleaseTellMe: {
      words: [
        ["ದಯವಿಟ್ಟು", "dayavittu"],
        ["ಹೇಳಿ", "heli"],
      ],
      notes: 'ಹೇಳಿ (heli) alone is the usual "yes, tell me / go ahead". Casual: ಹೇಳು (helu).',
    },
    pleaseShowMe: {
      words: [
        ["ದಯವಿಟ್ಟು", "dayavittu"],
        ["ತೋರಿಸಿ", "torisi"],
      ],
      notes: "Casual: ತೋರಿಸು (torisu).",
    },
    callMe: {
      words: [
        ["ದಯವಿಟ್ಟು", "dayavittu"],
        ["ನನಗೆ", "nanage"],
        ["ಫೋನ್", "fon"],
        ["ಮಾಡಿ", "maadi"],
      ],
      blank: 2,
      notes: "Casual: ನನಗೆ ಫೋನ್ ಮಾಡು (fon maadu) / ಕಾಲ್ ಮಾಡು.",
    },
    help: {
      words: [["ಕಾಪಾಡಿ!", "kaapaadi!"]],
      notes:
        'Literally "save (me)!" — the emergency cry. You can also shout ಸಹಾಯ ಮಾಡಿ! (sahaaya maadi!, help!). Emergency number: 112.',
    },
    itsOkay: {
      words: [
        ["ಪರವಾಗಿಲ್ಲ", "paravaagilla"],
        ["ಬಿಡಿ", "bidi"],
      ],
      notes:
        'Literally "it doesn\'t matter, leave it" — the natural reply to an apology. Casual: ಪರವಾಗಿಲ್ಲ ಬಿಡು (bidu).',
    },
  },
  extras: [
    // Greetings & politeness
    {
      key: "hogi-banni",
      lesson: "greetings",
      topic: "Greetings",
      words: [
        ["ಹೋಗಿ", "hogi"],
        ["ಬನ್ನಿ", "banni"],
      ],
      meaning: "Go and come back (the host's reply to goodbye)",
      notes:
        'Said by the host when a guest leaves; never just "go" (ಹೋಗಿ) alone, which would sound like sending them away.',
    },
    {
      key: "ri",
      lesson: "polite-words",
      topic: "Polite words",
      script: "ರೀ",
      roman: "ree",
      meaning: 'Polite particle to address someone (like "sir/madam")',
      notes:
        "Added to get attention or soften a request: ಸ್ವಲ್ಪ ನೋಡಿ ರೀ (excuse me, please). Wives traditionally call their husbands ರೀ instead of using their name.",
    },
    {
      key: "beda",
      lesson: "polite-words",
      topic: "Polite words",
      script: "ಬೇಡ",
      roman: "beda",
      meaning: "Don't want / No, thanks",
      notes:
        "The polite way to refuse an offer: ಬೇಡ, ಧನ್ಯವಾದ (no, thank you). Opposite of ಬೇಕು (beku, want).",
    },
    {
      key: "aaytu",
      lesson: "polite-words",
      topic: "Polite words",
      script: "ಆಯ್ತು",
      roman: "aaytu",
      meaning: "Okay / Done (spoken)",
      notes:
        "Spoken form of ಆಯಿತು (it happened). Used constantly to agree: ಆಯ್ತು, ಬರ್ತೀನಿ (okay, I'll come).",
    },
    // Things & actions
    {
      key: "kode",
      lesson: "things",
      topic: "Everyday things",
      script: "ಕೊಡೆ",
      roman: "kode",
      meaning: "Umbrella",
      notes: "Essential in the monsoon, especially on the coast (Mangaluru, Udupi).",
    },
    {
      key: "helu",
      lesson: "actions",
      topic: "Actions",
      script: "ಹೇಳು",
      roman: "helu",
      meaning: "To say / to tell",
      notes: "Polite command ಹೇಳಿ (heli, please tell). Past: ಹೇಳಿದೆ (helide, I said).",
    },
    {
      key: "kare",
      lesson: "actions",
      topic: "Actions",
      script: "ಕರೆ",
      roman: "kare",
      meaning: "To call (someone to come)",
      notes: "ಅವನನ್ನು ಕರೆ (call him over). ಕರೆ is also a noun: a phone call.",
    },
    {
      key: "idu",
      lesson: "this-and-that",
      topic: "Questions",
      script: "ಇದು",
      roman: "idu",
      meaning: "This (one)",
      notes: "Standing alone: ಇದು ಏನು? (what is this?). Before a noun use ಈ: ಈ ಪುಸ್ತಕ (this book).",
    },
    // Introductions
    {
      key: "namma",
      lesson: "my-name",
      topic: "Introductions",
      script: "ನಮ್ಮ",
      roman: "namma",
      meaning: "Our",
      notes:
        "Very common in Kannada pride slogans and names: ನಮ್ಮ ಮೆಟ್ರೋ (Bengaluru's metro), ನಮ್ಮ ಬೆಂಗಳೂರು.",
    },
    {
      key: "kannada",
      lesson: "my-name",
      topic: "Introductions",
      script: "ಕನ್ನಡ",
      roman: "kannada",
      meaning: "Kannada (the language)",
      notes: "The state is ಕರ್ನಾಟಕ (karnaataka); a Kannada speaker is a ಕನ್ನಡಿಗ (kannadiga).",
    },
    {
      key: "aaraamaa",
      lesson: "how-are-you",
      topic: "Greetings",
      words: [["ಆರಾಮಾ?", "aaraamaa?"]],
      meaning: "All well? / Doing fine?",
      notes:
        "Very common friendly greeting, especially in North Karnataka. Answer: ಆರಾಮ (aaraama, all fine).",
    },
    {
      key: "ooru",
      lesson: "where-from",
      topic: "Introductions",
      script: "ಊರು",
      roman: "ooru",
      meaning: "Town / home town",
      notes:
        "ನಿಮ್ಮ ಊರು ಯಾವುದು? (which is your home town?) is a standard getting-to-know-you question.",
    },
    {
      key: "karnaataka",
      lesson: "where-from",
      topic: "Places",
      script: "ಕರ್ನಾಟಕ",
      roman: "karnaataka",
      meaning: "Karnataka (the state)",
      notes:
        "Kannada is the official language of Karnataka. Karnataka Rajyotsava (state day) is on 1 November.",
    },
    {
      key: "bengalooru",
      lesson: "where-from",
      topic: "Places",
      script: "ಬೆಂಗಳೂರು",
      roman: "bengalooru",
      meaning: "Bengaluru (Bangalore)",
      notes: "With endings: ಬೆಂಗಳೂರಿನಲ್ಲಿ (in), ಬೆಂಗಳೂರಿಗೆ (to), ಬೆಂಗಳೂರಿನಿಂದ (from).",
    },
    {
      key: "maisooru",
      lesson: "where-from",
      topic: "Places",
      script: "ಮೈಸೂರು",
      roman: "maisooru",
      meaning: "Mysuru (Mysore)",
      notes:
        'Famous for the Dasara festival, the palace, Mysore Pak and silk. "I am from Mysuru" = ನಾನು ಮೈಸೂರಿನವನು / ಮೈಸೂರಿನವಳು.',
    },
    {
      key: "enandri",
      lesson: "understanding",
      topic: "Understanding",
      words: [["ಏನಂದ್ರಿ?", "enandri?"]],
      meaning: "What did you say? (polite, spoken)",
      notes:
        "Spoken form of ಏನು ಅಂದಿರಿ? Use it when you didn't catch something. To a friend: ಏನಂದೆ? (enande?).",
    },
    // Family
    {
      key: "maneyavaru",
      lesson: "parents-children",
      topic: "Family",
      script: "ಮನೆಯವರು",
      roman: "maneyavaru",
      meaning: "Family members / the people at home",
      notes:
        "The everyday word for family: ಮನೆಯವರು ಎಲ್ಲಾ ಚೆನ್ನಾಗಿದ್ದಾರಾ? (is everyone at home well?). A woman may also use it for her husband.",
    },
    {
      key: "attige",
      lesson: "siblings",
      topic: "Family",
      script: "ಅತ್ತಿಗೆ",
      roman: "attige",
      meaning: "Elder brother's wife (sister-in-law)",
    },
    {
      key: "bhaava",
      lesson: "siblings",
      topic: "Family",
      script: "ಭಾವ",
      roman: "bhaava",
      meaning: "Elder sister's husband (brother-in-law)",
      notes:
        "Also used for a husband's elder brother in some families. Don't confuse with ಭಾವ (feeling) — same spelling, context decides.",
    },
    {
      key: "taata",
      lesson: "grandparents",
      topic: "Family",
      script: "ತಾತ",
      roman: "taata",
      meaning: "Grandfather (common in southern Karnataka)",
      notes: "Used for either grandfather, alongside ಅಜ್ಜ (ajja).",
    },
    {
      key: "chikkappa",
      lesson: "grandparents",
      topic: "Family",
      script: "ಚಿಕ್ಕಪ್ಪ",
      roman: "chikkappa",
      meaning: "Father's younger brother (uncle)",
      notes: 'Literally "small father". His wife is ಚಿಕ್ಕಮ್ಮ (chikkamma).',
    },
    {
      key: "doddappa",
      lesson: "grandparents",
      topic: "Family",
      script: "ದೊಡ್ಡಪ್ಪ",
      roman: "doddappa",
      meaning: "Father's elder brother (uncle)",
      notes: 'Literally "big father". His wife is ದೊಡ್ಡಮ್ಮ (doddamma).',
    },
    {
      key: "jana",
      lesson: "people",
      topic: "People",
      script: "ಜನ",
      roman: "jana",
      meaning: "People",
      notes: "Also the counter for people: ಎಷ್ಟು ಜನ? (how many people?), ಐದು ಜನ (five people).",
    },
    {
      key: "sanna",
      lesson: "describing-people",
      topic: "Describing people",
      script: "ಸಣ್ಣ",
      roman: "sanna",
      meaning: "Thin / small",
      notes: "ಸಣ್ಣ ಆಗಿದ್ದೀಯಾ! (you've become thin!) is a common remark from relatives.",
    },
    // Food & drink
    {
      key: "saaru",
      lesson: "food-staples",
      topic: "Food",
      script: "ಸಾರು",
      roman: "saaru",
      meaning: "Saaru (thin lentil/tamarind soup, like rasam)",
      notes: "Eaten with rice in almost every Karnataka meal. ಬೇಳೆ ಸಾರು = lentil saaru.",
    },
    {
      key: "raagi-mudde",
      lesson: "food-staples",
      topic: "Food",
      words: [
        ["ರಾಗಿ", "raagi"],
        ["ಮುದ್ದೆ", "mudde"],
      ],
      meaning: "Ragi ball (finger-millet dumpling)",
      notes: "A staple of rural South Karnataka, eaten with saaru. ರಾಗಿ (raagi) = finger millet.",
    },
    {
      key: "bisibelebaath",
      lesson: "food-staples",
      topic: "Food",
      script: "ಬಿಸಿಬೇಳೆಬಾತ್",
      roman: "bisibelebaat",
      meaning: "Bisi bele bath (spiced rice-lentil dish)",
      notes:
        'Literally "hot lentil rice" — a Karnataka classic, usually served with boondi or chips.',
    },
    {
      key: "filter-coffee",
      lesson: "drinks",
      topic: "Drinks",
      words: [
        ["ಫಿಲ್ಟರ್", "filtar"],
        ["ಕಾಫಿ", "kaafi"],
      ],
      meaning: "Filter coffee",
      notes:
        "Strong coffee decoction with milk, served in a steel tumbler and dabara. Karnataka grows most of India's coffee (Chikkamagaluru, Kodagu).",
    },
    {
      key: "halasinahannu",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      script: "ಹಲಸಿನಹಣ್ಣು",
      roman: "halasinahannu",
      meaning: "Jackfruit",
      notes: "Very popular on the coast and in the Malnad region.",
    },
    {
      key: "tenginakaayi",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      script: "ತೆಂಗಿನಕಾಯಿ",
      roman: "tenginakaayi",
      meaning: "Coconut",
      notes: "Grated coconut goes into many Karnataka dishes; chutney is ತೆಂಗಿನಕಾಯಿ ಚಟ್ನಿ.",
    },
    {
      key: "hotte-tumbitu",
      lesson: "hungry-thirsty",
      topic: "Food",
      words: [
        ["ಹೊಟ್ಟೆ", "hotte"],
        ["ತುಂಬಿತು", "tumbitu"],
      ],
      meaning: "I'm full",
      notes: 'Literally "the stomach got filled". Useful when hosts keep serving!',
    },
    {
      key: "saaku",
      lesson: "hungry-thirsty",
      topic: "Food",
      script: "ಸಾಕು",
      roman: "saaku",
      meaning: "Enough",
      notes: "ಸಾಕು, ಸಾಕು! (enough, enough!) — say it firmly, with a hand over your plate.",
    },
    {
      key: "masaale-dose",
      lesson: "ordering-food",
      topic: "Restaurant",
      words: [
        ["ಮಸಾಲೆ", "masaale"],
        ["ದೋಸೆ", "dose"],
      ],
      meaning: "Masala dosa",
      notes: "Bengaluru and Mysuru are famous for it. Note the Kannada spelling ದೋಸೆ (dose).",
    },
    {
      key: "paarsel",
      lesson: "ordering-food",
      topic: "Restaurant",
      script: "ಪಾರ್ಸೆಲ್",
      roman: "paarsel",
      meaning: "Takeaway / parcel",
      notes: "ಇದನ್ನು ಪಾರ್ಸೆಲ್ ಮಾಡಿ (please pack this to take away).",
    },
    // Numbers & time
    {
      key: "ardha",
      lesson: "big-numbers",
      topic: "Numbers",
      script: "ಅರ್ಧ",
      roman: "ardha",
      meaning: "Half",
      notes:
        'ಅರ್ಧ ಗಂಟೆ (half an hour), ಅರ್ಧ ಕೆಜಿ (half a kilo). "And a half" after a number is -ಊವರೆ: ಎರಡೂವರೆ (2½).',
    },
    {
      key: "gante",
      lesson: "time",
      topic: "Time",
      script: "ಗಂಟೆ",
      roman: "gante",
      meaning: "Hour / o'clock (also: bell)",
      notes: 'ಐದು ಗಂಟೆ (five o\'clock), ಎರಡು ಗಂಟೆ ಹೊತ್ತು (two hours). "At" a time: ಐದು ಗಂಟೆಗೆ.',
    },
    {
      key: "aamele",
      lesson: "time",
      topic: "Time",
      script: "ಆಮೇಲೆ",
      roman: "aamele",
      meaning: "Later / afterwards",
      notes: "ಆಮೇಲೆ ಸಿಗೋಣ (see you later), ಆಮೇಲೆ ಏನು ಮಾಡುತ್ತೀರಿ? (what will you do after that?).",
    },
    {
      key: "naadiddu",
      lesson: "days",
      topic: "Days",
      script: "ನಾಡಿದ್ದು",
      roman: "naadiddu",
      meaning: "The day after tomorrow",
    },
    // Daily life
    {
      key: "hallujju",
      lesson: "routine-verbs",
      topic: "Daily routine",
      script: "ಹಲ್ಲುಜ್ಜು",
      roman: "hallujju",
      meaning: "To brush teeth",
      notes: "From ಹಲ್ಲು (tooth) + ಉಜ್ಜು (rub).",
    },
    {
      key: "kali",
      lesson: "activity-verbs",
      topic: "Activities",
      script: "ಕಲಿ",
      roman: "kali",
      meaning: "To learn",
      notes: 'ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ (I am learning Kannada). "To teach" is ಕಲಿಸು (kalisu).',
    },
    {
      key: "ili",
      lesson: "movement-verbs",
      topic: "Actions",
      script: "ಇಳಿ",
      roman: "ili",
      meaning: "To get down / get off (a bus)",
      notes: "ನಾನು ಇಲ್ಲಿ ಇಳಿಯಬೇಕು (I need to get off here). Getting on is ಹತ್ತು (hattu).",
    },
    {
      key: "enoo-illa",
      lesson: "what-are-you-doing",
      topic: "Conversation",
      words: [
        ["ಏನೂ", "enoo"],
        ["ಇಲ್ಲ", "illa"],
      ],
      meaning: "Nothing (much)",
      notes: "The usual answer to ಏನು ಮಾಡುತ್ತಿದ್ದೀಯ? or ಏನು ಸಮಾಚಾರ? Spoken: ಏನಿಲ್ಲ (enilla).",
    },
    // Places & directions
    {
      key: "darshini",
      lesson: "places-1",
      topic: "Places",
      script: "ದರ್ಶಿನಿ",
      roman: "darshini",
      meaning: "Darshini (quick self-service eatery)",
      notes: "A Bengaluru institution: stand-up counters serving idli, dosa and coffee.",
    },
    {
      key: "sante",
      lesson: "places-1",
      topic: "Places",
      script: "ಸಂತೆ",
      roman: "sante",
      meaning: "Weekly market / village fair",
      notes: "Held on a fixed weekday in towns and villages.",
    },
    {
      key: "anche-kacheri",
      lesson: "places-2",
      topic: "Places",
      words: [
        ["ಅಂಚೆ", "anche"],
        ["ಕಚೇರಿ", "kacheri"],
      ],
      meaning: "Post office",
      notes: "ಅಂಚೆ = post/mail; ಕಚೇರಿ = office.",
    },
    {
      key: "pakka",
      lesson: "position-words",
      topic: "Directions",
      script: "ಪಕ್ಕ",
      roman: "pakka",
      meaning: "Beside / next to",
      notes: "ಬ್ಯಾಂಕ್ ಪಕ್ಕ (next to the bank); ಪಕ್ಕದ ಮನೆ (the next house).",
    },
    {
      key: "eduru",
      lesson: "position-words",
      topic: "Directions",
      script: "ಎದುರು",
      roman: "eduru",
      meaning: "Opposite / facing",
      notes: "ದೇವಸ್ಥಾನದ ಎದುರು (opposite the temple) — very common in directions.",
    },
    {
      key: "daari",
      lesson: "asking-directions",
      topic: "Directions",
      script: "ದಾರಿ",
      roman: "daari",
      meaning: "Way / route / path",
      notes: "ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ ದಾರಿ ಯಾವುದು? (which is the way to the bus stand?).",
    },
    {
      key: "sarkal",
      lesson: "asking-directions",
      topic: "Directions",
      script: "ಸರ್ಕಲ್",
      roman: "sarkal",
      meaning: "Circle (a roundabout/junction used as a landmark)",
      notes:
        "Directions in Karnataka towns often use circles: ಸರ್ಕಲ್ ಹತ್ತಿರ ಬಲಕ್ಕೆ ತಿರುಗಿ (turn right near the circle).",
    },
    // Shopping
    {
      key: "duddu",
      lesson: "money-words",
      topic: "Shopping",
      script: "ದುಡ್ಡು",
      roman: "duddu",
      meaning: "Money (everyday word)",
      notes: "More colloquial than ಹಣ (hana): ದುಡ್ಡು ಇಲ್ಲ (I have no money).",
    },
    {
      key: "chillare",
      lesson: "money-words",
      topic: "Shopping",
      script: "ಚಿಲ್ಲರೆ",
      roman: "chillare",
      meaning: "Change (small money)",
      notes:
        "ಚಿಲ್ಲರೆ ಇದೆಯಾ? (do you have change?) — a question you'll hear from every bus conductor.",
    },
    {
      key: "jaasti",
      lesson: "money-words",
      topic: "Shopping",
      script: "ಜಾಸ್ತಿ",
      roman: "jaasti",
      meaning: "More / too much",
      notes: "Opposite of ಕಡಿಮೆ (kadime, less). ತುಂಬಾ ಜಾಸ್ತಿ (way too much).",
    },
    {
      key: "kittale",
      lesson: "colours",
      topic: "Colours",
      script: "ಕಿತ್ತಳೆ",
      roman: "kittale",
      meaning: "Orange (fruit and colour)",
      notes: "ಕಿತ್ತಳೆ ಬಣ್ಣ = orange colour; the fruit is ಕಿತ್ತಳೆ ಹಣ್ಣು.",
    },
    {
      key: "reshme-seere",
      lesson: "clothes",
      topic: "Clothes",
      words: [
        ["ರೇಷ್ಮೆ", "reshme"],
        ["ಸೀರೆ", "seere"],
      ],
      meaning: "Silk saree",
      notes: "ರೇಷ್ಮೆ = silk. Mysuru silk sarees are a Karnataka speciality.",
    },
    {
      key: "svalpa",
      lesson: "at-the-shop",
      topic: "Shopping",
      script: "ಸ್ವಲ್ಪ",
      roman: "svalpa",
      meaning: "A little / a bit",
      notes:
        "The great softener of Kannada requests: ಸ್ವಲ್ಪ ನೀರು ಕೊಡಿ, ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ, ಸ್ವಲ್ಪ ಇರಿ.",
    },
    // Travel
    {
      key: "metro",
      lesson: "vehicles",
      topic: "Transport",
      script: "ಮೆಟ್ರೋ",
      roman: "metro",
      meaning: "Metro",
      notes: 'Bengaluru\'s metro is officially ನಮ್ಮ ಮೆಟ್ರೋ (namma metro, "our metro").',
    },
    {
      key: "kandaktar",
      lesson: "travel-words",
      topic: "Travel",
      script: "ಕಂಡಕ್ಟರ್",
      roman: "kandaktar",
      meaning: "Bus conductor",
      notes: "You buy your ticket from the conductor on the bus.",
    },
    {
      key: "meetar-haaki",
      lesson: "travel-phrases",
      topic: "Travel",
      words: [
        ["ಮೀಟರ್", "meetar"],
        ["ಹಾಕಿ", "haaki"],
      ],
      meaning: "Please put the meter on (to an auto driver)",
      notes:
        'Literally "put the meter". If the driver quotes a fixed price, you can say ಮೀಟರ್ ಮೇಲೆ ಎಷ್ಟು? (how much over the meter?).',
    },
    {
      key: "ilibeku",
      lesson: "travel-phrases",
      topic: "Travel",
      words: [
        ["ನಾನು", "naanu"],
        ["ಇಲ್ಲಿ", "illi"],
        ["ಇಳಿಯಬೇಕು", "iliyabeku"],
      ],
      meaning: "I need to get off here",
      notes: '-ಬೇಕು (-beku) after a verb means "must / need to".',
    },
    // Conversations
    {
      key: "guru",
      lesson: "conv-friend",
      topic: "Conversation",
      script: "ಗುರು",
      roman: "guru",
      meaning: "Buddy / boss (Bengaluru slang)",
      notes:
        'Literally "teacher", but in Bengaluru street speech ಏನ್ ಗುರು? means "what\'s up, man?". Only with friends.',
    },
    {
      key: "granthaalaya",
      lesson: "conv-college",
      topic: "College & work",
      script: "ಗ್ರಂಥಾಲಯ",
      roman: "granthaalaya",
      meaning: "Library",
      notes: "Students usually say ಲೈಬ್ರರಿ (laibrari).",
    },
    {
      key: "vilaasa",
      lesson: "conv-help",
      topic: "Requests & help",
      script: "ವಿಳಾಸ",
      roman: "vilaasa",
      meaning: "Address",
      notes:
        "People also say ಅಡ್ರೆಸ್ (adres). Addresses in Bengaluru use main/cross numbers and landmarks.",
    },
    // Grammar
    {
      key: "avu",
      lesson: "pronouns",
      topic: "Pronouns",
      script: "ಅವು",
      roman: "avu",
      meaning: "They (things/animals)",
      notes: "For people use ಅವರು (avaru). Nearby things: ಇವು (ivu, these).",
    },
    {
      key: "taavu",
      lesson: "pronouns",
      topic: "Pronouns",
      script: "ತಾವು",
      roman: "taavu",
      meaning: "You (very formal, honorific)",
      notes:
        'Used in speeches, letters and with very respected elders: ತಾವು ಬನ್ನಿ. Everyday polite "you" is ನೀವು.',
    },
    {
      key: "nanage-gottu",
      lesson: "questions-negatives",
      topic: "Grammar",
      words: [
        ["ನನಗೆ", "nanage"],
        ["ಗೊತ್ತು", "gottu"],
      ],
      meaning: "I know",
      notes: 'Literally "to me it is known". Negative: ನನಗೆ ಗೊತ್ತಿಲ್ಲ (I don\'t know).',
    },
    // Feelings, body & health
    {
      key: "khushi",
      lesson: "feelings",
      topic: "Feelings",
      script: "ಖುಷಿ",
      roman: "khushi",
      meaning: "Happiness / joy (everyday word)",
      notes: "ತುಂಬಾ ಖುಷಿ ಆಯ್ತು (I'm so happy / that made me happy).",
    },
    {
      key: "bejaaru",
      lesson: "feelings-2",
      topic: "Feelings",
      script: "ಬೇಜಾರು",
      roman: "bejaaru",
      meaning: "Upset / bored / fed up (spoken)",
      notes: "ಬೇಜಾರ್ ಮಾಡ್ಕೋಬೇಡ (don't feel bad) is a common comforting phrase.",
    },
    {
      key: "koodalu",
      lesson: "body",
      topic: "Body",
      script: "ಕೂದಲು",
      roman: "koodalu",
      meaning: "Hair",
    },
    {
      key: "maatre",
      lesson: "health",
      topic: "Health",
      script: "ಮಾತ್ರೆ",
      roman: "maatre",
      meaning: "Tablet / pill",
    },
    {
      key: "negadi",
      lesson: "health",
      topic: "Health",
      script: "ನೆಗಡಿ",
      roman: "negadi",
      meaning: "Cold (runny nose)",
      notes: "Also ಶೀತ (sheeta). Cough = ಕೆಮ್ಮು (kemmu): ನನಗೆ ನೆಗಡಿ, ಕೆಮ್ಮು ಇದೆ.",
    },
    {
      key: "preeti",
      lesson: "love-friendship",
      topic: "Relationships",
      script: "ಪ್ರೀತಿ",
      roman: "preeti",
      meaning: "Love",
      notes: "Also a common girl's name. Affection for children and family is also ಪ್ರೀತಿ.",
    },
    // Practical
    {
      key: "bisilu",
      lesson: "weather",
      topic: "Weather",
      script: "ಬಿಸಿಲು",
      roman: "bisilu",
      meaning: "Sunshine / heat of the sun",
      notes: "ಬಿಸಿಲು ಜಾಸ್ತಿ ಇದೆ (the sun is strong).",
    },
    {
      key: "deepaavali",
      lesson: "college-work",
      topic: "Plans & invitations",
      script: "ದೀಪಾವಳಿ",
      roman: "deepaavali",
      meaning: "Deepavali (Diwali)",
      notes: "Festival of lights; a school and office holiday. Greeting: ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು.",
    },
    {
      key: "yakshagaana",
      lesson: "hobbies",
      topic: "Hobbies",
      script: "ಯಕ್ಷಗಾನ",
      roman: "yakshagaana",
      meaning: "Yakshagana (coastal Karnataka dance-drama)",
      notes: "All-night performances of epic stories with music, costumes and dance.",
    },
    {
      key: "habba",
      lesson: "plans",
      topic: "Plans & invitations",
      script: "ಹಬ್ಬ",
      roman: "habba",
      meaning: "Festival",
      notes:
        "Festival greetings use ಹಬ್ಬದ ಶುಭಾಶಯಗಳು (habbada shubhaashayagalu, festival greetings).",
    },
    {
      key: "dasaraa",
      lesson: "plans",
      topic: "Plans & invitations",
      script: "ದಸರಾ",
      roman: "dasaraa",
      meaning: "Dasara (Karnataka's state festival)",
      notes:
        "Celebrated in grand style in Mysuru, with the palace lit up and the elephant procession (ಜಂಬೂ ಸವಾರಿ).",
    },
    {
      key: "yugaadi",
      lesson: "plans",
      topic: "Plans & invitations",
      script: "ಯುಗಾದಿ",
      roman: "yugaadi",
      meaning: "Ugadi (Kannada New Year)",
      notes:
        "People eat ಬೇವು-ಬೆಲ್ಲ (bevu-bella, neem and jaggery) for the bitter and sweet of the year.",
    },
    {
      key: "sankraanti",
      lesson: "plans",
      topic: "Plans & invitations",
      script: "ಸಂಕ್ರಾಂತಿ",
      roman: "sankraanti",
      meaning: "Sankranti (harvest festival, January)",
      notes:
        "People exchange ಎಳ್ಳು-ಬೆಲ್ಲ (ellu-bella, sesame and jaggery) saying ಎಳ್ಳು ಬೆಲ್ಲ ತಿಂದು ಒಳ್ಳೆ ಮಾತಾಡಿ (eat sesame-jaggery and speak sweetly).",
    },
    {
      key: "police",
      lesson: "requests-help",
      topic: "Requests & help",
      script: "ಪೊಲೀಸ್",
      roman: "polees",
      meaning: "Police",
      notes: "Emergency number: 112. ಪೊಲೀಸ್ ಸ್ಟೇಷನ್ ಎಲ್ಲಿದೆ? (where is the police station?).",
    },
  ],
  dialogues: {
    meetingSomeone: {
      context: "Asha meets Ravi for the first time at a friend's house in Bengaluru.",
      lines: [
        { speaker: "A", script: "ನಮಸ್ಕಾರ.", roman: "namaskaara.", meaning: "Hello." },
        { speaker: "B", script: "ನಮಸ್ಕಾರ.", roman: "namaskaara.", meaning: "Hello." },
        {
          speaker: "A",
          script: "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
          roman: "nimma hesaru enu?",
          meaning: "What is your name?",
        },
        {
          speaker: "B",
          script: "ನನ್ನ ಹೆಸರು ಆಶಾ. ನಿಮ್ಮ ಹೆಸರು ಏನು?",
          roman: "nanna hesaru Asha. nimma hesaru enu?",
          meaning: "My name is Asha. What is your name?",
        },
        {
          speaker: "A",
          script: "ನನ್ನ ಹೆಸರು ರವಿ. ನೀವು ಎಲ್ಲಿಯವರು?",
          roman: "nanna hesaru Ravi. neevu elliyavaru?",
          meaning: "My name is Ravi. Where are you from?",
        },
        {
          speaker: "B",
          script: "ನಾನು ಮೈಸೂರಿನವಳು. ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿ ಸಂತೋಷವಾಯಿತು.",
          roman: "naanu maisoorinavalu. nimmannu bhetiyaagi santoshavaayitu.",
          meaning: "I am from Mysuru. Nice to meet you.",
        },
        {
          speaker: "A",
          script: "ನನಗೂ ಸಂತೋಷವಾಯಿತು.",
          roman: "nanagoo santoshavaayitu.",
          meaning: "Nice to meet you too.",
        },
      ],
    },
    meetingFriend: {
      context: "Two college friends run into each other on a street in Mysuru.",
      lines: [
        {
          speaker: "A",
          script: "ಹಾಯ್! ಹೇಗಿದ್ದೀಯ?",
          roman: "haay! hegiddeeya?",
          meaning: "Hi! How are you?",
        },
        {
          speaker: "B",
          script: "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ. ಮತ್ತೆ ನೀನು?",
          roman: "naanu chennaagiddene. matte neenu?",
          meaning: "I am fine. And you?",
        },
        {
          speaker: "A",
          script: "ನಾನೂ ಚೆನ್ನಾಗಿದ್ದೇನೆ. ನಿನ್ನನ್ನು ನೋಡಿ ತುಂಬಾ ದಿನ ಆಯಿತು!",
          roman: "naanoo chennaagiddene. ninnannu nodi tumbaa dina aayitu!",
          meaning: "I am also fine. Long time no see!",
        },
        {
          speaker: "B",
          script: "ಹೌದು. ಈಗ ಏನು ಮಾಡುತ್ತಿದ್ದೀಯ?",
          roman: "haudu. eega enu maaduttiddeeya?",
          meaning: "Yes. What are you doing these days?",
        },
        {
          speaker: "A",
          script: "ನಾನು ಓದುತ್ತಿದ್ದೇನೆ. ಊಟ ಆಯಿತಾ?",
          roman: "naanu oduttiddene. oota aayitaa?",
          meaning: "I am studying. Have you eaten?",
        },
        {
          speaker: "B",
          script: "ಹೌದು, ಊಟ ಆಯಿತು. ಬಾ, ಟೀ ಕುಡಿಯೋಣ.",
          roman: "haudu, oota aayitu. baa, tee kudiyona.",
          meaning: "Yes, I have eaten. Come, let's have tea.",
        },
        { speaker: "A", script: "ಸರಿ, ಹೋಗೋಣ.", roman: "sari, hogona.", meaning: "Okay, let's go." },
      ],
    },
    restaurant: {
      context: "Ravi orders lunch at a small restaurant (hotel) in Bengaluru.",
      lines: [
        {
          speaker: "A",
          script: "ನಿಮಗೆ ಏನು ಬೇಕು?",
          roman: "nimage enu beku?",
          meaning: "What would you like?",
        },
        {
          speaker: "B",
          script: "ಒಂದು ಪ್ಲೇಟ್ ಅನ್ನ ಸಾರು ಕೊಡಿ.",
          roman: "ondu plet anna saaru kodi.",
          meaning: "Please give me one plate of rice and saaru (lentil curry).",
        },
        {
          speaker: "A",
          script: "ಕುಡಿಯಲು ಏನಾದರೂ ಬೇಕಾ?",
          roman: "kudiyalu enaadaroo bekaa?",
          meaning: "Anything to drink?",
        },
        {
          speaker: "B",
          script: "ಒಂದು ಟೀ, ಸಕ್ಕರೆ ಹಾಕಬೇಡಿ.",
          roman: "ondu tee, sakkare haakabedi.",
          meaning: "One tea, without sugar, please.",
        },
        {
          speaker: "A",
          script: "ಸರಿ. ಇನ್ನೇನಾದರೂ ಬೇಕಾ?",
          roman: "sari. innenaadaroo bekaa?",
          meaning: "Okay. Anything else?",
        },
        {
          speaker: "B",
          script: "ಸ್ವಲ್ಪ ನೀರು ಕೊಡಿ. ಇದು ಖಾರ ಇದೆಯಾ?",
          roman: "svalpa neeru kodi. idu khaara ideyaa?",
          meaning: "Some water, please. Is it spicy?",
        },
        {
          speaker: "A",
          script: "ಸ್ವಲ್ಪ ಖಾರ ಇದೆ.",
          roman: "svalpa khaara ide.",
          meaning: "A little spicy.",
        },
        {
          speaker: "B",
          script: "ಪರವಾಗಿಲ್ಲ. ಊಟ ಆದ ಮೇಲೆ ಬಿಲ್ ಕೊಡಿ.",
          roman: "paravaagilla. oota aada mele bil kodi.",
          meaning: "That's fine. The bill, please, after the meal.",
        },
      ],
    },
    shopping: {
      context: "Asha buys mangoes from a fruit seller at a market in Bengaluru.",
      lines: [
        {
          speaker: "A",
          script: "ಮಾವಿನಹಣ್ಣು ಇದೆಯಾ?",
          roman: "maavinahannu ideyaa?",
          meaning: "Do you have mangoes?",
        },
        { speaker: "B", script: "ಹೌದು, ಇದೆ.", roman: "haudu, ide.", meaning: "Yes, we have." },
        {
          speaker: "A",
          script: "ಒಂದು ಕೆಜಿಗೆ ಎಷ್ಟು?",
          roman: "ondu kejige eshtu?",
          meaning: "How much does one kilo cost?",
        },
        {
          speaker: "B",
          script: "ನೂರು ರೂಪಾಯಿ.",
          roman: "nooru roopaayi.",
          meaning: "One hundred rupees.",
        },
        {
          speaker: "A",
          script: "ತುಂಬಾ ದುಬಾರಿ. ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ.",
          roman: "tumbaa dubaari. svalpa kadime maadi.",
          meaning: "That is too expensive. Please reduce the price a little.",
        },
        {
          speaker: "B",
          script: "ಸರಿ, ತೊಂಬತ್ತು ರೂಪಾಯಿ.",
          roman: "sari, tombattu roopaayi.",
          meaning: "Okay, ninety rupees.",
        },
        {
          speaker: "A",
          script: "ಸರಿ, ಒಂದು ಕೆಜಿ ಕೊಡಿ.",
          roman: "sari, ondu keji kodi.",
          meaning: "Fine, I will take one kilo.",
        },
      ],
    },
    directions: {
      context: "A visitor asks a passer-by the way to the railway station in Mysuru.",
      lines: [
        {
          speaker: "A",
          script: "ಕ್ಷಮಿಸಿ, ರೈಲು ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?",
          roman: "kshamisi, railu nildaana ellide?",
          meaning: "Excuse me, where is the railway station?",
        },
        {
          speaker: "B",
          script: "ನೇರವಾಗಿ ಹೋಗಿ, ಆಮೇಲೆ ಎಡಕ್ಕೆ ತಿರುಗಿ.",
          roman: "neravaagi hogi, aamele edakke tirugi.",
          meaning: "Go straight, then turn left.",
        },
        { speaker: "A", script: "ದೂರ ಇದೆಯಾ?", roman: "doora ideyaa?", meaning: "Is it far?" },
        {
          speaker: "B",
          script: "ಇಲ್ಲ, ಹತ್ತಿರ ಇದೆ. ನಡೆದುಕೊಂಡು ಹೋದರೆ ಸುಮಾರು ಐದು ನಿಮಿಷ.",
          roman: "illa, hattira ide. nadedukondu hodare sumaaru aidu nimisha.",
          meaning: "No, it is near. About five minutes on foot.",
        },
        {
          speaker: "A",
          script: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು.",
          roman: "tumbaa dhanyavaadagalu.",
          meaning: "Thank you very much.",
        },
        { speaker: "B", script: "ಪರವಾಗಿಲ್ಲ.", roman: "paravaagilla.", meaning: "You're welcome." },
      ],
    },
    college: {
      context: "A senior student meets a new student on the first day at a college in Hubballi.",
      lines: [
        {
          speaker: "A",
          script: "ಹಾಯ್, ನೀವು ಇಲ್ಲಿ ಹೊಸಬರಾ?",
          roman: "haay, neevu illi hosabaraa?",
          meaning: "Hi, are you new here?",
        },
        {
          speaker: "B",
          script: "ಹೌದು, ಇವತ್ತು ನನ್ನ ಮೊದಲ ದಿನ.",
          roman: "haudu, ivattu nanna modala dina.",
          meaning: "Yes, today is my first day.",
        },
        {
          speaker: "A",
          script: "ನೀವು ಯಾವ ವರ್ಷದಲ್ಲಿ ಇದ್ದೀರಿ?",
          roman: "neevu yaava varshadalli iddeeri?",
          meaning: "Which year are you in?",
        },
        {
          speaker: "B",
          script: "ನಾನು ಮೊದಲನೇ ವರ್ಷದಲ್ಲಿ ಇದ್ದೇನೆ. ಗ್ರಂಥಾಲಯ ಎಲ್ಲಿದೆ?",
          roman: "naanu modalane varshadalli iddene. granthaalaya ellide?",
          meaning: "I am in first year. Where is the library?",
        },
        {
          speaker: "A",
          script: "ಆಫೀಸಿನ ಹಿಂದೆ ಇದೆ. ಬನ್ನಿ, ತೋರಿಸುತ್ತೇನೆ.",
          roman: "aafeesina hinde ide. banni, torisuttene.",
          meaning: "It is behind the office. Come, I will show you.",
        },
        {
          speaker: "B",
          script: "ಧನ್ಯವಾದ! ಪರೀಕ್ಷೆ ಯಾವಾಗ?",
          roman: "dhanyavaada! pareekshe yaavaaga?",
          meaning: "Thank you! When is the exam?",
        },
        {
          speaker: "A",
          script: "ಮುಂದಿನ ತಿಂಗಳು.",
          roman: "mundina tingalu.",
          meaning: "Next month.",
        },
      ],
    },
    phoneCall: {
      context: "Ravi phones his friend to invite him home. Friends use the casual ನೀನು.",
      lines: [
        { speaker: "A", script: "ಹಲೋ?", roman: "halo?", meaning: "Hello?" },
        {
          speaker: "B",
          script: "ಹಲೋ, ಯಾರು ಮಾತನಾಡುತ್ತಿರುವುದು?",
          roman: "halo, yaaru maatanaaduttiruvudu?",
          meaning: "Hello, who is speaking?",
        },
        {
          speaker: "A",
          script: "ನಾನು, ರವಿ. ನೀನು ಎಲ್ಲಿದ್ದೀಯ?",
          roman: "naanu, Ravi. neenu elliddeeya?",
          meaning: "It's me, Ravi. Where are you?",
        },
        {
          speaker: "B",
          script: "ನಾನು ಮನೆಯಲ್ಲಿ ಇದ್ದೇನೆ. ಏನಾಯಿತು?",
          roman: "naanu maneyalli iddene. enaayitu?",
          meaning: "I am at home. What happened?",
        },
        {
          speaker: "A",
          script: "ನಾಳೆ ನೀನು ಫ್ರೀ ಇದ್ದೀಯಾ?",
          roman: "naale neenu free iddeeyaa?",
          meaning: "Are you free tomorrow?",
        },
        {
          speaker: "B",
          script: "ಹೌದು, ಫ್ರೀ ಇದ್ದೇನೆ.",
          roman: "haudu, free iddene.",
          meaning: "Yes, I am free.",
        },
        {
          speaker: "A",
          script: "ಹಾಗಾದರೆ ಸಂಜೆ ನಮ್ಮ ಮನೆಗೆ ಬಾ.",
          roman: "haagaadare sanje namma manege baa.",
          meaning: "Then come to my house in the evening.",
        },
        {
          speaker: "B",
          script: "ಸರಿ, ಬರುತ್ತೇನೆ. ಆಮೇಲೆ ಫೋನ್ ಮಾಡುತ್ತೇನೆ.",
          roman: "sari, baruttene. aamele fon maaduttene.",
          meaning: "Okay, I will come. I will call you later.",
        },
      ],
    },
    askingForHelp: {
      context: "A visitor who is lost asks a shopkeeper in Mangaluru for help with an address.",
      lines: [
        {
          speaker: "A",
          script: "ಕ್ಷಮಿಸಿ, ನನಗೆ ಸ್ವಲ್ಪ ಸಹಾಯ ಮಾಡುತ್ತೀರಾ?",
          roman: "kshamisi, nanage svalpa sahaaya maadutteeraa?",
          meaning: "Excuse me, can you help me?",
        },
        { speaker: "B", script: "ಹೌದು, ಹೇಳಿ.", roman: "haudu, heli.", meaning: "Yes, tell me." },
        {
          speaker: "A",
          script: "ನಾನು ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ. ಈ ವಿಳಾಸ ನನಗೆ ಅರ್ಥ ಆಗುತ್ತಿಲ್ಲ.",
          roman: "naanu daari tappiddene. ee vilaasa nanage artha aaguttilla.",
          meaning: "I am lost. I don't understand this address.",
        },
        {
          speaker: "B",
          script: "ತೋರಿಸಿ. ಇದು ಮಾರುಕಟ್ಟೆಯ ಹತ್ತಿರ ಇದೆ.",
          roman: "torisi. idu maarukatteya hattira ide.",
          meaning: "Show me. This is near the market.",
        },
        {
          speaker: "A",
          script: "ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.",
          roman: "dayavittu nidhaanavaagi maatanaadi.",
          meaning: "Please speak slowly.",
        },
        {
          speaker: "B",
          script: "ಮಾರುಕಟ್ಟೆಗೆ ಹೋಗಿ ಅಲ್ಲಿ ಕೇಳಿ. ಹತ್ತಿರವೇ ಇದೆ.",
          roman: "maarukattege hogi alli keli. hattirave ide.",
          meaning: "Go to the market and ask there. It is close.",
        },
        {
          speaker: "A",
          script: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು.",
          roman: "tumbaa dhanyavaadagalu.",
          meaning: "Thank you so much.",
        },
      ],
    },
    travel: {
      context: "A passenger gets on a city bus in Bengaluru and talks to the conductor.",
      lines: [
        {
          speaker: "A",
          script: "ಈ ಬಸ್ ರೈಲು ನಿಲ್ದಾಣಕ್ಕೆ ಹೋಗುತ್ತದೆಯಾ?",
          roman: "ee bas railu nildaanakke hoguttadeyaa?",
          meaning: "Does this bus go to the railway station?",
        },
        {
          speaker: "B",
          script: "ಹೌದು. ನೀವು ಎಲ್ಲಿ ಇಳಿಯಬೇಕು?",
          roman: "haudu. neevu elli iliyabeku?",
          meaning: "Yes. Where do you want to get off?",
        },
        {
          speaker: "A",
          script: "ರೈಲು ನಿಲ್ದಾಣದಲ್ಲಿ. ಟಿಕೆಟ್ ಎಷ್ಟು?",
          roman: "railu nildaanadalli. tiket eshtu?",
          meaning: "At the railway station. How much is the ticket?",
        },
        {
          speaker: "B",
          script: "ಇಪ್ಪತ್ತು ರೂಪಾಯಿ.",
          roman: "ippattu roopaayi.",
          meaning: "Twenty rupees.",
        },
        {
          speaker: "A",
          script: "ಎಷ್ಟು ಹೊತ್ತು ಆಗುತ್ತದೆ?",
          roman: "eshtu hottu aaguttade?",
          meaning: "How long will it take?",
        },
        {
          speaker: "B",
          script: "ಸುಮಾರು ಅರ್ಧ ಗಂಟೆ.",
          roman: "sumaaru ardha gante.",
          meaning: "About half an hour.",
        },
        {
          speaker: "A",
          script: "ನಿಲ್ದಾಣ ಬಂದಾಗ ದಯವಿಟ್ಟು ಹೇಳಿ.",
          roman: "nildaana bandaaga dayavittu heli.",
          meaning: "Please tell me when we reach the station.",
        },
        {
          speaker: "B",
          script: "ಸರಿ, ಹೇಳುತ್ತೇನೆ.",
          roman: "sari, heluttene.",
          meaning: "Okay, I will tell you.",
        },
      ],
    },
    dailyRoutine: {
      context: "A new acquaintance asks a college student about her day.",
      lines: [
        {
          speaker: "A",
          script: "ನೀವು ಎಷ್ಟು ಗಂಟೆಗೆ ಏಳುತ್ತೀರಿ?",
          roman: "neevu eshtu gantege elutteeri?",
          meaning: "What time do you wake up?",
        },
        {
          speaker: "B",
          script: "ನಾನು ಆರು ಗಂಟೆಗೆ ಏಳುತ್ತೇನೆ.",
          roman: "naanu aaru gantege eluttene.",
          meaning: "I wake up at six o'clock.",
        },
        {
          speaker: "A",
          script: "ಆಮೇಲೆ ಏನು ಮಾಡುತ್ತೀರಿ?",
          roman: "aamele enu maadutteeri?",
          meaning: "What do you do after that?",
        },
        {
          speaker: "B",
          script: "ಸ್ನಾನ ಮಾಡಿ, ತಿಂಡಿ ತಿಂದು ಕಾಲೇಜಿಗೆ ಹೋಗುತ್ತೇನೆ.",
          roman: "snaana maadi, tindi tindu kaalejige hoguttene.",
          meaning: "I bathe, eat breakfast and go to college.",
        },
        {
          speaker: "A",
          script: "ಮನೆಗೆ ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
          roman: "manege yaavaaga barutteeri?",
          meaning: "When do you come home?",
        },
        {
          speaker: "B",
          script: "ಸಂಜೆ ಮನೆಗೆ ಬಂದು ಓದುತ್ತೇನೆ.",
          roman: "sanje manege bandu oduttene.",
          meaning: "I come home in the evening and study.",
        },
        {
          speaker: "A",
          script: "ಯಾವಾಗ ಮಲಗುತ್ತೀರಿ?",
          roman: "yaavaaga malagutteeri?",
          meaning: "When do you sleep?",
        },
        {
          speaker: "B",
          script: "ರಾತ್ರಿ ಹತ್ತು ಗಂಟೆಗೆ ಮಲಗುತ್ತೇನೆ.",
          roman: "raatri hattu gantege malaguttene.",
          meaning: "I sleep at ten o'clock at night.",
        },
      ],
    },
  },
  lessonNotes: {
    greetings:
      "Kannada greetings are more about care than fixed formulas: ನಮಸ್ಕಾರ (namaskaara) works all day, and friends ask ಏನು ಸಮಾಚಾರ? (what's new?) or ಊಟ ಆಯಿತಾ? (have you eaten?). When leaving, say ಹೋಗಿ ಬರುತ್ತೇನೆ (I'll go and come back) rather than a final goodbye.",
    "polite-words":
      "Politeness in Kannada lives mostly in verb endings: ಕೊಡಿ (kodi) and ಬನ್ನಿ (banni) are already polite requests, while ಕೊಡು / ಬಾ are casual. ದಯವಿಟ್ಟು (please) adds extra formality.",
    "this-and-that":
      'Kannada has a near/far pair everywhere: ಈ / ಆ (this / that, before a noun), ಇದು / ಅದು (this one / that one), ಇಲ್ಲಿ / ಅಲ್ಲಿ (here / there). Simple "X is Y" sentences need no verb: ಇದು ನೀರು (this is water).',
    "how-are-you":
      "Written Kannada and spoken Kannada differ mostly in verb endings: written ಚೆನ್ನಾಗಿದ್ದೇನೆ (chennaagiddene, I am fine) is spoken ಚೆನ್ನಾಗಿದ್ದೀನಿ (chennaagiddeeni); written ಬರುತ್ತೇನೆ (I'll come) is spoken ಬರ್ತೀನಿ (barteeni). Learn the written form; you will hear the spoken one everywhere.",
    "where-from":
      "Kannada uses endings (case suffixes) instead of prepositions: -ಅಲ್ಲಿ = in (ಬೆಂಗಳೂರಿನಲ್ಲಿ, in Bengaluru), -ಗೆ / -ಕ್ಕೆ = to (ಮೈಸೂರಿಗೆ, to Mysuru; ಎಡಕ್ಕೆ, to the left), -ಇಂದ = from (ಭಾರತದಿಂದ, from India). Many nouns add a linking -ಇನ- before the ending: ಬೆಂಗಳೂರು → ಬೆಂಗಳೂರಿನಲ್ಲಿ.",
    siblings:
      'Kannada has no general word for "brother" or "sister": you must say elder or younger — ಅಣ್ಣ (anna) / ತಮ್ಮ (tamma), ಅಕ್ಕ (akka) / ತಂಗಿ (tangi). These words are also used to address strangers politely: a shopkeeper may be ಅಣ್ಣ, a young woman ಅಕ್ಕ.',
    grandparents:
      "Kannada uses ಅಜ್ಜ (ajja, also ತಾತ taata) and ಅಜ್ಜಿ (ajji) for grandparents on both sides; to be specific say ಅಮ್ಮನ ಅಪ್ಪ (mother's father) or ಅಪ್ಪನ ಅಮ್ಮ (father's mother). ಮಾವ (maava) and ಅತ್ತೆ (atte) mean mother's brother and father's sister, but also father-in-law and mother-in-law.",
    "hungry-thirsty":
      'Feelings and needs use the "dative" ending -ಗೆ on the person: ನನಗೆ ಹಸಿವಾಗಿದೆ (to me hunger has happened = I\'m hungry), ನನಗೆ ನೀರು ಬೇಕು (to me water is needed = I want water). ಬೇಕು (beku) = wanted, ಬೇಡ (beda) = not wanted.',
    "numbers-1-10":
      "Kannada has its own digits (೧ ೨ ೩ ೪ ೫ ೬ ೭ ೮ ೯ ೧೦), seen on buses and signboards, though 1, 2, 3 are used more. People are counted with special forms: ಒಬ್ಬ (one man), ಒಬ್ಬಳು (one woman), ಇಬ್ಬರು (two people), ಮೂವರು (three people). Prices and phone numbers are often said in English.",
    "what-are-you-doing":
      'The "-ing" form adds -ುತ್ತಿದ್ದ- plus a person ending: ಮಾಡುತ್ತಿದ್ದೇನೆ (I am doing), ಮಾಡುತ್ತಿದ್ದೀರಿ (you are doing), ಮಾಡುತ್ತಿದ್ದಾಳೆ (she is doing). In speech it shrinks: ಮಾಡ್ತಿದ್ದೀನಿ (maadtiddeeni).',
    pronouns:
      'Use ನೀವು (neevu) for "you" with anyone older or unfamiliar, and ನೀನು (neenu) only with close friends and children. In the third person, ಅವನು (he) and ಅವಳು (she) are for people close to you or younger; for elders use the respectful ಅವರು (avaru), which also means "they". ಅದು (adu) is "it".',
    "word-order":
      "Kannada is verb-final (subject – object – verb): ನಾನು ಅನ್ನ ತಿನ್ನುತ್ತೇನೆ = I rice eat. The verb ending shows the person: -ಏನೆ (I), -ಈಯ (you, casual), -ಈರಿ (you, polite), -ಆನೆ (he), -ಆಳೆ (she), -ಅದೆ (it), -ಏವೆ (we), -ಆರೆ (they / respectful), so the pronoun is often dropped.",
    "past-future":
      "The same present form also covers the future: ನಾನು ನಾಳೆ ಹೋಗುತ್ತೇನೆ (I will go tomorrow). The past uses its own stem plus person endings: ಹೋದೆ (I went), ಹೋದಳು (she went), ಬಂದರು (they came). The negative past is the same for everyone: ಹೋಗಲಿಲ್ಲ (didn't go).",
    "questions-negatives":
      'Yes/no questions add -ಆ to the last word: ತಿನ್ನುತ್ತೀರಾ? (do you eat?), ಪುಸ್ತಕವಾ? (is it a book?), ಇದೆಯಾ? (is there?). Formal writing uses -ಏ instead (ಇದೆಯೇ?). For "not", use ಅಲ್ಲ (alla) for "is not (that)" and ಇಲ್ಲ (illa) for "there isn\'t"; "do not / will not" is -ಉವುದಿಲ್ಲ: ತಿನ್ನುವುದಿಲ್ಲ (spoken ತಿನ್ನಲ್ಲ).',
    possession:
      'Case endings join the noun: -ಅಲ್ಲಿ (in: ಮನೆಯಲ್ಲಿ), -ಗೆ / -ಕ್ಕೆ (to: ಮನೆಗೆ, ಊಟಕ್ಕೆ), -ಇಂದ (from: ಮನೆಯಿಂದ), and ಜೊತೆ (with) follows the possessive form: ಅಮ್ಮನ ಜೊತೆ (with mother). Possessives come first: ನನ್ನ (my), ನಿಮ್ಮ (your), ಅವನ (his), ಅವಳ (her), and ಮೇಜಿನ ಮೇಲೆ = on the table ("table\'s top").',
    "polite-casual":
      "Commands have two forms: casual ಬಾ, ಕುಳಿತುಕೋ, ಹೇಳು and polite ಬನ್ನಿ, ಕುಳಿತುಕೊಳ್ಳಿ, ಹೇಳಿ (the polite one usually ends in -ಇ or -ಇರಿ). Using the casual form with an elder sounds rude, so default to the polite form with anyone you don't know well.",
    feelings:
      'Most feelings are nouns that "happen" or "come" to you, with the person in the -ಗೆ form: ನನಗೆ ಸುಸ್ತಾಗಿದೆ (I\'m tired), ನನಗೆ ಕೋಪ ಬಂದಿದೆ (I\'m angry). A few use ನಾನು + ಆಗಿದ್ದೇನೆ: ನಾನು ಸಂತೋಷವಾಗಿದ್ದೇನೆ (I am happy).',
    "love-friendship":
      "Kannada speakers express affection more through care than words: ಊಟ ಆಯಿತಾ? (have you eaten?) and ಹುಷಾರಾಗಿರಿ (take care) carry a lot of warmth. ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ (I love you) is romantic and serious; for family and friends people say ನಿನ್ನ ನೆನಪು ಆಗುತ್ತಿದೆ (I miss you) or ... ಅಂದರೆ ತುಂಬಾ ಇಷ್ಟ (I really love …).",
    weather:
      "Weather words are nouns used with ಇದೆ (is there) or ಬರು (come): ಇವತ್ತು ಚಳಿ ಇದೆ (it's cold today), ಮಳೆ ಬರುತ್ತಿದೆ (it's raining — literally \"rain is coming\").",
    plans:
      "The ending -ಓಣ means \"let's\": ಹೋಗೋಣ (let's go), ಸಿಗೋಣ (let's meet), ನೋಡೋಣ (let's see). When inviting someone home, say ನಮ್ಮ ಮನೆಗೆ ಬನ್ನಿ — Kannada calls one's home \"our house\".",
  },
};
