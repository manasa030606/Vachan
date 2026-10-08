import type { LanguageContent } from "../types.ts";

// Hindi (हिंदी) — standard spoken Hindi of Delhi / Lucknow / Jaipur / Bhopal.
// Romanization: aa, ee, oo for long vowels; nasal vowels with "n" (हूँ hoon, में mein);
// ड़ = d, ढ़ = dh, ज़ = z, फ़ = f, ख़ = kh, ग़ = g, क़ = q; ॉ (as in कॉलेज) = o. Silent final "a" is dropped.
// First-person verbs are masculine in `words`; the feminine form is always given in notes.

export const content: LanguageContent = {
  code: "hi",
  entries: {
    // First words › Greetings (lesson "greetings")
    hello: {
      script: "नमस्ते",
      roman: "namaste",
      notes:
        'Works for hello at any time of day, with folded hands for elders. Add जी (jee) for extra respect: नमस्ते जी (namaste jee). नमस्कार (namaskaar) is more formal; friends often just say "hi" or "hello".',
    },
    goodbye: {
      script: "अलविदा",
      roman: "alvidaa",
      notes:
        'अलविदा sounds final and dramatic (a long farewell, as in films). In everyday life people say नमस्ते (namaste) again, फिर मिलेंगे (phir milenge, see you again), "bye", or चलता हूँ (chaltaa hoon, I\'m off). A woman says चलती हूँ (chaltee hoon).',
    },
    seeYouLater: {
      words: [
        ["फिर", "phir"],
        ["मिलेंगे", "milenge"],
      ],
      notes:
        'Literally "(we) will meet again". Very common and works with anyone. Friends also say "bye" or बाद में मिलते हैं (baad mein milte hain, see you later).',
    },
    goodMorning: {
      words: [["सुप्रभात", "suprabhaat"]],
      notes:
        'सुप्रभात is the formal/written word (messages, announcements, school assemblies). In person most people simply say नमस्ते (namaste) or English "good morning".',
    },
    goodNight: {
      words: [
        ["शुभ", "shubh"],
        ["रात्रि", "raatri"],
      ],
      notes:
        'Formal, literally "auspicious night". In speech people usually say English "good night", or चलो, सो जाओ (chalo, so jaao, okay, go to sleep) to family.',
    },
    thankYou: {
      script: "धन्यवाद",
      roman: "dhanyavaad",
      notes:
        'Polite standard word. शुक्रिया (shukriyaa) is equally common and a little warmer; "thank you" / "thanks" is used a lot too. Among close family thanking can feel too formal.',
    },
    welcome: {
      script: "स्वागत",
      roman: "svaagat",
      notes:
        'Means "welcome / reception". To welcome a guest: आपका स्वागत है (aapkaa svaagat hai, you are welcome here) or simply आइए, आइए! (aaiye, aaiye, come in, come in!).',
    },
    // First words › Yes, no & polite words (lesson "polite-words")
    yes: {
      script: "हाँ",
      roman: "haan",
      notes:
        "Polite: जी हाँ (jee haan) or just जी (jee). Casual: हाँ or हम्म. Also used: अच्छा (achchhaa, okay/I see).",
    },
    no: {
      script: "नहीं",
      roman: "nahin",
      notes:
        "Polite: जी नहीं (jee nahin). नहीं also makes sentences negative: मैं नहीं जानता (main nahin jaantaa, I don't know). In commands use मत (mat): मत जाओ (mat jaao, don't go).",
    },
    please: {
      script: "कृपया",
      roman: "kripyaa",
      notes:
        'कृपया is formal (signs, announcements, polite requests). In speech politeness mostly comes from the verb ending -इए (-iye): पानी दीजिए (paani deejiye, please give water). English "please" (प्लीज़, pleez) is also common.',
    },
    sorry: {
      script: "माफ़ कीजिए",
      roman: "maaf keejiye",
      notes:
        'Literally "please forgive". Casual: माफ़ करना (maaf karnaa) or माफ़ करो (maaf karo). Very formal: क्षमा कीजिए (kshamaa keejiye). English "sorry" is used all the time in cities.',
    },
    excuseMe: {
      words: [["सुनिए", "suniye"]],
      notes:
        'Literally "please listen" — the normal way to get a stranger\'s attention. To squeeze past someone say ज़रा रास्ता दीजिए (zaraa raastaa deejiye, please make a little way). English "excuse me" is also understood.',
    },
    okay: {
      script: "ठीक है",
      roman: "theek hai",
      notes:
        'Literally "it is fine". Also very common: अच्छा (achchhaa) and English "okay". Said as a question, ठीक है? means "alright?".',
    },
    noProblem: {
      words: [
        ["कोई", "koee"],
        ["दिक्कत", "dikkat"],
        ["नहीं", "nahin"],
      ],
      notes:
        'Literally "no difficulty". People also say कोई बात नहीं (koee baat nahin, never mind) — the most common reply to "sorry" — and कोई प्रॉब्लम नहीं (koee problam nahin).',
    },
    youreWelcome: {
      words: [
        ["कोई", "koee"],
        ["बात", "baat"],
        ["नहीं", "nahin"],
        ["जी", "jee"],
      ],
      notes:
        'Literally "it\'s nothing" with polite जी. This is the natural reply to धन्यवाद. आपका स्वागत है (aapkaa svaagat hai) is a formal, English-style reply used in customer service. Friends say अरे, कोई बात नहीं (are, koee baat nahin) or "welcome".',
    },
    // First words › Everyday things (lesson "things")
    water: {
      script: "पानी",
      roman: "paani",
      notes:
        "Masculine noun: पानी ठंडा है (paani thandaa hai, the water is cold). Formal/Sanskrit word: जल (jal).",
    },
    food: {
      script: "खाना",
      roman: "khaanaa",
      notes:
        'खाना is both "food" and the verb "to eat": खाना खाना (khaanaa khaanaa) = to eat food. भोजन (bhojan) is the formal word you see on signs.',
    },
    house: {
      script: "घर",
      roman: "ghar",
      notes: "घर is home/house. मकान (makaan) is the building; घर पर (ghar par) = at home.",
    },
    book: {
      script: "किताब",
      roman: "kitaab",
      notes: "Feminine: मेरी किताब (meree kitaab, my book). Formal word: पुस्तक (pustak).",
    },
    phone: {
      script: "फ़ोन",
      roman: "fon",
      notes:
        "Everyone says फ़ोन or मोबाइल (mobaail). फ़ोन करना (fon karnaa) = to call. The Hindi word दूरभाष (doorbhaash) is only seen in official writing.",
    },
    bag: {
      script: "बैग",
      roman: "baig",
      notes:
        "English loanword. A cloth or shopping bag is थैला (thailaa); a small plastic bag is थैली (thailee).",
    },
    pen: {
      script: "पेन",
      roman: "pen",
      notes:
        "People say पेन. The Hindi word कलम (kalam) is also understood, especially for writing in general.",
    },
    money: {
      script: "पैसे",
      roman: "paise",
      notes:
        "पैसा (paisaa) is money / one paisa; in speech the plural पैसे is used for money: मेरे पास पैसे नहीं हैं (mere paas paise nahin hain, I have no money). Also रुपये (rupaye, rupees).",
    },
    // First words › Common actions (lesson "actions")
    come: {
      script: "आना",
      roman: "aanaa",
      notes:
        "Dictionary form (infinitive) ends in -ना. आओ (aao, come — casual), आइए (aaiye, please come — polite).",
    },
    go: {
      script: "जाना",
      roman: "jaanaa",
      notes:
        "जाओ (jaao, go — casual), जाइए (jaaiye, please go — polite). मैं जाता हूँ (main jaataa hoon, I go); a woman says मैं जाती हूँ (main jaatee hoon).",
    },
    eat: {
      script: "खाना खाना",
      roman: "khaanaa khaanaa",
      meaning: "To eat (a meal)",
      accept: ["eat", "to eat", "eat food", "to eat food"],
      notes:
        'The verb "to eat" is खाना (khaanaa) — the same word as "food" — so "to eat a meal" is खाना खाना. With other food just use the verb: आम खाना (aam khaanaa, to eat a mango).',
    },
    drink: {
      script: "पीना",
      roman: "peenaa",
      notes:
        'पानी पीना (paani peenaa, to drink water). Note: in Hindi you also "drink" tea and even cigarettes: चाय पीना.',
    },
    see: {
      script: "देखना",
      roman: "dekhnaa",
      notes:
        'Also "to watch" and "to look": देखो! (dekho, look!), फ़िल्म देखना (film dekhnaa, to watch a film).',
    },
    give: {
      script: "देना",
      roman: "denaa",
      notes:
        'दीजिए (deejiye) is the polite "please give" — the most useful word for shopping and ordering: एक चाय दीजिए (ek chaay deejiye).',
    },
    take: {
      script: "लेना",
      roman: "lenaa",
      notes: "लीजिए (leejiye) = please take / here you are, used when offering something.",
    },
    doVerb: {
      script: "करना",
      roman: "karnaa",
      notes:
        "Very common helper verb: काम करना (kaam karnaa, to work), फ़ोन करना (fon karnaa, to call), मदद करना (madad karnaa, to help).",
    },
    // First words › This, that & questions (lesson "this-and-that")
    this: {
      script: "यह",
      roman: "yah",
      notes:
        'Written यह but usually pronounced ये (ye). Also means "he/she/it" for someone or something near.',
    },
    that: {
      script: "वह",
      roman: "vah",
      notes:
        'Written वह but usually pronounced वो (vo). It also means "he", "she" and "it" for someone or something further away.',
    },
    here: {
      script: "यहाँ",
      roman: "yahaan",
      notes: "Also इधर (idhar, this way / over here). यहीं (yaheen) = right here.",
    },
    there: {
      script: "वहाँ",
      roman: "vahaan",
      notes: "Also उधर (udhar, that way / over there). वहीं (vaheen) = right there.",
    },
    what: {
      script: "क्या",
      roman: "kyaa",
      notes:
        "क्या at the start of a sentence also turns it into a yes/no question: क्या आप ठीक हैं? (kyaa aap theek hain?, are you okay?).",
    },
    who: { script: "कौन", roman: "kaun" },
    whatIsThis: {
      words: [
        ["यह", "yah"],
        ["क्या", "kyaa"],
        ["है?", "hai?"],
      ],
      notes:
        'Spoken: ये क्या है? (ye kyaa hai?). Literally "this what is?" — the question word sits where the answer goes.',
    },
    whoIsThis: {
      words: [
        ["यह", "yah"],
        ["कौन", "kaun"],
        ["है?", "hai?"],
      ],
      notes:
        "Fine for a child or a friend. About an adult, respectful Hindi uses the plural: ये कौन हैं? (ye kaun hain?).",
    },
    thisIsWater: {
      words: [
        ["यह", "yah"],
        ["पानी", "paani"],
        ["है", "hai"],
      ],
      blank: 1,
      notes: 'Hindi puts the verb है (hai, is) at the end: "this water is".',
    },
    // Introducing yourself › My name is… (lesson "my-name")
    name: { script: "नाम", roman: "naam" },
    iPronoun: {
      script: "मैं",
      roman: "main",
      notes:
        'The "n" just marks a nasal vowel — say "meh" through the nose. Hindi verbs change with the speaker\'s gender: मैं जाता हूँ (man) / मैं जाती हूँ (woman).',
    },
    youFormal: {
      script: "आप",
      roman: "aap",
      notes:
        'The polite "you" for strangers, elders, teachers and anyone you respect. Verbs take plural forms even for one person: आप कैसे हैं? (to a woman: आप कैसी हैं?). Casual forms are तुम (tum, friends, younger people) and तू (too, very intimate or rude).',
    },
    my: {
      script: "मेरा",
      roman: "meraa",
      notes:
        "Changes with the thing owned: मेरा भाई (meraa bhaaee, my brother), मेरी बहन (meree bahan, my sister), मेरे पिताजी (mere pitaajee, my father — respect/plural).",
    },
    yourFormal: {
      script: "आपका",
      roman: "aapkaa",
      notes:
        'Polite "your": आपका / आपकी / आपके, agreeing with the thing owned. Casual: तुम्हारा (tumhaaraa).',
    },
    myNameIs: {
      words: [
        ["मेरा", "meraa"],
        ["नाम", "naam"],
        ["आशा", "Asha"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "my name Asha is". Also: मैं आशा हूँ (main Asha hoon, I am Asha). नाम is masculine, so it is मेरा नाम for everyone.',
    },
    whatIsYourName: {
      words: [
        ["आपका", "aapkaa"],
        ["नाम", "naam"],
        ["क्या", "kyaa"],
        ["है?", "hai?"],
      ],
      notes:
        "Polite. To a child or friend: तुम्हारा नाम क्या है? (tumhaaraa naam kyaa hai?). Very formal/old-fashioned: आपका शुभ नाम? (aapkaa shubh naam?).",
    },
    // Introducing yourself › How are you? (lesson "how-are-you")
    howAreYou: {
      words: [
        ["आप", "aap"],
        ["कैसे", "kaise"],
        ["हैं?", "hain?"],
      ],
      notes:
        "To a woman: आप कैसी हैं? (aap kaisee hain?). To a friend: तुम कैसे हो? (tum kaise ho?). Also very common: क्या हाल है? (kyaa haal hai?, how are things?).",
    },
    iAmFine: {
      words: [
        ["मैं", "main"],
        ["ठीक", "theek"],
        ["हूँ", "hoon"],
      ],
      notes:
        "ठीक does not change, so men and women say the same. Warmer: मैं बढ़िया हूँ (main badhiyaa hoon, I'm great).",
    },
    andYou: {
      words: [
        ["और", "aur"],
        ["आप?", "aap?"],
      ],
      notes:
        'Casual: और तुम? (aur tum?). Friends often say तुम सुनाओ? (tum sunaao?, "you tell me").',
    },
    veryGood: {
      words: [
        ["बहुत", "bahut"],
        ["अच्छा", "achchhaa"],
      ],
      notes:
        'Also बहुत बढ़िया (bahut badhiyaa, really great). अच्छा alone also means "okay / I see".',
    },
    iAmAlsoFine: {
      words: [
        ["मैं", "main"],
        ["भी", "bhee"],
        ["ठीक", "theek"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "भी (bhee) = also/too, placed right after the word it adds to.",
    },
    // Introducing yourself › Where are you from? (lesson "where-from")
    whereAreYouFrom: {
      words: [
        ["आप", "aap"],
        ["कहाँ", "kahaan"],
        ["से", "se"],
        ["हैं?", "hain?"],
      ],
      notes: 'Literally "you where from are?". Casual: तुम कहाँ से हो? (tum kahaan se ho?).',
    },
    iAmFromIndia: {
      words: [
        ["मैं", "main"],
        ["भारत", "bhaarat"],
        ["से", "se"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "से (se) = from, and it comes after the place. Same for men and women.",
    },
    india: {
      script: "भारत",
      roman: "bhaarat",
      notes: 'Also हिंदुस्तान (hindustaan) and English "India" (इंडिया), all common.',
    },
    city: {
      script: "शहर",
      roman: "shahar",
      notes: 'Pronounced almost like "shehar". नगर (nagar) is formal and appears in place names.',
    },
    village: { script: "गाँव", roman: "gaanv" },
    country: { script: "देश", roman: "desh" },
    whereDoYouLive: {
      words: [
        ["आप", "aap"],
        ["कहाँ", "kahaan"],
        ["रहते", "rahte"],
        ["हैं?", "hain?"],
      ],
      notes:
        "To a woman: आप कहाँ रहती हैं? (aap kahaan rahtee hain?). Casual: तुम कहाँ रहते हो? (tum kahaan rahte ho?).",
    },
    iLiveInCity: {
      words: [
        ["मैं", "main"],
        ["दिल्ली", "Dillee"],
        ["में", "mein"],
        ["रहता", "rahtaa"],
        ["हूँ", "hoon"],
      ],
      meaning: "I live in Delhi.",
      blank: 1,
      notes:
        "A woman says: मैं दिल्ली में रहती हूँ (main Dillee mein rahtee hoon). में (mein) = in, after the place.",
    },
    // Introducing yourself › Nice to meet you (lesson "nice-to-meet-you")
    niceToMeetYou: {
      words: [
        ["आपसे", "aapse"],
        ["मिलकर", "milkar"],
        ["अच्छा", "achchhaa"],
        ["लगा", "lagaa"],
      ],
      notes:
        'Literally "having met you, (it) felt good" — same for men and women. Reply: मुझे भी (mujhe bhee, me too).',
    },
    iAmAStudent: {
      words: [
        ["मैं", "main"],
        ["छात्र", "chhaatr"],
        ["हूँ", "hoon"],
      ],
      notes:
        "A woman says: मैं छात्रा हूँ (main chhaatraa hoon). Gender-neutral: मैं विद्यार्थी हूँ (main vidyaarthee hoon). Many people simply say मैं स्टूडेंट हूँ.",
    },
    iAmLearningLanguage: {
      words: [
        ["मैं", "main"],
        ["हिंदी", "hindee"],
        ["सीख", "seekh"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      meaning: "I am learning Hindi.",
      blank: 1,
      notes:
        "A woman says: मैं हिंदी सीख रही हूँ (main hindee seekh rahee hoon). सीखना (seekhnaa) = to learn.",
    },
    iSpeakALittle: {
      words: [
        ["मैं", "main"],
        ["थोड़ी", "thodee"],
        ["हिंदी", "hindee"],
        ["बोलता", "boltaa"],
        ["हूँ", "hoon"],
      ],
      meaning: "I speak a little Hindi.",
      notes:
        'A woman says: मैं थोड़ी हिंदी बोलती हूँ. Very natural and gender-neutral: मुझे थोड़ी हिंदी आती है (mujhe thodee hindee aatee hai, literally "a little Hindi comes to me").',
    },
    student: {
      script: "छात्र",
      roman: "chhaatr",
      notes: "Female: छात्रा (chhaatraa). Also विद्यार्थी (vidyaarthee) and English स्टूडेंट.",
    },
    teacher: {
      script: "शिक्षक",
      roman: "shikshak",
      notes:
        "Female: शिक्षिका (shikshikaa). Also अध्यापक (adhyaapak). Students usually say टीचर or address teachers as सर (sar) / मैडम (maidam); मास्टर जी (maastar jee) in small towns.",
    },
    // Introducing yourself › I don't understand (lesson "understanding")
    iUnderstand: {
      words: [
        ["मैं", "main"],
        ["समझ", "samajh"],
        ["गया", "gayaa"],
      ],
      notes:
        'Literally "I have understood / got it". A woman says: मैं समझ गई (main samajh gaee). Gender-neutral: समझ आ गया (samajh aa gayaa).',
    },
    iDontUnderstand: {
      words: [
        ["मुझे", "mujhe"],
        ["समझ", "samajh"],
        ["नहीं", "nahin"],
        ["आया", "aayaa"],
      ],
      notes:
        'Literally "understanding did not come to me" — the same for men and women. Also: मैं समझा नहीं (main samjhaa nahin); a woman: मैं समझी नहीं.',
    },
    pleaseRepeat: {
      words: [
        ["फिर", "phir"],
        ["से", "se"],
        ["बोलिए", "boliye"],
      ],
      notes:
        'Literally "say again". Softer: एक बार फिर से बोलिए (ek baar phir se boliye, say it once more). To a friend: फिर से बोलो (phir se bolo). A quick "pardon?" is जी? (jee?).',
    },
    speakSlowly: {
      words: [
        ["थोड़ा", "thodaa"],
        ["धीरे", "dheere"],
        ["बोलिए", "boliye"],
      ],
      notes:
        'Literally "speak a little slowly". Casual: थोड़ा धीरे बोलो (thodaa dheere bolo). Also धीरे-धीरे (dheere-dheere, slowly).',
    },
    whatDoesThisMean: {
      words: [
        ["इसका", "iskaa"],
        ["मतलब", "matlab"],
        ["क्या", "kyaa"],
        ["है?", "hai?"],
      ],
      notes: 'Literally "its meaning what is?". Formal word for meaning: अर्थ (arth).',
    },
    doYouSpeakEnglish: {
      words: [
        ["क्या", "kyaa"],
        ["आप", "aap"],
        ["अंग्रेज़ी", "angrezee"],
        ["बोलते", "bolte"],
        ["हैं?", "hain?"],
      ],
      notes:
        "To a woman: क्या आप अंग्रेज़ी बोलती हैं? Many people say इंग्लिश (inglish) instead of अंग्रेज़ी. Also: आपको अंग्रेज़ी आती है? (do you know English?).",
    },
    howDoYouSay: {
      words: [
        ["इसे", "ise"],
        ["हिंदी", "hindee"],
        ["में", "mein"],
        ["क्या", "kyaa"],
        ["कहते", "kahte"],
        ["हैं?", "hain?"],
      ],
      meaning: "How do you say this in Hindi?",
      notes:
        'Literally "what do (people) call this in Hindi?". To ask about an English word: "water" को हिंदी में क्या कहते हैं?',
    },
    // Family & people › Parents & children (lesson "parents-children")
    mother: {
      script: "माँ",
      roman: "maa",
      notes:
        "Also मम्मी (mammee, mum — very common in cities), माता जी (maataa jee, respectful), अम्मा (ammaa).",
    },
    father: {
      script: "पिता",
      roman: "pitaa",
      notes:
        "पिता is the standard word. When talking about or to your father people say पापा (paapaa), पिताजी (pitaajee, respectful) or बाबूजी (baaboojee, traditional).",
    },
    parents: {
      script: "माता-पिता",
      roman: "maataa-pitaa",
      notes:
        'Everyday: मम्मी-पापा (mammee-paapaa). Also घरवाले (gharvaale, "the people at home", family).',
    },
    son: {
      script: "बेटा",
      roman: "betaa",
      notes: "Elders also call any boy or young man बेटा affectionately — and often girls too.",
    },
    daughter: { script: "बेटी", roman: "betee" },
    child: {
      script: "बच्चा",
      roman: "bachchaa",
      notes:
        "बच्चा (boy/child), बच्ची (bachchee, girl), बच्चे (bachche, children — also the polite general plural).",
    },
    family: {
      script: "परिवार",
      roman: "parivaar",
      notes: "Also घर-परिवार (ghar-parivaar) and घरवाले (gharvaale, family members).",
    },
    // Family & people › Brothers, sisters & partners (lesson "siblings")
    elderBrother: {
      script: "बड़ा भाई",
      roman: "badaa bhaaee",
      notes:
        "You call him भैया (bhaiyaa) or भाई साहब (bhaaee saahab, respectful). भैया is also how you politely address shopkeepers and drivers.",
    },
    youngerBrother: {
      script: "छोटा भाई",
      roman: "chhotaa bhaaee",
      notes: "You call him by his name. छोटा (chhotaa) = small/younger.",
    },
    elderSister: {
      script: "बड़ी बहन",
      roman: "badee bahan",
      notes:
        "You call her दीदी (deedee). Strangers (an older girl or young woman) can also be addressed as दीदी.",
    },
    youngerSister: {
      script: "छोटी बहन",
      roman: "chhotee bahan",
      notes: 'बहन is pronounced almost like "behen". बड़ी/छोटी agree with the feminine बहन.',
    },
    husband: {
      script: "पति",
      roman: "pati",
      notes:
        'Traditionally many women avoid saying their husband\'s name; they say "ये" (ye) or "इनके पापा" (the children\'s father). Cities: हसबैंड.',
    },
    wife: {
      script: "पत्नी",
      roman: "patnee",
      notes:
        "Also घरवाली (gharvaalee, colloquial) and बीवी (beevee, everyday but informal). Cities: वाइफ़.",
    },
    // Family & people › Grandparents & relatives (lesson "grandparents")
    grandfatherPaternal: {
      script: "दादा",
      roman: "daadaa",
      notes: "Respectful: दादाजी (daadaajee). Father's side: दादा/दादी; mother's side: नाना/नानी.",
    },
    grandmotherPaternal: {
      script: "दादी",
      roman: "daadee",
      notes: "Respectful: दादीजी (daadeejee). Also दादी माँ (daadee maa).",
    },
    grandfatherMaternal: {
      script: "नाना",
      roman: "naanaa",
      notes:
        "Respectful: नानाजी (naanaajee). The mother's parents' home is ननिहाल (nanihaal), a favourite summer-holiday place.",
    },
    grandmotherMaternal: {
      script: "नानी",
      roman: "naanee",
      notes:
        'Respectful: नानीजी (naaneejee). नानी याद आ जाना ("to remember grandma") is an idiom for being in great trouble.',
    },
    uncleMaternal: {
      script: "मामा",
      roman: "maamaa",
      notes:
        "Mother's brother; his wife is मामी (maamee). Father's younger brother is चाचा (chaachaa), father's elder brother is ताऊ (taaoo).",
    },
    auntPaternal: {
      script: "बुआ",
      roman: "buaa",
      notes: "Father's sister; her husband is फूफा (phoophaa). Mother's sister is मौसी (mausee).",
    },
    // Family & people › People (lesson "people")
    man: {
      script: "आदमी",
      roman: "aadmee",
      notes:
        'Formal: पुरुष (purush). आदमी can also mean "person" in general. Politely you\'d say ये सज्जन (ye sajjan, this gentleman).',
    },
    woman: {
      script: "औरत",
      roman: "aurat",
      notes:
        'महिला (mahilaa) is the polite/formal word (signs, news, "ladies"). Also स्त्री (stree).',
    },
    boy: { script: "लड़का", roman: "ladkaa" },
    girl: { script: "लड़की", roman: "ladkee" },
    friend: {
      script: "दोस्त",
      roman: "dost",
      notes:
        "Used for both genders. A woman's female friend is often सहेली (sahelee). Formal: मित्र (mitr). Friends call each other यार (yaar, buddy).",
    },
    neighbour: {
      script: "पड़ोसी",
      roman: "padosee",
      notes: "Female neighbour: पड़ोसन (padosan). Neighbourhood: पड़ोस (pados).",
    },
    person: {
      script: "व्यक्ति",
      roman: "vyakti",
      notes:
        "Formal/neutral. In speech people say आदमी (aadmee), इंसान (insaan, human being) or बंदा (bandaa, guy). People in general: लोग (log).",
    },
    doctor: {
      script: "डॉक्टर",
      roman: "doktar",
      notes:
        "Everyone says डॉक्टर; address as डॉक्टर साहब (doktar saahab). Hindi word: चिकित्सक (chikitsak); traditional healer: वैद्य (vaidya).",
    },
    // Family & people › Describing people (lesson "describing-people")
    tall: {
      script: "लंबा",
      roman: "lambaa",
      notes:
        'Changes with gender/number: लंबा लड़का, लंबी लड़की (lambee ladkee), लंबे लोग (lambe log). Also means "long".',
    },
    short: {
      script: "नाटा",
      roman: "naataa",
      notes:
        "नाटा can sound blunt; the polite way is छोटे कद का (chhote kad kaa, of short height). Feminine: नाटी (naatee).",
    },
    good: {
      script: "अच्छा",
      roman: "achchhaa",
      notes:
        'अच्छा / अच्छी / अच्छे agree with the noun. Alone, अच्छा! means "I see / okay". Also बढ़िया (badhiyaa, great).',
    },
    beautiful: {
      script: "सुंदर",
      roman: "sundar",
      notes:
        "Does not change for gender. Also ख़ूबसूरत (khoobsoorat) and प्यारा (pyaaraa, lovely/cute).",
    },
    young: {
      script: "जवान",
      roman: "javaan",
      notes: "Also means a soldier. For children use छोटा (chhotaa, small/little).",
    },
    old: {
      script: "बूढ़ा",
      roman: "boodhaa",
      notes:
        'Can sound rude about a person; respectful: बुज़ुर्ग (buzurg, elderly). Feminine: बूढ़ी (boodhee). For things "old" is पुराना (puraanaa).',
    },
    kind: {
      script: "दयालु",
      roman: "dayaalu",
      notes:
        "Everyday praise: बहुत अच्छे इंसान हैं (bahut achchhe insaan hain, a very good person).",
    },
    thisIsMyMother: {
      words: [
        ["ये", "ye"],
        ["मेरी", "meree"],
        ["माँ", "maa"],
        ["हैं", "hain"],
      ],
      blank: 2,
      notes:
        "Elders get the respectful plural ये ... हैं (ye ... hain), not यह ... है. मेरी is feminine to agree with माँ.",
    },
    heIsMyFriend: {
      words: [
        ["वह", "vah"],
        ["मेरा", "meraa"],
        ["दोस्त", "dost"],
        ["है", "hai"],
      ],
      blank: 2,
      notes:
        "Spoken: वो मेरा दोस्त है (vo meraa dost hai). About a female friend: वह मेरी दोस्त है (meree) or वह मेरी सहेली है.",
    },
    sheIsMySister: {
      words: [
        ["वह", "vah"],
        ["मेरी", "meree"],
        ["बड़ी", "badee"],
        ["बहन", "bahan"],
        ["हैं", "hain"],
      ],
      blank: 3,
      notes:
        "हैं (plural) shows respect for an elder sister; careful written Hindi uses वे: वे मेरी बड़ी बहन हैं. Very common: वो मेरी दीदी हैं (vo meree deedee hain). For a younger sister: वह मेरी छोटी बहन है.",
    },
    myFatherIsADoctor: {
      words: [
        ["मेरे", "mere"],
        ["पिताजी", "pitaajee"],
        ["डॉक्टर", "doktar"],
        ["हैं", "hain"],
      ],
      notes:
        "Respect for a father: मेरे (not मेरा) and हैं (not है). Casual: मेरे पापा डॉक्टर हैं.",
    },
    // Family & people › Family review (lesson "family-review")
    howManyBrothers: {
      words: [
        ["आपके", "aapke"],
        ["कितने", "kitne"],
        ["भाई", "bhaaee"],
        ["हैं?", "hain?"],
      ],
      notes:
        'Literally "your how-many brothers are?" — Hindi has no verb "to have" for family. Sisters: आपकी कितनी बहनें हैं? (aapkee kitnee bahnen hain?).',
    },
    iHaveOneBrother: {
      words: [
        ["मेरा", "meraa"],
        ["एक", "ek"],
        ["छोटा", "chhotaa"],
        ["भाई", "bhaaee"],
        ["है", "hai"],
      ],
      blank: 2,
      notes: 'Literally "my one younger brother is". Same for men and women.',
    },
    iHaveTwoSisters: {
      words: [
        ["मेरी", "meree"],
        ["दो", "do"],
        ["बहनें", "bahnen"],
        ["हैं", "hain"],
      ],
      notes: "बहन → बहनें (bahnen) in the plural, and मेरी stays feminine.",
    },
    // Food & drinks › Everyday food (lesson "food-staples")
    rice: {
      script: "चावल",
      roman: "chaaval",
      notes:
        "Usually treated as plural: चावल बन गए (the rice is cooked). Cooked rice is also called भात (bhaat) in some homes.",
    },
    roti: {
      script: "रोटी",
      roman: "rotee",
      notes:
        "Also चपाती (chapaatee) and फुलका (phulkaa, a puffed thin roti). Thick and buttery in Punjab and Delhi; बाटी (baatee) in Rajasthan.",
    },
    dal: {
      script: "दाल",
      roman: "daal",
      notes:
        "Every home has a daily दाल: अरहर (arhar, yellow pigeon pea), मूंग (moong), मसूर (masoor). Famous idiom: दाल में कुछ काला है (something is fishy).",
    },
    vegetables: {
      script: "सब्ज़ी",
      roman: "sabzee",
      notes:
        "Means both raw vegetables and a cooked vegetable dish. Often written सब्जी without the dot.",
    },
    curd: {
      script: "दही",
      roman: "dahee",
      notes:
        "Masculine in standard Hindi: दही खट्टा है (the curd is sour), though many speakers make it feminine.",
    },
    salt: { script: "नमक", roman: "namak" },
    sugar: {
      script: "चीनी",
      roman: "cheenee",
      notes: "Also शक्कर (shakkar). In tea stalls: चीनी कम (cheenee kam, less sugar).",
    },
    sweets: {
      script: "मिठाई",
      roman: "mithaaee",
      notes:
        'Sweets are given on every happy occasion: मुँह मीठा कीजिए (munh meethaa keejiye, "sweeten your mouth", please have a sweet).',
    },
    // Food & drinks › Drinks (lesson "drinks")
    tea: {
      script: "चाय",
      roman: "chaay",
      notes: "Feminine: चाय गरम है. Strong tea is कड़क चाय (kadak chaay); masala tea is मसाला चाय.",
    },
    coffee: { script: "कॉफ़ी", roman: "kofee" },
    milk: { script: "दूध", roman: "doodh" },
    juice: {
      script: "जूस",
      roman: "joos",
      notes:
        "Everyday loanword. Hindi word: रस (ras), e.g. गन्ने का रस (ganne kaa ras, sugarcane juice).",
    },
    buttermilk: {
      script: "छाछ",
      roman: "chhaachh",
      notes:
        "Also मट्ठा (matthaa). Different from लस्सी (lassee), the thick sweet or salty yogurt drink.",
    },
    coconutWater: {
      script: "नारियल पानी",
      roman: "naariyal paani",
      notes:
        'Literally "coconut water". Sold by the roadside from green coconuts, especially in summer.',
    },
    // Food & drinks › Fruits, vegetables & more (lesson "fruits-vegetables")
    fruit: {
      script: "फल",
      roman: "phal",
      notes: 'Pronounce फ as an aspirated p ("p-hal"), not f. Fruit seller: फलवाला (phalvaalaa).',
    },
    banana: { script: "केला", roman: "kelaa" },
    mango: {
      script: "आम",
      roman: "aam",
      notes:
        'Famous varieties of the North: दशहरी (dashaharee, from near Lucknow), लंगड़ा (langdaa), चौसा (chausaa). आम also means "common/ordinary".',
    },
    apple: { script: "सेब", roman: "seb" },
    onion: {
      script: "प्याज़",
      roman: "pyaaz",
      notes:
        'Often written प्याज. Gender varies by region: प्याज़ महँगा हो गया (masculine, the usual form in news) or प्याज़ महँगी हो गई (feminine, common in speech) — both mean "onions have become expensive".',
    },
    tomato: { script: "टमाटर", roman: "tamaatar" },
    potato: {
      script: "आलू",
      roman: "aaloo",
      notes: "Found in countless dishes: आलू-गोभी, आलू पराठा, समोसा.",
    },
    egg: { script: "अंडा", roman: "andaa", notes: "Plural अंडे (ande). Egg curry: अंडा करी." },
    fish: { script: "मछली", roman: "machhlee" },
    chicken: {
      script: "चिकन",
      roman: "chikan",
      notes:
        "On menus and in speech: चिकन. The bird is मुर्गा (murgaa, rooster) / मुर्गी (murgee, hen).",
    },
    // Food & drinks › Hungry & thirsty (lesson "hungry-thirsty")
    hungry: {
      script: "भूखा",
      roman: "bhookhaa",
      notes:
        "Feminine: भूखी (bhookhee). The noun hunger is भूख (bhookh): मुझे भूख लगी है = I am hungry.",
    },
    thirsty: {
      script: "प्यासा",
      roman: "pyaasaa",
      notes: "Feminine: प्यासी (pyaasee). Thirst: प्यास (pyaas).",
    },
    tasty: {
      script: "स्वादिष्ट",
      roman: "svaadisht",
      notes:
        'Formal-sounding. In everyday speech: बहुत बढ़िया है (great), मज़ेदार (mazedaar) or English "tasty" (टेस्टी). Taste: स्वाद (svaad).',
    },
    spicy: {
      script: "तीखा",
      roman: "teekhaa",
      notes: "तीखा = chilli-hot. मसालेदार (masaaledaar) = richly spiced. मिर्च (mirch) = chilli.",
    },
    sweetTaste: {
      script: "मीठा",
      roman: "meethaa",
      notes:
        "Feminine: मीठी. Also used as a noun for dessert: मीठे में क्या है? (what is there for dessert?).",
    },
    iAmHungry: {
      words: [
        ["मुझे", "mujhe"],
        ["भूख", "bhookh"],
        ["लगी", "lagee"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "hunger has struck me" — same for men and women. Also possible: मैं भूखा हूँ; a woman says मैं भूखी हूँ.',
    },
    iAmThirsty: {
      words: [
        ["मुझे", "mujhe"],
        ["प्यास", "pyaas"],
        ["लगी", "lagee"],
        ["है", "hai"],
      ],
      blank: 1,
      notes: 'Literally "thirst has struck me" — same for men and women.',
    },
    iWantWater: {
      words: [
        ["मुझे", "mujhe"],
        ["पानी", "paani"],
        ["चाहिए", "chaahiye"],
      ],
      blank: 1,
      notes:
        'Literally "to me water is needed". चाहिए never changes for gender — a great beginner pattern. Politer: थोड़ा पानी मिलेगा? (may I have some water?).',
    },
    iWantTea: {
      words: [
        ["मुझे", "mujhe"],
        ["चाय", "chaay"],
        ["चाहिए", "chaahiye"],
      ],
      blank: 1,
      notes:
        "Same pattern: मुझे ... चाहिए. Offering: चाय लेंगे? (chaay lenge?, will you have tea?).",
    },
    iWantFood: {
      words: [
        ["मुझे", "mujhe"],
        ["खाना", "khaanaa"],
        ["चाहिए", "chaahiye"],
      ],
      blank: 1,
    },
    iDontEatMeat: {
      words: [
        ["मैं", "main"],
        ["मांस", "maans"],
        ["नहीं", "nahin"],
        ["खाता", "khaataa"],
      ],
      notes:
        "A woman says: मैं मांस नहीं खाती (khaatee). In everyday speech: मैं नॉन-वेज नहीं खाता, or मैं शाकाहारी हूँ (main shaakaahaaree hoon, I am vegetarian). In negatives हूँ is usually dropped.",
    },
    // Food & drinks › Ordering food (lesson "ordering-food")
    breakfast: {
      script: "नाश्ता",
      roman: "naashtaa",
      notes: "नाश्ता करना = to have breakfast. नाश्ता also means a snack at tea time.",
    },
    lunch: {
      script: "दोपहर का खाना",
      roman: "dopahar kaa khaanaa",
      notes: 'Literally "afternoon\'s food". Offices and colleges just say लंच (lanch).',
    },
    dinner: {
      script: "रात का खाना",
      roman: "raat kaa khaanaa",
      notes: 'Literally "night\'s food". Also डिनर in cities.',
    },
    giveMeOneTea: {
      words: [
        ["एक", "ek"],
        ["चाय", "chaay"],
        ["दीजिए", "deejiye"],
      ],
      notes:
        'The -इए ending (deejiye) already makes it polite — no "please" needed. At a tea stall people say भैया, एक चाय देना (bhaiyaa, ek chaay denaa).',
    },
    whatWouldYouLike: {
      words: [
        ["आप", "aap"],
        ["क्या", "kyaa"],
        ["लेंगे?", "lenge?"],
      ],
      notes:
        'Literally "what will you take?". To a woman: आप क्या लेंगी? (lengee). Waiters also say जी, बताइए (jee, bataaiye, yes, tell me).',
    },
    billPlease: {
      words: [
        ["बिल", "bil"],
        ["लाइए", "laaiye"],
      ],
      notes:
        'Literally "please bring the bill". Softer: ज़रा बिल ले आइए (zaraa bil le aaiye). At a dhaba: भैया, कितना हुआ? (bhaiyaa, kitnaa huaa?, how much is it?).',
    },
    withoutSugar: {
      words: [
        ["बिना", "binaa"],
        ["चीनी", "cheenee"],
        ["के", "ke"],
        ["दीजिए", "deejiye"],
      ],
      notes:
        "बिना ... के = without. Also चीनी मत डालिए (cheenee mat daaliye, don't add sugar) or चीनी कम (less sugar).",
    },
    isItSpicy: {
      words: [
        ["क्या", "kyaa"],
        ["यह", "yah"],
        ["तीखा", "teekhaa"],
        ["है?", "hai?"],
      ],
      blank: 2,
      notes:
        "Spoken: ये तीखा है? (rising tone, no क्या needed). Ask for less chilli: मिर्च कम डालिए (mirch kam daaliye).",
    },
    itIsVeryTasty: {
      words: [
        ["यह", "yah"],
        ["बहुत", "bahut"],
        ["स्वादिष्ट", "svaadisht"],
        ["है", "hai"],
      ],
      notes:
        "Polite and correct. At the table people more often say बहुत बढ़िया है! (bahut badhiyaa hai) or मज़ा आ गया (mazaa aa gayaa, loved it).",
    },
    giveMeWater: {
      words: [
        ["थोड़ा", "thodaa"],
        ["पानी", "paani"],
        ["दीजिए", "deejiye"],
      ],
      blank: 1,
      notes: "थोड़ा (thodaa) = a little / some. Casual: थोड़ा पानी देना.",
    },
    oneMorePlease: {
      words: [
        ["एक", "ek"],
        ["और", "aur"],
        ["दीजिए", "deejiye"],
      ],
      notes: "और (aur) = and / more. One more roti: एक रोटी और दीजिए.",
    },
    // Numbers, time & dates › Numbers 1–10 (lesson "numbers-1-10")
    one: {
      script: "एक",
      roman: "ek",
      notes: "Hindi digit: १. Numbers go before the noun: एक चाय (one tea).",
    },
    two: { script: "दो", roman: "do", notes: 'Hindi digit: २. दो also means "give!" (casual).' },
    three: { script: "तीन", roman: "teen", notes: "Hindi digit: ३." },
    four: { script: "चार", roman: "chaar", notes: "Hindi digit: ४." },
    five: { script: "पाँच", roman: "paanch", notes: "Hindi digit: ५." },
    six: {
      script: "छह",
      roman: "chhah",
      notes: 'Also written छः. Pronounced "chhe". Hindi digit: ६.',
    },
    seven: { script: "सात", roman: "saat", notes: "Hindi digit: ७." },
    eight: { script: "आठ", roman: "aath", notes: "Hindi digit: ८. ठ is an aspirated retroflex t." },
    nine: { script: "नौ", roman: "nau", notes: "Hindi digit: ९." },
    ten: {
      script: "दस",
      roman: "das",
      notes: "Hindi digit: १०. Prices and phone numbers are very often said in English.",
    },
    // Numbers, time & dates › Numbers 11–20 (lesson "numbers-11-20")
    eleven: {
      script: "ग्यारह",
      roman: "gyaarah",
      notes:
        "Hindi numbers 11–99 are each their own word and must be memorised; in cities people often switch to English for bigger numbers.",
    },
    twelve: { script: "बारह", roman: "baarah" },
    thirteen: { script: "तेरह", roman: "terah" },
    fourteen: { script: "चौदह", roman: "chaudah" },
    fifteen: { script: "पंद्रह", roman: "pandrah" },
    sixteen: { script: "सोलह", roman: "solah" },
    seventeen: { script: "सत्रह", roman: "satrah" },
    eighteen: { script: "अठारह", roman: "athaarah" },
    nineteen: {
      script: "उन्नीस",
      roman: "unnees",
      notes:
        'Literally "one less than twenty" — 29, 39 … follow the same pattern (उनतीस, untees = 29).',
    },
    twenty: { script: "बीस", roman: "bees" },
    // Numbers, time & dates › Tens & big numbers (lesson "big-numbers")
    thirty: { script: "तीस", roman: "tees" },
    forty: { script: "चालीस", roman: "chaalees" },
    fifty: { script: "पचास", roman: "pachaas" },
    hundred: {
      script: "सौ",
      roman: "sau",
      notes: "एक सौ (ek sau) = one hundred; दो सौ (do sau) = 200.",
    },
    thousand: {
      script: "हज़ार",
      roman: "hazaar",
      notes:
        "Big numbers use लाख (laakh, 100,000) and करोड़ (karod, 10 million) — also in Indian English.",
    },
    howMany: {
      words: [["कितने?", "kitne?"]],
      notes:
        "कितने with plural masculine nouns, कितनी (kitnee) with feminine ones: कितनी बहनें? For amounts and prices: कितना? (kitnaa?).",
    },
    // Numbers, time & dates › Age & phone numbers (lesson "age-phone")
    age: { script: "उम्र", roman: "umr", notes: 'Pronounced "umar". Formal: आयु (aayu).' },
    year: {
      script: "साल",
      roman: "saal",
      notes: "Formal: वर्ष (varsh). This year: इस साल (is saal).",
    },
    howOldAreYou: {
      words: [
        ["आपकी", "aapkee"],
        ["उम्र", "umr"],
        ["क्या", "kyaa"],
        ["है?", "hai?"],
      ],
      notes:
        'Literally "what is your age?" (उम्र is feminine, so आपकी). Also: आप कितने साल के हैं? (aap kitne saal ke hain?). Asking adults their age is fine in India.',
    },
    iAmTwentyYearsOld: {
      words: [
        ["मैं", "main"],
        ["बीस", "bees"],
        ["साल", "saal"],
        ["का", "kaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes:
        'Literally "I am of twenty years". A woman says: मैं बीस साल की हूँ (kee). Also: मेरी उम्र बीस साल है.',
    },
    phoneNumber: {
      script: "फ़ोन नंबर",
      roman: "fon nambar",
      notes: "Also मोबाइल नंबर. Digits are usually read one by one, often in English.",
    },
    whatIsYourPhoneNumber: {
      words: [
        ["आपका", "aapkaa"],
        ["फ़ोन", "fon"],
        ["नंबर", "nambar"],
        ["क्या", "kyaa"],
        ["है?", "hai?"],
      ],
      notes: 'Casual: तुम्हारा नंबर क्या है? Asking "नंबर दीजिए" (nambar deejiye) is also common.',
    },
    // Numbers, time & dates › Time of day (lesson "time")
    time: {
      script: "समय",
      roman: "samay",
      notes:
        "Also वक़्त (vaqt) and English टाइम (taaim), which is the most common in speech: क्या टाइम हुआ है?",
    },
    now: {
      script: "अब",
      roman: "ab",
      notes: "अभी (abhee) = right now / just now: अभी आता हूँ (I'm coming right now).",
    },
    today: { script: "आज", roman: "aaj" },
    tomorrow: {
      script: "कल",
      roman: "kal",
      notes:
        'कल means both "tomorrow" and "yesterday" — the verb tense tells you which: कल आऊँगा (I\'ll come tomorrow) / कल आया था (I came yesterday). परसों (parson) = day after tomorrow or day before yesterday.',
    },
    yesterday: {
      script: "बीता हुआ कल",
      roman: "beetaa huaa kal",
      notes:
        'In conversation "yesterday" is simply कल (kal), the same word as "tomorrow"; the past-tense verb makes it clear: मैं कल गया था (I went yesterday). बीता हुआ कल ("the kal that has passed") is used only when you must be explicit, and it often means "the past" in general — beginners should simply say कल with a past verb. Also पिछले दिन (pichhle din, the previous day).',
    },
    morning: {
      script: "सुबह",
      roman: "subah",
      notes:
        'Pronounced "subah" / "subeh". In the morning: सुबह (no postposition needed) or सुबह-सुबह (early in the morning).',
    },
    afternoon: {
      script: "दोपहर",
      roman: "dopahar",
      notes: 'Literally "second watch (of the day)". In the afternoon: दोपहर को (dopahar ko).',
    },
    evening: { script: "शाम", roman: "shaam", notes: "In the evening: शाम को (shaam ko)." },
    night: { script: "रात", roman: "raat", notes: "At night: रात को (raat ko)." },
    whatTimeIsIt: {
      words: [
        ["कितने", "kitne"],
        ["बजे", "baje"],
        ["हैं?", "hain?"],
      ],
      notes:
        'Literally "how many have struck?". Very common in speech: क्या टाइम हुआ है? (kyaa taaim huaa hai?).',
    },
    itIsFiveOClock: {
      words: [
        ["पाँच", "paanch"],
        ["बजे", "baje"],
        ["हैं", "hain"],
      ],
      blank: 0,
      notes:
        'Literally "five have struck". One o\'clock is singular: एक बजा है (ek bajaa hai). Half past: साढ़े पाँच (saadhe paanch, 5:30); 1:30 is डेढ़ (dedh), 2:30 is ढाई (dhaaee).',
    },
    // Numbers, time & dates › Days of the week (lesson "days")
    monday: {
      script: "सोमवार",
      roman: "somvaar",
      notes:
        'सोम = moon. In speech people often just say "Monday". On Monday: सोमवार को (somvaar ko).',
    },
    tuesday: {
      script: "मंगलवार",
      roman: "mangalvaar",
      notes: "मंगल = Mars; also an auspicious day for Hanuman temples.",
    },
    wednesday: { script: "बुधवार", roman: "budhvaar", notes: "बुध = Mercury." },
    thursday: {
      script: "गुरुवार",
      roman: "guruvaar",
      notes: "Also बृहस्पतिवार (brihaspativaar) and वीरवार (veervaar, common in Delhi/Punjab).",
    },
    friday: {
      script: "शुक्रवार",
      roman: "shukravaar",
      notes: "शुक्र = Venus. Not to be confused with शुक्रिया (thank you).",
    },
    saturday: { script: "शनिवार", roman: "shanivaar", notes: "शनि = Saturn." },
    sunday: {
      script: "रविवार",
      roman: "ravivaar",
      notes: "रवि = sun (also a name, Ravi). Everyday alternative: इतवार (itvaar).",
    },
    day: {
      script: "दिन",
      roman: "din",
      notes: "Days: दिनों (dinon) after postpositions: कई दिनों से (for many days).",
    },
    week: {
      script: "हफ़्ता",
      roman: "haftaa",
      notes: "Formal: सप्ताह (saptaah). Also written हफ्ता. Next week: अगले हफ़्ते (agle hafte).",
    },
    month: { script: "महीना", roman: "maheenaa", notes: "Next month: अगले महीने (agle maheene)." },
    whatDayIsToday: {
      words: [
        ["आज", "aaj"],
        ["कौन-सा", "kaun-saa"],
        ["दिन", "din"],
        ["है?", "hai?"],
      ],
      notes: 'Literally "today which day is?". Also: आज क्या दिन है? (aaj kyaa din hai?).',
    },
    todayIsMonday: {
      words: [
        ["आज", "aaj"],
        ["सोमवार", "somvaar"],
        ["है", "hai"],
      ],
      blank: 1,
    },
    // Daily life › Morning & evening (lesson "routine-verbs")
    wakeUp: {
      script: "उठना",
      roman: "uthnaa",
      notes:
        "उठना = to get up / rise. जागना (jaagnaa) = to be awake / wake up. Wake up!: उठो! (utho).",
    },
    sleep: {
      script: "सोना",
      roman: "sonaa",
      notes: 'सोना also means "gold" — context makes it clear. Go to sleep: सो जाओ (so jaao).',
    },
    bathe: {
      script: "नहाना",
      roman: "nahaanaa",
      notes:
        "Covers bath and shower. Also: नहा-धो लेना (nahaa-dho lenaa, to wash up and get ready).",
    },
    cook: {
      script: "पकाना",
      roman: "pakaanaa",
      notes:
        "In everyday speech people say खाना बनाना (khaanaa banaanaa, to make food): माँ खाना बना रही हैं.",
    },
    wash: {
      script: "धोना",
      roman: "dhonaa",
      notes: "हाथ धोना (to wash hands), कपड़े धोना (to wash clothes).",
    },
    wear: {
      script: "पहनना",
      roman: "pahannaa",
      notes: 'कपड़े पहनना (to put on clothes). Pronounced "pehen-naa".',
    },
    // Daily life › Study, work & play (lesson "activity-verbs")
    study: {
      script: "पढ़ाई करना",
      roman: "padhaaee karnaa",
      notes:
        'Literally "to do studies". The verb पढ़ना (padhnaa) means both "to read" and "to study": वह कॉलेज में पढ़ता है (he studies at college).',
    },
    work: {
      script: "काम करना",
      roman: "kaam karnaa",
      notes: "काम = work / job / task. काम है? (kaam hai?) = Do you need something / are you busy?",
    },
    read: {
      script: "पढ़ना",
      roman: "padhnaa",
      notes: 'ढ़ is a flapped retroflex sound. Also "to study" (see पढ़ाई करना).',
    },
    write: { script: "लिखना", roman: "likhnaa" },
    play: {
      script: "खेलना",
      roman: "khelnaa",
      notes: "For sports/games. Playing music is बजाना (bajaanaa): गिटार बजाना.",
    },
    listen: {
      script: "सुनना",
      roman: "sunnaa",
      notes: 'सुनो (suno, listen — casual), सुनिए (suniye, polite; also "excuse me").',
    },
    speak: {
      script: "बोलना",
      roman: "bolnaa",
      notes: "Also बात करना (baat karnaa, to talk/chat) and कहना (kahnaa, to say).",
    },
    // Daily life › Sit, stand & wait (lesson "movement-verbs")
    sit: {
      script: "बैठना",
      roman: "baithnaa",
      notes: "बैठो (baitho, casual), बैठिए (baithiye, polite).",
    },
    stand: {
      script: "खड़ा होना",
      roman: "khadaa honaa",
      notes:
        'Literally "to become standing". A woman: खड़ी (khadee). Stand up!: खड़े हो जाओ (khade ho jaao).',
    },
    walk: {
      script: "चलना",
      roman: "chalnaa",
      notes:
        'Also "to move / to work (machine)" and "let\'s go": चलो! (chalo). On foot: पैदल (paidal).',
    },
    run: {
      script: "दौड़ना",
      roman: "daudnaa",
      notes: "भागना (bhaagnaa) = to run away / run fast; also very common.",
    },
    wait: {
      script: "इंतज़ार करना",
      roman: "intazaar karnaa",
      notes:
        'Also written इंतजार. A short "wait!" is रुको (ruko, casual) / रुकिए (rukiye, polite), from रुकना (to stop).',
    },
    open: { script: "खोलना", roman: "kholnaa", notes: "Something is open: खुला है (khulaa hai)." },
    close: {
      script: "बंद करना",
      roman: "band karnaa",
      notes: 'Something is closed: बंद है (band hai). Common sign: "आज दुकान बंद है".',
    },
    // Daily life › What are you doing? (lesson "what-are-you-doing")
    whatAreYouDoing: {
      words: [
        ["आप", "aap"],
        ["क्या", "kyaa"],
        ["कर", "kar"],
        ["रहे", "rahe"],
        ["हैं?", "hain?"],
      ],
      notes:
        "To a woman: आप क्या कर रही हैं? (rahee). To a friend: क्या कर रहे हो? (kyaa kar rahe ho?).",
    },
    iAmStudying: {
      words: [
        ["मैं", "main"],
        ["पढ़", "padh"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes:
        "A woman says: मैं पढ़ रही हूँ (rahee). Also: मैं पढ़ाई कर रहा/रही हूँ. Present continuous = verb stem + रहा/रही/रहे + हूँ/है/हैं.",
    },
    iAmEating: {
      words: [
        ["मैं", "main"],
        ["खाना", "khaanaa"],
        ["खा", "khaa"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      blank: 2,
      notes:
        'A woman says: मैं खाना खा रही हूँ. Literally "I am eating food" — Hindi normally names the food.',
    },
    iAmDrinkingWater: {
      words: [
        ["मैं", "main"],
        ["पानी", "paani"],
        ["पी", "pee"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "A woman says: मैं पानी पी रही हूँ.",
    },
    iAmSleeping: {
      words: [
        ["मैं", "main"],
        ["सो", "so"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "A woman says: मैं सो रही हूँ. Going to sleep: मैं सोने जा रहा हूँ.",
    },
    iAmWorking: {
      words: [
        ["मैं", "main"],
        ["काम", "kaam"],
        ["कर", "kar"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "A woman says: मैं काम कर रही हूँ.",
    },
    iAmComing: {
      words: [
        ["मैं", "main"],
        ["आ", "aa"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      notes:
        'A woman says: मैं आ रही हूँ. When someone calls you, people shout आया! (aayaa, "coming!") — a woman: आई! (aaee).',
    },
    iAmGoing: {
      words: [
        ["मैं", "main"],
        ["जा", "jaa"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      notes:
        'A woman says: मैं जा रही हूँ. When leaving, it is politer to say चलता हूँ (chaltaa hoon, "I\'ll be off"); a woman: चलती हूँ.',
    },
    // Daily life › My day (lesson "my-day")
    everyDay: {
      script: "हर दिन",
      roman: "har din",
      notes: "Also रोज़ (roz) and रोज़ाना (rozaanaa), very common in speech.",
    },
    iAmGoingHome: {
      words: [
        ["मैं", "main"],
        ["घर", "ghar"],
        ["जा", "jaa"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes:
        'A woman says: मैं घर जा रही हूँ. No word for "to" is needed with घर and other destinations.',
    },
    iAmGoingToCollege: {
      words: [
        ["मैं", "main"],
        ["कॉलेज", "kolej"],
        ["जा", "jaa"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "A woman says: मैं कॉलेज जा रही हूँ.",
    },
    iWakeUpAtSix: {
      words: [
        ["मैं", "main"],
        ["छह", "chhah"],
        ["बजे", "baje"],
        ["उठता", "uthtaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes:
        'A woman says: मैं छह बजे उठती हूँ (uthtee). "At six o\'clock" = छह बजे, no extra word for "at". Habitual present = stem + ता/ती/ते + हूँ.',
    },
    iGoToCollegeEveryDay: {
      words: [
        ["मैं", "main"],
        ["रोज़", "roz"],
        ["कॉलेज", "kolej"],
        ["जाता", "jaataa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "A woman says: मैं रोज़ कॉलेज जाती हूँ. Also: मैं हर दिन कॉलेज जाता हूँ.",
    },
    iEatLunchAtOne: {
      words: [
        ["मैं", "main"],
        ["एक", "ek"],
        ["बजे", "baje"],
        ["दोपहर", "dopahar"],
        ["का", "kaa"],
        ["खाना", "khaanaa"],
        ["खाता", "khaataa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes:
        "A woman says: ... खाती हूँ (khaatee hoon). In offices people say मैं एक बजे लंच करता हूँ (lanch kartaa hoon).",
    },
    iSleepAtTen: {
      words: [
        ["मैं", "main"],
        ["रात", "raat"],
        ["को", "ko"],
        ["दस", "das"],
        ["बजे", "baje"],
        ["सोता", "sotaa"],
        ["हूँ", "hoon"],
      ],
      blank: 3,
      notes: "A woman says: मैं रात को दस बजे सोती हूँ (sotee). Time words come before the verb.",
    },
    // Places & directions › Places in town (lesson "places-1")
    school: {
      script: "स्कूल",
      roman: "skool",
      notes: "Formal: विद्यालय (vidyaalay), seen on school signboards.",
    },
    college: {
      script: "कॉलेज",
      roman: "kolej",
      notes:
        "Formal: महाविद्यालय (mahaavidyaalay). University: विश्वविद्यालय (vishvavidyaalay) or यूनिवर्सिटी.",
    },
    office: {
      script: "दफ़्तर",
      roman: "daftar",
      notes:
        "English ऑफ़िस (ofis) is just as common. Government office: कार्यालय (kaaryaalay) on signs.",
    },
    shop: {
      script: "दुकान",
      roman: "dukaan",
      notes: "Shopkeeper: दुकानदार (dukaandaar). Feminine: दुकान खुली है.",
    },
    market: {
      script: "बाज़ार",
      roman: "baazaar",
      notes: "Also written बाजार. Delhi's famous markets: चाँदनी चौक, सरोजिनी नगर.",
    },
    restaurant: {
      script: "रेस्टोरेंट",
      roman: "restorent",
      notes:
        "Also होटल (hotal) — in India this often means an eating place, not lodging — and ढाबा (dhaabaa, roadside eatery). Formal: भोजनालय (bhojanaalay).",
    },
    // Places & directions › More places (lesson "places-2")
    hospital: {
      script: "अस्पताल",
      roman: "aspataal",
      notes: "Formal: चिकित्सालय (chikitsaalay). English हॉस्पिटल is also used.",
    },
    station: {
      script: "रेलवे स्टेशन",
      roman: "relve steshan",
      notes: "Usually just स्टेशन (steshan). Formal: रेलवे स्टेशन / रेल स्टेशन.",
    },
    bank: { script: "बैंक", roman: "baink" },
    temple: {
      script: "मंदिर",
      roman: "mandir",
      notes:
        "Mosque: मस्जिद (masjid), Sikh temple: गुरुद्वारा (gurudvaaraa), church: गिरजाघर (girjaaghar) / चर्च.",
    },
    bathroom: {
      script: "बाथरूम",
      roman: "baathroom",
      notes:
        "Also टॉयलेट (toilet) and वॉशरूम. On signs: शौचालय (shauchaalay). Polite indirect: हाथ धोने की जगह (place to wash hands).",
    },
    road: {
      script: "सड़क",
      roman: "sadak",
      notes: "रास्ता (raastaa) = way / route; गली (galee) = lane.",
    },
    // Places & directions › Near, far, left & right (lesson "position-words")
    near: {
      script: "पास",
      roman: "paas",
      notes:
        'Near something: ... के पास (ke paas): स्टेशन के पास (near the station). Also "to have": मेरे पास पैसे हैं (I have money).',
    },
    far: {
      script: "दूर",
      roman: "door",
      notes: 'Far from: ... से दूर (se door). Not English "door" — the oo is long.',
    },
    left: {
      script: "बाएँ",
      roman: "baaen",
      notes:
        '"To the left". Adjective: बायाँ (baayaan), बायाँ हाथ = left hand. People also say लेफ़्ट.',
    },
    right: {
      script: "दाएँ",
      roman: "daaen",
      notes:
        '"To the right". Adjective: दायाँ (daayaan). People also say राइट. Not to be confused with सही (sahee, correct).',
    },
    straight: {
      script: "सीधा",
      roman: "seedhaa",
      notes: 'Go straight: सीधे जाइए (seedhe jaaiye). सीधा also means "simple/honest".',
    },
    inFront: {
      script: "सामने",
      roman: "saamne",
      notes:
        'In front of: ... के सामने (ke saamne): बैंक के सामने (in front of the bank). Also "opposite".',
    },
    behind: {
      script: "पीछे",
      roman: "peechhe",
      notes: "Behind something: ... के पीछे (ke peechhe).",
    },
    inside: {
      script: "अंदर",
      roman: "andar",
      notes: "Also भीतर (bheetar). Come in: अंदर आइए (andar aaiye).",
    },
    outside: {
      script: "बाहर",
      roman: "baahar",
      notes: "Outside the house: घर के बाहर (ghar ke baahar).",
    },
    // Places & directions › Asking for directions (lesson "asking-directions")
    where: {
      script: "कहाँ",
      roman: "kahaan",
      notes: "Where from: कहाँ से; where to: कहाँ / किधर (kidhar, which way).",
    },
    whereIsTheBathroom: {
      words: [
        ["बाथरूम", "baathroom"],
        ["कहाँ", "kahaan"],
        ["है?", "hai?"],
      ],
      blank: 0,
      notes: "Start with सुनिए (excuse me). Also: टॉयलेट किधर है? (toilet kidhar hai?).",
    },
    whereIsTheStation: {
      words: [
        ["रेलवे", "relve"],
        ["स्टेशन", "steshan"],
        ["कहाँ", "kahaan"],
        ["है?", "hai?"],
      ],
      blank: 1,
      notes: "Usually shortened to स्टेशन कहाँ है? The question word comes just before the verb.",
    },
    goStraight: {
      words: [
        ["सीधे", "seedhe"],
        ["जाइए", "jaaiye"],
      ],
      notes:
        "Casual: सीधे जाओ (seedhe jaao). Also सीधा चले जाइए (seedhaa chale jaaiye, keep going straight).",
    },
    turnLeft: {
      words: [
        ["बाएँ", "baaen"],
        ["मुड़िए", "mudiye"],
      ],
      notes:
        "From मुड़ना (mudnaa, to turn). Casual: बाएँ मुड़ो. Also: लेफ़्ट ले लीजिए (left le leejiye, take a left).",
    },
    turnRight: {
      words: [
        ["दाएँ", "daaen"],
        ["मुड़िए", "mudiye"],
      ],
      notes: "Casual: दाएँ मुड़ो. Also: राइट ले लीजिए (take a right).",
    },
    itIsNear: {
      words: [
        ["यह", "yah"],
        ["पास", "paas"],
        ["में", "mein"],
        ["है", "hai"],
      ],
      blank: 1,
      notes: "Often just पास में ही है (paas mein hee hai, it's right nearby). पास में = nearby.",
    },
    itIsFar: {
      words: [
        ["यह", "yah"],
        ["दूर", "door"],
        ["है", "hai"],
      ],
      blank: 1,
      notes: "Very far: बहुत दूर है (bahut door hai).",
    },
    howFarIsIt: {
      words: [
        ["कितनी", "kitnee"],
        ["दूर", "door"],
        ["है?", "hai?"],
      ],
      notes:
        "दूरी (distance) is feminine, so कितनी. Answers usually come in minutes: दस मिनट का रास्ता है (it's a ten-minute walk/ride).",
    },
    // Places & directions › Where are you going? (lesson "where-are-you-going")
    whereAreYouGoing: {
      words: [
        ["आप", "aap"],
        ["कहाँ", "kahaan"],
        ["जा", "jaa"],
        ["रहे", "rahe"],
        ["हैं?", "hain?"],
      ],
      notes:
        "To a woman: आप कहाँ जा रही हैं? To a friend: कहाँ जा रहे हो? / कहाँ चले? (kahaan chale?). It is a friendly question, not nosy.",
    },
    iAmGoingToTheMarket: {
      words: [
        ["मैं", "main"],
        ["बाज़ार", "baazaar"],
        ["जा", "jaa"],
        ["रहा", "rahaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: 'A woman says: मैं बाज़ार जा रही हूँ. No word for "to" is needed.',
    },
    whereAreYou: {
      words: [
        ["आप", "aap"],
        ["कहाँ", "kahaan"],
        ["हैं?", "hain?"],
      ],
      notes:
        "Casual (on the phone to a friend): कहाँ हो? (kahaan ho?) or कहाँ है तू? (very casual).",
    },
    iAmAtHome: {
      words: [
        ["मैं", "main"],
        ["घर", "ghar"],
        ["पर", "par"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "Same for men and women. Also: मैं घर में हूँ (inside the house). पर (par) = at/on.",
    },
    comeHere: {
      words: [
        ["यहाँ", "yahaan"],
        ["आइए", "aaiye"],
      ],
      notes:
        "Polite. Casual: इधर आओ (idhar aao) or यहाँ आओ. Beckoning is done with the palm facing down.",
    },
    waitHere: {
      words: [
        ["यहीं", "yaheen"],
        ["रुकिए", "rukiye"],
      ],
      notes:
        'Literally "stop right here". Casual: यहीं रुको (yaheen ruko). Longer wait: यहाँ इंतज़ार कीजिए (yahaan intazaar keejiye).',
    },
    // Shopping & money › Money & prices (lesson "money-words")
    rupee: {
      script: "रुपया",
      roman: "rupayaa",
      notes: "Plural: रुपये (rupaye): सौ रुपये (100 rupees). Also written रुपए. Symbol: ₹.",
    },
    price: {
      script: "दाम",
      roman: "daam",
      notes: "Also क़ीमत (qeemat) and भाव (bhaav, rate — used in markets).",
    },
    buy: {
      script: "ख़रीदना",
      roman: "khareednaa",
      notes:
        "Also written खरीदना. In speech people often say लेना (to take): मैंने एक शर्ट ली (I bought a shirt).",
    },
    sell: { script: "बेचना", roman: "bechnaa" },
    expensive: {
      script: "महँगा",
      roman: "mahangaa",
      notes: "Feminine: महँगी (mahangee). Also written महंगा.",
    },
    cheap: {
      script: "सस्ता",
      roman: "sastaa",
      notes: 'Feminine: सस्ती (sastee). Also means "low quality" in some contexts.',
    },
    howMuch: {
      script: "कितना",
      roman: "kitnaa",
      notes:
        "For price: कितने का है? (kitne kaa hai?, for how much is it?) or कितने का? Total: कितना हुआ? (kitnaa huaa?).",
    },
    // Shopping & money › Colours (lesson "colours")
    colour: {
      script: "रंग",
      roman: "rang",
      notes: "Which colour?: कौन-सा रंग? Holi is the festival of colours (रंगों का त्योहार).",
    },
    red: {
      script: "लाल",
      roman: "laal",
      notes: "Does not change for gender: लाल साड़ी, लाल कुर्ता.",
    },
    blue: {
      script: "नीला",
      roman: "neelaa",
      notes: "Changes: नीली साड़ी (neelee), नीले कपड़े (neele).",
    },
    green: {
      script: "हरा",
      roman: "haraa",
      notes: "Changes: हरी सब्ज़ी (haree sabzee, green vegetables).",
    },
    yellow: {
      script: "पीला",
      roman: "peelaa",
      notes: "Changes: पीली (peelee). Yellow is worn at Basant Panchami and at haldi ceremonies.",
    },
    white: { script: "सफ़ेद", roman: "safed", notes: "Does not change. Also written सफेद." },
    black: { script: "काला", roman: "kaalaa", notes: "Changes: काली (kaalee), काले (kaale)." },
    // Shopping & money › Clothes (lesson "clothes")
    clothes: {
      script: "कपड़े",
      roman: "kapde",
      notes: "Plural of कपड़ा (kapdaa, cloth / garment).",
    },
    shirt: {
      script: "कमीज़",
      roman: "kameez",
      notes:
        "English शर्ट (shart) is more common for Western shirts; कमीज़ is also the top of a सलवार कमीज़.",
    },
    trousers: {
      script: "पैंट",
      roman: "paint",
      notes: "Everyone says पैंट. Older word: पतलून (patloon). Jeans: जींस.",
    },
    saree: {
      script: "साड़ी",
      roman: "saadee",
      notes:
        "ड़ is a flapped r-like sound. In Hindi-speaking cities many women also wear सलवार कमीज़ or कुर्ती.",
    },
    shoes: {
      script: "जूते",
      roman: "joote",
      notes: "Plural of जूता (jootaa). Shoes are taken off before entering homes and temples.",
    },
    slippers: {
      script: "चप्पल",
      roman: "chappal",
      notes: "Feminine: चप्पलें (chappalen) in the plural. Also English स्लिपर.",
    },
    // Shopping & money › At the shop (lesson "at-the-shop")
    howMuchIsThis: {
      words: [
        ["यह", "yah"],
        ["कितने", "kitne"],
        ["का", "kaa"],
        ["है?", "hai?"],
      ],
      notes:
        'Literally "this is of how much?" Also: इसका दाम क्या है? (iskaa daam kyaa hai?) or just कितने का?',
    },
    thisIsTooExpensive: {
      words: [
        ["यह", "yah"],
        ["बहुत", "bahut"],
        ["महँगा", "mahangaa"],
        ["है", "hai"],
      ],
      blank: 2,
      notes:
        "For a feminine item: यह बहुत महँगी है (e.g. साड़ी). Bargaining tone: अरे भैया, बहुत महँगा है!",
    },
    reduceThePrice: {
      words: [
        ["थोड़ा", "thodaa"],
        ["कम", "kam"],
        ["कीजिए", "keejiye"],
      ],
      notes:
        'Literally "make it a little less". At markets: भैया, थोड़ा कम कर दीजिए (thodaa kam kar deejiye). Bargaining is normal in markets, not in malls.',
    },
    doYouHaveMangoes: {
      words: [
        ["क्या", "kyaa"],
        ["आपके", "aapke"],
        ["पास", "paas"],
        ["आम", "aam"],
        ["हैं?", "hain?"],
      ],
      blank: 3,
      notes:
        'Literally "near you are there mangoes?" — ... के पास है is how Hindi says "to have". At a stall people just say भैया, आम हैं? (bhaiyaa, aam hain?).',
    },
    iNeedABag: {
      words: [
        ["मुझे", "mujhe"],
        ["एक", "ek"],
        ["बैग", "baig"],
        ["चाहिए", "chaahiye"],
      ],
      blank: 2,
      notes:
        "For a carry bag at a shop people say थैली (thailee): एक थैली दे दीजिए. Bringing your own cloth bag (थैला) is common.",
    },
    giveMeThisOne: {
      words: [
        ["यह", "yah"],
        ["वाला", "vaalaa"],
        ["दीजिए", "deejiye"],
      ],
      notes:
        'वाला (vaalaa) = "the one": यह वाला = this one. For feminine items: यह वाली दीजिए (vaalee).',
    },
    iWillTakeIt: {
      words: [
        ["मैं", "main"],
        ["यह", "yah"],
        ["ले", "le"],
        ["लूँगा", "loongaa"],
      ],
      notes:
        "A woman says: मैं यह ले लूँगी (loongee). Also very common: ठीक है, दे दीजिए (okay, give it to me).",
    },
    showMeThatOne: {
      words: [
        ["वह", "vah"],
        ["वाला", "vaalaa"],
        ["दिखाइए", "dikhaaiye"],
      ],
      notes: "Spoken: वो वाला दिखाइए. Feminine items: वह वाली दिखाइए.",
    },
    doYouHaveARedOne: {
      words: [
        ["क्या", "kyaa"],
        ["लाल", "laal"],
        ["वाला", "vaalaa"],
        ["है?", "hai?"],
      ],
      blank: 1,
      notes:
        'Literally "is there a red one?". Also: लाल रंग में है? (laal rang mein hai?, do you have it in red?). Feminine item: लाल वाली.',
    },
    // Travel & transport › Getting around (lesson "vehicles")
    bus: {
      script: "बस",
      roman: "bas",
      notes: 'Feminine: बस आ गई (the bus has come). बस also means "enough / that\'s all".',
    },
    train: {
      script: "ट्रेन",
      roman: "tren",
      notes: "Older Hindi word: रेलगाड़ी (relgaadee). Feminine: ट्रेन लेट है.",
    },
    autoRickshaw: {
      script: "ऑटो",
      roman: "oto",
      notes:
        "Everyone says ऑटो. A cycle rickshaw is रिक्शा (rikshaa); Delhi and Lucknow also have e-rickshaws (ई-रिक्शा).",
    },
    taxi: {
      script: "टैक्सी",
      roman: "taiksee",
      notes: "App taxis are called कैब (kaib) or by the app name.",
    },
    car: {
      script: "कार",
      roman: "kaar",
      notes: "Also गाड़ी (gaadee) — any vehicle, often a car: गाड़ी चलाना (to drive).",
    },
    bike: {
      script: "बाइक",
      roman: "baaik",
      notes:
        "Also मोटरसाइकिल (motarsaaikil) and स्कूटी (skootee, a scooter). A bicycle is साइकिल (saaikil).",
    },
    // Travel & transport › Tickets & stations (lesson "travel-words")
    ticket: {
      script: "टिकट",
      roman: "tikat",
      notes: "Everyone says टिकट. Ticket counter: टिकट खिड़की (tikat khidkee).",
    },
    platform: {
      script: "प्लेटफ़ॉर्म",
      roman: "pletform",
      notes: "Platform number five: प्लेटफ़ॉर्म नंबर पाँच.",
    },
    busStop: {
      script: "बस स्टॉप",
      roman: "bas stop",
      notes: "The main bus station is बस अड्डा (bas addaa) or बस स्टैंड.",
    },
    airport: {
      script: "हवाई अड्डा",
      roman: "havaaee addaa",
      notes: 'Literally "air base". In speech एयरपोर्ट (eyarport) is very common.',
    },
    luggage: {
      script: "सामान",
      roman: "saamaan",
      notes: "Means belongings/things in general too: मेरा सामान कहाँ है?",
    },
    journey: {
      script: "यात्रा",
      roman: "yaatraa",
      notes:
        "Also सफ़र (safar). Pilgrimage is also यात्रा. Have a good trip: आपकी यात्रा शुभ हो (formal) / हैप्पी जर्नी.",
    },
    // Travel & transport › When & how long? (lesson "when-how-long")
    when: {
      script: "कब",
      roman: "kab",
      notes: "Since when?: कब से? (kab se). Until when?: कब तक? (kab tak).",
    },
    howLong: {
      script: "कितनी देर",
      roman: "kitnee der",
      notes: 'Literally "how much delay/time". Also कितना समय (kitnaa samay).',
    },
    late: {
      script: "देर से",
      roman: "der se",
      notes:
        'Literally "with delay": वह देर से आया (he came late). In speech English लेट (let) is extremely common: ट्रेन लेट है.',
    },
    early: {
      script: "जल्दी",
      roman: "jaldee",
      notes: 'Also means "soon/quickly": सुबह जल्दी (early in the morning).',
    },
    quickly: {
      script: "जल्दी से",
      roman: "jaldee se",
      notes:
        "Hurry up!: जल्दी करो! (jaldee karo, casual) / जल्दी कीजिए (polite). Fast: तेज़ (tez).",
    },
    slowly: {
      script: "धीरे",
      roman: "dheere",
      notes: "Often doubled: धीरे-धीरे (dheere-dheere, slowly, gradually).",
    },
    whenDoesTheBusCome: {
      words: [
        ["बस", "bas"],
        ["कब", "kab"],
        ["आएगी?", "aaegee?"],
      ],
      notes: "बस is feminine, so आएगी (aaegee). For a train: ट्रेन कब आएगी? Same feminine ending.",
    },
    howLongDoesItTake: {
      words: [
        ["कितना", "kitnaa"],
        ["समय", "samay"],
        ["लगेगा?", "lagegaa?"],
      ],
      notes:
        'Literally "how much time will it take?". Also: कितनी देर लगेगी? (kitnee der lagegee?) or कितना टाइम लगेगा?',
    },
    theTrainIsLate: {
      words: [
        ["ट्रेन", "tren"],
        ["लेट", "let"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        "This is how people really say it. More formal: ट्रेन देर से चल रही है (the train is running late).",
    },
    // Travel & transport › Travel phrases (lesson "travel-phrases")
    oneTicketPlease: {
      words: [
        ["लखनऊ", "Lakhnaoo"],
        ["का", "kaa"],
        ["एक", "ek"],
        ["टिकट", "tikat"],
        ["दीजिए", "deejiye"],
      ],
      meaning: "One ticket to Lucknow, please.",
      blank: 3,
      notes:
        'Literally "Lucknow\'s one ticket give". Also: लखनऊ के लिए एक टिकट दीजिए. Two tickets: दो टिकट.',
    },
    whichPlatform: {
      words: [
        ["कौन-सा", "kaun-saa"],
        ["प्लेटफ़ॉर्म?", "pletform?"],
      ],
      notes:
        "Full question: ट्रेन कौन-से प्लेटफ़ॉर्म पर आएगी? (which platform will the train come to?). Also written कौन सा.",
    },
    stopHerePlease: {
      words: [
        ["यहाँ", "yahaan"],
        ["रोकिए", "rokiye"],
      ],
      notes:
        "To an auto driver people usually say भैया, यहीं रोक दो (bhaiyaa, yaheen rok do, stop right here).",
    },
    goSlowlyPlease: {
      words: [
        ["धीरे", "dheere"],
        ["चलाइए", "chalaaiye"],
      ],
      notes: 'Literally "drive slowly". To a driver: भैया, थोड़ा धीरे चलाओ (casual).',
    },
    howMuchToStation: {
      words: [
        ["स्टेशन", "steshan"],
        ["तक", "tak"],
        ["कितना", "kitnaa"],
        ["लगेगा?", "lagegaa?"],
      ],
      notes:
        'Literally "up to the station how much will it cost?". With auto drivers people say भैया, स्टेशन का कितना लोगे? (how much will you take?). Agree on the fare before getting in.',
    },
    iAmLost: {
      words: [
        ["मैं", "main"],
        ["रास्ता", "raastaa"],
        ["भूल", "bhool"],
        ["गया", "gayaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: 'Literally "I have forgotten the way". A woman says: मैं रास्ता भूल गई हूँ (gaee).',
    },
    doesThisBusGoToStation: {
      words: [
        ["क्या", "kyaa"],
        ["यह", "yah"],
        ["बस", "bas"],
        ["रेलवे", "relve"],
        ["स्टेशन", "steshan"],
        ["जाती", "jaatee"],
        ["है?", "hai?"],
      ],
      blank: 4,
      notes:
        "बस is feminine, so जाती है. Shorter, as people say it: ये बस स्टेशन जाएगी? (ye bas steshan jaaegee?).",
    },
    // Everyday conversations › Meeting a friend (lesson "conv-friend")
    whatsNew: {
      words: [
        ["और,", "aur,"],
        ["क्या", "kyaa"],
        ["चल", "chal"],
        ["रहा", "rahaa"],
        ["है?", "hai?"],
      ],
      notes:
        'Literally "and, what\'s going on?" — the classic friendly opener. Also: और सुनाओ? (aur sunaao?, tell me more) and क्या हाल-चाल है? (how are things?).',
    },
    longTimeNoSee: {
      words: [
        ["बहुत", "bahut"],
        ["दिनों", "dinon"],
        ["बाद", "baad"],
        ["मिले", "mile"],
      ],
      notes:
        'Literally "(we) met after many days". Also: बड़े दिनों बाद दिखे! (bade dinon baad dikhe, haven\'t seen you in ages).',
    },
    haveYouEaten: {
      words: [
        ["आपने", "aapne"],
        ["खाना", "khaanaa"],
        ["खाया?", "khaayaa?"],
      ],
      notes:
        "A caring question, especially from elders. Casual: खाना खाया? or तुमने खाना खा लिया? Same for men and women (ने construction).",
    },
    yesIAte: {
      words: [
        ["हाँ,", "haan,"],
        ["मैंने", "mainne"],
        ["खा", "khaa"],
        ["लिया", "liyaa"],
      ],
      notes:
        "Same for men and women — in the past tense with ने the verb agrees with the object, not the speaker. Polite: जी हाँ, खा लिया.",
    },
    // Everyday conversations › At college (lesson "conv-college")
    whereIsTheClass: {
      words: [
        ["क्लास", "klaas"],
        ["कहाँ", "kahaan"],
        ["है?", "hai?"],
      ],
      blank: 0,
      notes:
        "Students say क्लास. Formal: कक्षा कहाँ है? (kakshaa kahaan hai?). Which room?: कौन-सा कमरा?",
    },
    whenIsTheExam: {
      words: [
        ["परीक्षा", "pareekshaa"],
        ["कब", "kab"],
        ["है?", "hai?"],
      ],
      blank: 0,
      notes: "Students mostly say एग्ज़ाम कब है? (egzaam kab hai?). परीक्षा is feminine.",
    },
    canIComeIn: {
      words: [
        ["क्या", "kyaa"],
        ["मैं", "main"],
        ["अंदर", "andar"],
        ["आ", "aa"],
        ["सकता", "saktaa"],
        ["हूँ?", "hoon?"],
      ],
      notes:
        'A woman says: क्या मैं अंदर आ सकती हूँ? (saktee). In Indian classrooms students also say "May I come in, sir/ma\'am?" in English.',
    },
    isThisSeatFree: {
      words: [
        ["क्या", "kyaa"],
        ["यह", "yah"],
        ["सीट", "seet"],
        ["ख़ाली", "khaalee"],
        ["है?", "hai?"],
      ],
      blank: 3,
      notes:
        "ख़ाली (also written खाली) = empty/free. Also: क्या मैं यहाँ बैठ सकता हूँ? (may I sit here?); a woman: बैठ सकती हूँ.",
    },
    // Everyday conversations › On the phone (lesson "conv-phone")
    hello_onPhone: {
      words: [["हेलो?", "helo?"]],
      notes:
        "Everyone answers the phone with हेलो (also written हैलो). Polite follow-up: जी, बोलिए (jee, boliye, yes, please speak).",
    },
    whoIsSpeaking: {
      words: [
        ["आप", "aap"],
        ["कौन", "kaun"],
        ["बोल", "bol"],
        ["रहे", "rahe"],
        ["हैं?", "hain?"],
      ],
      notes:
        "Polite. To a woman: आप कौन बोल रही हैं? Casual: कौन बोल रहा है? Answer: मैं रवि बोल रहा हूँ (it's Ravi speaking).",
    },
    callYouLater: {
      words: [
        ["मैं", "main"],
        ["आपको", "aapko"],
        ["बाद", "baad"],
        ["में", "mein"],
        ["फ़ोन", "fon"],
        ["करूँगा", "karoongaa"],
      ],
      blank: 2,
      notes:
        "A woman says: मैं आपको बाद में फ़ोन करूँगी (karoongee). To a friend: मैं तुम्हें बाद में फ़ोन करता हूँ.",
    },
    canYouHearMe: {
      words: [
        ["क्या", "kyaa"],
        ["आपको", "aapko"],
        ["मेरी", "meree"],
        ["आवाज़", "aavaaz"],
        ["आ", "aa"],
        ["रही", "rahee"],
        ["है?", "hai?"],
      ],
      blank: 3,
      notes:
        'Literally "is my voice coming to you?" — how Hindi asks this on the phone. Short: आवाज़ आ रही है? Answer: हाँ, आ रही है.',
    },
    justAMinute: {
      words: [
        ["एक", "ek"],
        ["मिनट", "minat"],
      ],
      notes:
        "Also ज़रा रुकिए (zaraa rukiye, wait a moment) and बस एक मिनट (bas ek minat, just one minute).",
    },
    // Everyday conversations › Asking for help (lesson "conv-help")
    whatIsTheNameOfThisPlace: {
      words: [
        ["इस", "is"],
        ["जगह", "jagah"],
        ["का", "kaa"],
        ["नाम", "naam"],
        ["क्या", "kyaa"],
        ["है?", "hai?"],
      ],
      blank: 1,
      notes:
        'Literally "this place\'s name is what?". Also: यह कौन-सी जगह है? (which place is this?).',
    },
    ofCourse: {
      words: [["ज़रूर", "zaroor"]],
      notes:
        "Also written जरूर. Polite: जी, ज़रूर (jee, zaroor). Also: हाँ, क्यों नहीं (haan, kyon nahin, yes, why not).",
    },
    // Grammar & sentence building › I, you, he, she… (lesson "pronouns")
    youCasual: {
      script: "तुम",
      roman: "tum",
      notes:
        "For friends, younger people and family. Verb: तुम कैसे हो? Even more intimate (or rude to strangers) is तू (too): तू कैसा है? Polite: आप.",
    },
    he: {
      script: "वो",
      roman: "vo",
      notes:
        "The everyday spoken form of वह (vah). Hindi uses the same word for he, she and that — the verb shows gender: वो आता है (he comes) / वो आती है (she comes). Someone near is ये (ye). For respect use the plural: वे / वो आते हैं.",
    },
    she: {
      script: "वे",
      roman: "ve",
      meaning: "She (respectful)",
      accept: ["she"],
      notes:
        'Plain "she" is वह / वो, exactly like "he": वह चाय पीती है. For a woman you respect (mother, teacher) Hindi uses the plural वे (spoken वो) with a plural verb: वे डॉक्टर हैं.',
    },
    we: {
      script: "हम",
      roman: "ham",
      notes:
        'हम लोग (ham log) is also common. In some regions (e.g. Bihar, eastern UP) हम is used for "I".',
    },
    they: {
      script: "वे लोग",
      roman: "ve log",
      meaning: "They (those people)",
      accept: ["they"],
      notes:
        "The pronoun is वे (ve), spoken वो (vo); adding लोग (log, people) makes it clear you mean several people. Near: ये लोग (these people).",
    },
    itPronoun: {
      script: "ये",
      roman: "ye",
      meaning: "It (this thing)",
      accept: ["it"],
      notes:
        'Hindi has no separate "it": use यह/ये for something near and वह/वो for something far. ये is the spoken form of यह.',
    },
    // Grammar & sentence building › Word order & the present (lesson "word-order")
    iEatRice: {
      words: [
        ["मैं", "main"],
        ["चावल", "chaaval"],
        ["खाता", "khaataa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: 'Subject – object – verb: "I rice eat am". A woman says: मैं चावल खाती हूँ (khaatee).',
    },
    sheDrinksTea: {
      words: [
        ["वह", "vah"],
        ["चाय", "chaay"],
        ["पीती", "peetee"],
        ["है", "hai"],
      ],
      blank: 1,
      notes: 'पीती (feminine) shows it is "she". "He drinks tea": वह चाय पीता है (peetaa).',
    },
    weGoToCollege: {
      words: [
        ["हम", "ham"],
        ["कॉलेज", "kolej"],
        ["जाते", "jaate"],
        ["हैं", "hain"],
      ],
      blank: 1,
      notes:
        "If all the speakers are women: हम कॉलेज जाती हैं (jaatee), though many women use जाते with हम too.",
    },
    heReadsABook: {
      words: [
        ["वह", "vah"],
        ["किताब", "kitaab"],
        ["पढ़ता", "padhtaa"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Hindi has no "a/the"; एक किताब (ek kitaab) is used only to stress "one book". She reads: वह किताब पढ़ती है.',
    },
    theyLiveInIndia: {
      words: [
        ["वे", "ve"],
        ["भारत", "bhaarat"],
        ["में", "mein"],
        ["रहते", "rahte"],
        ["हैं", "hain"],
      ],
      blank: 1,
      notes: "Spoken: वो लोग भारत में रहते हैं. में (in) comes after भारत.",
    },
    myMotherCooksFood: {
      words: [
        ["मेरी", "meree"],
        ["माँ", "maa"],
        ["खाना", "khaanaa"],
        ["बनाती", "banaatee"],
        ["हैं", "hain"],
      ],
      blank: 3,
      notes:
        'Literally "my mother food makes" — हैं (plural) is used out of respect for a mother. पकाती हैं (pakaatee) is also correct but less common.',
    },
    iSpeakEnglish: {
      words: [
        ["मैं", "main"],
        ["अंग्रेज़ी", "angrezee"],
        ["बोलता", "boltaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes:
        "A woman says: मैं अंग्रेज़ी बोलती हूँ. Also: मुझे अंग्रेज़ी आती है (I know English — same for both).",
    },
    // Grammar & sentence building › Past & future (lesson "past-future")
    iAteRice: {
      words: [
        ["मैंने", "mainne"],
        ["चावल", "chaaval"],
        ["खाए", "khaae"],
      ],
      blank: 1,
      notes:
        'Past tense of transitive verbs uses मैंने (mainne, "by me") and the verb agrees with the object (चावल, plural) — so men and women say it the same way. Many speakers also say मैंने चावल खाया.',
    },
    iWillEatRice: {
      words: [
        ["मैं", "main"],
        ["चावल", "chaaval"],
        ["खाऊँगा", "khaaoongaa"],
      ],
      blank: 1,
      notes: "A woman says: मैं चावल खाऊँगी (khaaoongee). Future = stem + ऊँगा/ऊँगी.",
    },
    iWentToTheMarketYesterday: {
      words: [
        ["मैं", "main"],
        ["कल", "kal"],
        ["बाज़ार", "baazaar"],
        ["गया", "gayaa"],
        ["था", "thaa"],
      ],
      blank: 2,
      notes:
        "A woman says: मैं कल बाज़ार गई थी (gaee thee). जाना has no ने in the past, so the verb follows the speaker's gender. Also simply मैं कल बाज़ार गया.",
    },
    iWillGoTomorrow: {
      words: [
        ["मैं", "main"],
        ["कल", "kal"],
        ["जाऊँगा", "jaaoongaa"],
      ],
      blank: 2,
      notes: "A woman says: मैं कल जाऊँगी (jaaoongee). कल + future = tomorrow.",
    },
    sheCameYesterday: {
      words: [
        ["वह", "vah"],
        ["कल", "kal"],
        ["आई", "aaee"],
        ["थी", "thee"],
      ],
      blank: 2,
      notes:
        'आई थी is feminine; "he came yesterday" is वह कल आया था (aayaa thaa). Spoken: वो कल आई थी.',
    },
    weWillComeTomorrow: {
      words: [
        ["हम", "ham"],
        ["कल", "kal"],
        ["आएँगे", "aaenge"],
      ],
      blank: 2,
      notes: "Polite reply to an invitation. All-women group: हम कल आएँगी (aaengee).",
    },
    // Grammar & sentence building › Questions & negatives (lesson "questions-negatives")
    why: {
      script: "क्यों",
      roman: "kyon",
      notes: 'Why not?: क्यों नहीं? — also means "of course".',
    },
    how: {
      script: "कैसे",
      roman: "kaise",
      notes: 'Also "what kind": कैसा (kaisaa), कैसी (kaisee): मौसम कैसा है? (how is the weather?).',
    },
    which: {
      script: "कौन-सा",
      roman: "kaun-saa",
      notes:
        "Agrees with the noun: कौन-सा दिन, कौन-सी किताब (kaun-see), कौन-से लोग (kaun-se). Also written कौन सा.",
    },
    doYouEatMeat: {
      words: [
        ["क्या", "kyaa"],
        ["आप", "aap"],
        ["मांस", "maans"],
        ["खाते", "khaate"],
        ["हैं?", "hain?"],
      ],
      blank: 2,
      notes:
        "To a woman: क्या आप मांस खाती हैं? In practice people ask: आप नॉन-वेज खाते हैं? Many Indians are vegetarian, so this is a common, polite question.",
    },
    iDontKnow: {
      words: [
        ["मुझे", "mujhe"],
        ["नहीं", "nahin"],
        ["पता", "pataa"],
      ],
      notes:
        'Literally "to me (it is) not known" — the same for men and women. Also: मैं नहीं जानता (a woman: नहीं जानती).',
    },
    isThisYourBook: {
      words: [
        ["क्या", "kyaa"],
        ["यह", "yah"],
        ["आपकी", "aapkee"],
        ["किताब", "kitaab"],
        ["है?", "hai?"],
      ],
      blank: 2,
      notes: "आपकी (feminine) because किताब is feminine. Casual: क्या यह तुम्हारी किताब है?",
    },
    thisIsNotMyBook: {
      words: [
        ["यह", "yah"],
        ["मेरी", "meree"],
        ["किताब", "kitaab"],
        ["नहीं", "nahin"],
        ["है", "hai"],
      ],
      blank: 3,
      notes: "नहीं goes just before the verb. In speech है is often dropped: यह मेरी किताब नहीं.",
    },
    whyAreYouLate: {
      words: [
        ["आपको", "aapko"],
        ["देर", "der"],
        ["क्यों", "kyon"],
        ["हो", "ho"],
        ["गई?", "gaee?"],
      ],
      blank: 2,
      notes:
        'Literally "why did delay happen to you?" — same for men and women. Casual: तुम लेट क्यों हो गए? (to a woman: हो गईं / हो गई).',
    },
    howDoYouGoToCollege: {
      words: [
        ["आप", "aap"],
        ["कॉलेज", "kolej"],
        ["कैसे", "kaise"],
        ["जाते", "jaate"],
        ["हैं?", "hain?"],
      ],
      blank: 2,
      notes:
        "To a woman: आप कॉलेज कैसे जाती हैं? Answer: बस से (by bus), मेट्रो से, पैदल (on foot).",
    },
    // Grammar & sentence building › My, your & small words (lesson "possession")
    inPostposition: {
      script: "में",
      roman: "mein",
      notes: "Comes after the noun: घर में (in the house), दिल्ली में (in Delhi).",
    },
    onPostposition: {
      script: "पर",
      roman: "par",
      notes:
        'After the noun: मेज़ पर (on the table). Also "at": घर पर (at home). Spoken also as पे (pe).',
    },
    withPostposition: {
      script: "के साथ",
      roman: "ke saath",
      notes: 'After the noun: दोस्त के साथ (with a friend). "By means of" uses से: बस से (by bus).',
    },
    fromPostposition: {
      script: "से",
      roman: "se",
      notes:
        'After the noun: घर से (from home). Also "by/with" and "than": बस से, मुझसे बड़ा (older than me).',
    },
    table: {
      script: "मेज़",
      roman: "mez",
      notes: "Also English टेबल (tebal), very common. Feminine: मेज़ बड़ी है.",
    },
    thisIsMyBook: {
      words: [
        ["यह", "yah"],
        ["मेरी", "meree"],
        ["किताब", "kitaab"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        "मेरा/मेरी/मेरे agrees with the thing owned (किताब is feminine), not with the owner. A man and a woman both say मेरी किताब.",
    },
    hisNameIsRavi: {
      words: [
        ["उसका", "uskaa"],
        ["नाम", "naam"],
        ["रवि", "Ravi"],
        ["है", "hai"],
      ],
      blank: 0,
      notes:
        "उसका = his or her (agreeing with नाम, masculine). Her name is Asha: उसका नाम आशा है. Respectful: उनका नाम (unkaa naam).",
    },
    theBookIsOnTheTable: {
      words: [
        ["किताब", "kitaab"],
        ["मेज़", "mez"],
        ["पर", "par"],
        ["है", "hai"],
      ],
      blank: 2,
      notes: 'Literally "book table-on is". Postpositions follow the noun.',
    },
    iGoWithMyFriend: {
      words: [
        ["मैं", "main"],
        ["अपने", "apne"],
        ["दोस्त", "dost"],
        ["के", "ke"],
        ["साथ", "saath"],
        ["जाता", "jaataa"],
        ["हूँ", "hoon"],
      ],
      blank: 4,
      notes:
        'A woman says: ... जाती हूँ. अपना/अपने (apnaa/apne) = "one\'s own" replaces मेरा when the owner is the subject.',
    },
    sheIsComingFromHome: {
      words: [
        ["वह", "vah"],
        ["घर", "ghar"],
        ["से", "se"],
        ["आ", "aa"],
        ["रही", "rahee"],
        ["है", "hai"],
      ],
      blank: 2,
      notes: 'रही (feminine) shows "she". He: वह घर से आ रहा है.',
    },
    // Grammar & sentence building › Polite & casual (lesson "polite-casual")
    comeCasual: {
      words: [["आओ!", "aao!"]],
      notes:
        "With तुम (friends, younger people). With तू (very close or a child): आ! (aa). Polite: आइए (aaiye).",
    },
    comePolite: {
      words: [["आइए", "aaiye"]],
      notes:
        "With आप — for guests, elders and strangers. Hosts often double it: आइए, आइए! Also आइए, बैठिए (come in, sit down).",
    },
    sitCasual: {
      words: [["बैठो!", "baitho!"]],
      notes: "With तुम. With तू: बैठ! (baith). Polite: बैठिए.",
    },
    sitPolite: {
      words: [["बैठिए", "baithiye"]],
      notes:
        "With आप. Extra polite: तशरीफ़ रखिए (tashreef rakhiye, a refined Lucknowi expression).",
    },
    eatPolite: {
      words: [
        ["लीजिए,", "leejiye,"],
        ["खाइए", "khaaiye"],
      ],
      notes:
        'Literally "please take, please eat" — what a host says when serving. Hosts insist: और लीजिए (aur leejiye, have some more). To a friend: खाओ (khaao).',
    },
    howAreYouCasual: {
      words: [
        ["तुम", "tum"],
        ["कैसे", "kaise"],
        ["हो?", "ho?"],
      ],
      notes:
        "To a female friend: तुम कैसी हो? (kaisee). Very casual: क्या हाल है? / कैसा है? (with तू). Polite: आप कैसे हैं?",
    },
    // Feelings, health & relationships › How do you feel? (lesson "feelings")
    happy: {
      script: "ख़ुश",
      roman: "khush",
      notes: "Also written खुश. Does not change for gender. Formal: प्रसन्न (prasann).",
    },
    sad: { script: "उदास", roman: "udaas", notes: "Also दुखी (dukhee, unhappy, suffering)." },
    angry: {
      script: "नाराज़",
      roman: "naaraaz",
      notes:
        "नाराज़ = upset/angry (with someone). The noun anger is ग़ुस्सा (gussaa): उसे ग़ुस्सा आया (he/she got angry).",
    },
    tired: {
      script: "थका हुआ",
      roman: "thakaa huaa",
      notes: "Feminine: थकी हुई (thakee huee). Verb: थकना (to get tired).",
    },
    scared: {
      script: "डरा हुआ",
      roman: "daraa huaa",
      notes: "Feminine: डरी हुई (daree huee). Fear: डर (dar).",
    },
    worried: {
      script: "परेशान",
      roman: "pareshaan",
      notes:
        "Also means troubled/bothered: परेशान मत करो (don't bother me). Formal: चिंतित (chintit).",
    },
    iAmHappy: {
      words: [
        ["मैं", "main"],
        ["ख़ुश", "khush"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "Same for men and women. Very happy: मैं बहुत ख़ुश हूँ.",
    },
    iAmSad: {
      words: [
        ["मैं", "main"],
        ["उदास", "udaas"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: "Same for men and women. Also: मेरा मन उदास है (my heart is sad).",
    },
    iAmTired: {
      words: [
        ["मैं", "main"],
        ["थक", "thak"],
        ["गया", "gayaa"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: 'Literally "I have got tired". A woman says: मैं थक गई हूँ (gaee).',
    },
    // Feelings, health & relationships › I'm okay, don't worry (lesson "feelings-2")
    iAmAngry: {
      words: [
        ["मुझे", "mujhe"],
        ["ग़ुस्सा", "gussaa"],
        ["आ", "aa"],
        ["रहा", "rahaa"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "anger is coming to me" — same for men and women. Angry with someone: मैं तुमसे नाराज़ हूँ (I\'m upset with you).',
    },
    iAmOkay: {
      words: [
        ["मैं", "main"],
        ["ठीक-ठाक", "theek-thaak"],
        ["हूँ", "hoon"],
      ],
      blank: 1,
      notes: 'ठीक-ठाक = okay, so-so, alright. मैं ठीक हूँ is "I\'m fine". Same for men and women.',
    },
    iAmNotFeelingWell: {
      words: [
        ["मेरी", "meree"],
        ["तबीयत", "tabeeyat"],
        ["ठीक", "theek"],
        ["नहीं", "nahin"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "my health is not fine" — the natural way to say you\'re unwell; same for men and women. Asking: आपकी तबीयत कैसी है?',
    },
    dontWorry: {
      words: [
        ["चिंता", "chintaa"],
        ["मत", "mat"],
        ["कीजिए", "keejiye"],
      ],
      notes:
        "Polite. Casual: चिंता मत करो or फ़िक्र मत करो (fikr mat karo). Very common among young people: टेंशन मत लो (tenshan mat lo).",
    },
    iAmScared: {
      words: [
        ["मुझे", "mujhe"],
        ["डर", "dar"],
        ["लग", "lag"],
        ["रहा", "rahaa"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "fear is striking me" — same for men and women. Also: मैं डर गया हूँ (a woman: डर गई हूँ).',
    },
    // Feelings, health & relationships › The body (lesson "body")
    head: { script: "सिर", roman: "sir", notes: "Also written सर (sar)." },
    hand: {
      script: "हाथ",
      roman: "haath",
      notes: "Also covers the arm in everyday speech. Eat with the right hand.",
    },
    leg: {
      script: "पैर",
      roman: "pair",
      notes:
        "पैर = foot or leg. टाँग (taang) = leg specifically. Touching an elder's feet (पैर छूना) is a sign of respect.",
    },
    eye: { script: "आँख", roman: "aankh", notes: "Plural: आँखें (aankhen)." },
    ear: { script: "कान", roman: "kaan" },
    mouth: {
      script: "मुँह",
      roman: "munh",
      notes: 'Wash your face: मुँह धोना (literally "wash the mouth").',
    },
    stomach: { script: "पेट", roman: "pet" },
    tooth: {
      script: "दाँत",
      roman: "daant",
      notes: "Same form for one tooth or teeth. Toothache: दाँत में दर्द.",
    },
    // Feelings, health & relationships › At the doctor (lesson "health")
    fever: {
      script: "बुख़ार",
      roman: "bukhaar",
      notes: "Also written बुखार. Temperature: तापमान or just टेम्परेचर.",
    },
    medicine: {
      script: "दवाई",
      roman: "davaaee",
      notes: "Also दवा (davaa). Tablet: गोली (golee). Pharmacy: दवाई की दुकान / मेडिकल स्टोर.",
    },
    iHaveAFever: {
      words: [
        ["मुझे", "mujhe"],
        ["बुख़ार", "bukhaar"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "to me fever is" — same for men and women. Also: मुझे बुख़ार आ गया है (I\'ve got a fever).',
    },
    iHaveAHeadache: {
      words: [
        ["मेरे", "mere"],
        ["सिर", "sir"],
        ["में", "mein"],
        ["दर्द", "dard"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "in my head there is pain". Also: मेरा सिर दुख रहा है (my head is aching). Same for men and women.',
    },
    myStomachHurts: {
      words: [
        ["मेरे", "mere"],
        ["पेट", "pet"],
        ["में", "mein"],
        ["दर्द", "dard"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "in my stomach there is pain". Same pattern for any body part: ... में दर्द है.',
    },
    iNeedADoctor: {
      words: [
        ["मुझे", "mujhe"],
        ["डॉक्टर", "doktar"],
        ["की", "kee"],
        ["ज़रूरत", "zaroorat"],
        ["है", "hai"],
      ],
      blank: 3,
      notes:
        'Literally "to me there is need of a doctor". Shorter: मुझे डॉक्टर के पास जाना है (I need to go to a doctor).',
    },
    callADoctor: {
      words: [
        ["डॉक्टर", "doktar"],
        ["को", "ko"],
        ["बुलाइए", "bulaaiye"],
      ],
      notes: "बुलाना = to call (someone over). Urgent and casual: जल्दी डॉक्टर को बुलाओ!",
    },
    takeThisMedicine: {
      words: [
        ["यह", "yah"],
        ["दवाई", "davaaee"],
        ["लीजिए", "leejiye"],
      ],
      blank: 1,
      notes:
        'Medicine is "taken" (लेना) or "eaten" (खाना): दवाई खा लो (casual). Doctors say दिन में तीन बार (three times a day).',
    },
    // Feelings, health & relationships › Love & friendship (lesson "love-friendship")
    iLoveYou: {
      words: [
        ["मैं", "main"],
        ["तुमसे", "tumse"],
        ["प्यार", "pyaar"],
        ["करता", "kartaa"],
        ["हूँ", "hoon"],
      ],
      blank: 2,
      notes:
        'Romantic and strong — said to a partner, rarely to family. A woman says: मैं तुमसे प्यार करती हूँ (kartee). With आप: मैं आपसे प्यार करता हूँ. Many couples simply say "I love you" in English.',
    },
    iLikeYou: {
      words: [
        ["तुम", "tum"],
        ["मुझे", "mujhe"],
        ["अच्छे", "achchhe"],
        ["लगते", "lagte"],
        ["हो", "ho"],
      ],
      notes:
        'Literally "you seem good to me" — a gentle way to say you like someone. To a woman: तुम मुझे अच्छी लगती हो (achchhee lagtee ho). Also: मुझे तुम पसंद हो (mujhe tum pasand ho).',
    },
    iMissYou: {
      words: [
        ["मुझे", "mujhe"],
        ["तुम्हारी", "tumhaaree"],
        ["याद", "yaad"],
        ["आ", "aa"],
        ["रही", "rahee"],
        ["है", "hai"],
      ],
      blank: 2,
      notes:
        'Literally "your memory is coming to me" — same for men and women, and fine for friends and family too. Respectful: मुझे आपकी याद आ रही है. In general: मुझे तुम्हारी याद आती है. "Miss you" in English is common in messages.',
    },
    iLoveMyFamily: {
      words: [
        ["मैं", "main"],
        ["अपने", "apne"],
        ["परिवार", "parivaar"],
        ["से", "se"],
        ["बहुत", "bahut"],
        ["प्यार", "pyaar"],
        ["करता", "kartaa"],
        ["हूँ", "hoon"],
      ],
      blank: 2,
      notes:
        "A woman says: ... प्यार करती हूँ. People rarely say this out loud to family; affection is shown by actions. More everyday: मेरा परिवार मेरे लिए सब कुछ है (my family is everything to me).",
    },
    youAreMyFriend: {
      words: [
        ["तुम", "tum"],
        ["मेरे", "mere"],
        ["दोस्त", "dost"],
        ["हो", "ho"],
      ],
      blank: 2,
      notes:
        "To a female friend: तुम मेरी दोस्त हो (meree). Respectful: आप मेरे दोस्त हैं. Friends also say तू मेरा यार है (very casual, warm).",
    },
    youAreMyBestFriend: {
      words: [
        ["तुम", "tum"],
        ["मेरे", "mere"],
        ["सबसे", "sabse"],
        ["अच्छे", "achchhe"],
        ["दोस्त", "dost"],
        ["हो", "ho"],
      ],
      blank: 2,
      notes:
        'Literally "you are my most good friend". To a female friend: तुम मेरी सबसे अच्छी दोस्त हो. Young people usually just say बेस्ट फ्रेंड: तू मेरा बेस्ट फ्रेंड है.',
    },
    iLikeThis: {
      words: [
        ["मुझे", "mujhe"],
        ["यह", "yah"],
        ["पसंद", "pasand"],
        ["है", "hai"],
      ],
      blank: 2,
      notes:
        'Literally "to me this is liked" — same for men and women. For something you just tried: मुझे यह अच्छा लगा (I liked it).',
    },
    iDontLikeThis: {
      words: [
        ["मुझे", "mujhe"],
        ["यह", "yah"],
        ["पसंद", "pasand"],
        ["नहीं", "nahin"],
        ["है", "hai"],
      ],
      blank: 2,
      notes: "Same for men and women. Softer: मुझे यह ज़्यादा पसंद नहीं (I don't like it much).",
    },
    takeCare: {
      words: [
        ["अपना", "apnaa"],
        ["ख़याल", "khayaal"],
        ["रखिए", "rakhiye"],
      ],
      blank: 1,
      notes:
        'Literally "keep care of yourself". Casual: अपना ख़याल रखना (rakhnaa). Also spelled ख़्याल / खयाल. "Take care" in English is very common.',
    },
    // Practical communication › Weather (lesson "weather")
    weather: {
      script: "मौसम",
      roman: "mausam",
      notes: 'Also means "season": बारिश का मौसम (the rainy season).',
    },
    hot: {
      script: "गर्म",
      roman: "garm",
      notes:
        "Also written गरम (garam). For things: गर्म चाय. For weather people use the noun गर्मी (heat): आज गर्मी है.",
    },
    cold: {
      script: "ठंडा",
      roman: "thandaa",
      notes:
        "For things: ठंडा पानी (cold water). For weather use the noun ठंड (thand) or सर्दी (sardee): आज ठंड है.",
    },
    rain: {
      script: "बारिश",
      roman: "baarish",
      notes: "Also बरसात (barsaat, the rains / monsoon). Feminine: बारिश हो रही है.",
    },
    sun: {
      script: "सूरज",
      roman: "sooraj",
      notes: "Sunshine is धूप (dhoop): आज धूप है (it's sunny today). Formal: सूर्य (soorya).",
    },
    wind: {
      script: "हवा",
      roman: "havaa",
      notes: 'Also "air". Strong wind / storm: आँधी (aandhee).',
    },
    itIsHotToday: {
      words: [
        ["आज", "aaj"],
        ["गर्मी", "garmee"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "today there is heat". Very common: आज बहुत गर्मी है (it\'s really hot today) — Delhi summers go above 45 °C.',
    },
    itIsRaining: {
      words: [
        ["बारिश", "baarish"],
        ["हो", "ho"],
        ["रही", "rahee"],
        ["है", "hai"],
      ],
      blank: 0,
      notes: 'Literally "rain is happening". बारिश is feminine, so रही.',
    },
    itIsColdToday: {
      words: [
        ["आज", "aaj"],
        ["ठंड", "thand"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "today there is cold". Also: आज बहुत सर्दी है. North Indian winters are foggy and cold.',
    },
    // Practical communication › College & work (lesson "college-work")
    classroom: {
      script: "क्लास",
      roman: "klaas",
      notes:
        "Students say क्लास for both the class and the classroom. Formal: कक्षा (kakshaa). Lecture: लेक्चर.",
    },
    exam: {
      script: "परीक्षा",
      roman: "pareekshaa",
      notes: "Students mostly say एग्ज़ाम (egzaam). Test: टेस्ट. Result: रिज़ल्ट / परिणाम.",
    },
    homework: {
      script: "होमवर्क",
      roman: "homvark",
      notes: "Formal: गृहकार्य (grihakaarya), seen in school books.",
    },
    job: {
      script: "नौकरी",
      roman: "naukaree",
      notes:
        "A (salaried) job. Work in general: काम (kaam). Government job: सरकारी नौकरी — much sought after.",
    },
    holiday: {
      script: "छुट्टी",
      roman: "chhuttee",
      notes:
        "Holiday / leave / day off. On leave: छुट्टी पर. Holidays (vacation): छुट्टियाँ (chhuttiyaan).",
    },
    iHaveAnExamTomorrow: {
      words: [
        ["कल", "kal"],
        ["मेरी", "meree"],
        ["परीक्षा", "pareekshaa"],
        ["है", "hai"],
      ],
      blank: 2,
      notes:
        'Literally "tomorrow my exam is" — same for men and women. Students say: कल मेरा एग्ज़ाम है (एग्ज़ाम is masculine).',
    },
    todayIsAHoliday: {
      words: [
        ["आज", "aaj"],
        ["छुट्टी", "chhuttee"],
        ["है", "hai"],
      ],
      blank: 1,
      notes: "Also: आज मेरी छुट्टी है (I'm off today).",
    },
    iWorkInAnOffice: {
      words: [
        ["मैं", "main"],
        ["एक", "ek"],
        ["दफ़्तर", "daftar"],
        ["में", "mein"],
        ["काम", "kaam"],
        ["करता", "kartaa"],
        ["हूँ", "hoon"],
      ],
      blank: 2,
      notes:
        "A woman says: ... काम करती हूँ (kartee). Everyday: मैं ऑफ़िस में काम करता हूँ; or name the type: मैं एक कंपनी में काम करता हूँ.",
    },
    // Practical communication › Hobbies & likes (lesson "hobbies")
    music: {
      script: "संगीत",
      roman: "sangeet",
      notes:
        "Young people often say म्यूज़िक (myoozik). Also the name of a pre-wedding music night (संगीत).",
    },
    movie: {
      script: "फ़िल्म",
      roman: "film",
      notes: 'Also पिक्चर (pikchar) and सिनेमा. Hindi films are made in Mumbai ("Bollywood").',
    },
    song: {
      script: "गाना",
      roman: "gaanaa",
      notes: 'गाना is also the verb "to sing": गाना गाना (to sing a song). Formal: गीत (geet).',
    },
    cricket: {
      script: "क्रिकेट",
      roman: "kriket",
      notes: "India's favourite sport; street cricket in lanes is गली क्रिकेट.",
    },
    dance: {
      script: "नाच",
      roman: "naach",
      notes: "Verb: नाचना (naachnaa). English डांस is common; classical/formal: नृत्य (nritya).",
    },
    iLikeMusic: {
      words: [
        ["मुझे", "mujhe"],
        ["संगीत", "sangeet"],
        ["पसंद", "pasand"],
        ["है", "hai"],
      ],
      blank: 1,
      notes: "Same for men and women. Young people: मुझे म्यूज़िक पसंद है.",
    },
    doYouLikeCricket: {
      words: [
        ["क्या", "kyaa"],
        ["आपको", "aapko"],
        ["क्रिकेट", "kriket"],
        ["पसंद", "pasand"],
        ["है?", "hai?"],
      ],
      blank: 2,
      notes: "Casual: तुम्हें क्रिकेट पसंद है? (tumhen kriket pasand hai?).",
    },
    iLikeWatchingMovies: {
      words: [
        ["मुझे", "mujhe"],
        ["फ़िल्में", "filmen"],
        ["देखना", "dekhnaa"],
        ["पसंद", "pasand"],
        ["है", "hai"],
      ],
      blank: 1,
      notes:
        'Literally "to me watching films is liked". The infinitive (देखना) works like "watching". Same for men and women.',
    },
    whatIsYourHobby: {
      words: [
        ["आपका", "aapkaa"],
        ["शौक़", "shauq"],
        ["क्या", "kyaa"],
        ["है?", "hai?"],
      ],
      blank: 1,
      notes:
        "Also written शौक. Many people use English: आपकी हॉबी क्या है? Or: आपको क्या करना पसंद है? (what do you like doing?).",
    },
    // Practical communication › Plans & invitations (lesson "plans")
    letsGo: {
      words: [
        ["चलो", "chalo"],
        ["चलें", "chalen"],
      ],
      notes:
        'Very common: चलो! alone. Polite (to elders): चलिए (chaliye). Also चलते हैं (chalte hain, "let\'s get going" / "we\'ll be off").',
    },
    comeToMyHouse: {
      words: [
        ["मेरे", "mere"],
        ["घर", "ghar"],
        ["आइए", "aaiye"],
      ],
      blank: 1,
      notes:
        "Polite invitation. To a friend: मेरे घर आओ. Warm: कभी घर आइए (do come home sometime) — guests are treated as god (अतिथि देवो भव).",
    },
    areYouFreeTomorrow: {
      words: [
        ["क्या", "kyaa"],
        ["आप", "aap"],
        ["कल", "kal"],
        ["फ़्री", "free"],
        ["हैं?", "hain?"],
      ],
      blank: 3,
      notes: "Everyone says फ़्री. Hindi alternative: क्या आप कल ख़ाली हैं? Casual: कल फ़्री हो?",
    },
    yesIWillCome: {
      words: [
        ["हाँ,", "haan,"],
        ["मैं", "main"],
        ["आऊँगा", "aaoongaa"],
      ],
      notes: "A woman says: हाँ, मैं आऊँगी (aaoongee). Polite: जी हाँ, ज़रूर आऊँगा.",
    },
    sorryICantCome: {
      words: [
        ["माफ़", "maaf"],
        ["कीजिए,", "keejiye,"],
        ["मैं", "main"],
        ["नहीं", "nahin"],
        ["आ", "aa"],
        ["पाऊँगा", "paaoongaa"],
      ],
      notes:
        "A woman says: ... मैं नहीं आ पाऊँगी (paaoongee). पाना = to manage to. To a friend: सॉरी यार, मैं नहीं आ पाऊँगा.",
    },
    seeYouTomorrow: {
      words: [
        ["कल", "kal"],
        ["मिलते", "milte"],
        ["हैं", "hain"],
      ],
      notes: 'Literally "tomorrow (we) meet". Also: कल मिलेंगे (kal milenge).',
    },
    // Practical communication › Requests & help (lesson "requests-help")
    canYouHelpMe: {
      words: [
        ["क्या", "kyaa"],
        ["आप", "aap"],
        ["मेरी", "meree"],
        ["मदद", "madad"],
        ["कर", "kar"],
        ["सकते", "sakte"],
        ["हैं?", "hain?"],
      ],
      blank: 3,
      notes:
        'To a woman: ... कर सकती हैं? (saktee). मदद (help) takes मेरी: "my help". Casual: मेरी मदद करोगे?',
    },
    iNeedHelp: {
      words: [
        ["मुझे", "mujhe"],
        ["मदद", "madad"],
        ["चाहिए", "chaahiye"],
      ],
      blank: 1,
      notes: "Same for men and women. Formal word for help: सहायता (sahaayataa).",
    },
    pleaseHelpMe: {
      words: [
        ["कृपया", "kripyaa"],
        ["मेरी", "meree"],
        ["मदद", "madad"],
        ["कीजिए", "keejiye"],
      ],
      blank: 2,
      notes:
        "कृपया makes it extra polite; without it, मेरी मदद कीजिए is already polite. Casual: मेरी मदद करो.",
    },
    pleaseWait: {
      words: [
        ["ज़रा", "zaraa"],
        ["रुकिए", "rukiye"],
      ],
      notes:
        "ज़रा (a little) softens the request. Casual: रुको! (ruko). Longer: थोड़ा इंतज़ार कीजिए.",
    },
    pleaseTellMe: {
      words: [["बताइए", "bataaiye"]],
      notes:
        'Polite; also how shopkeepers say "yes, what can I do for you?". Casual: बताओ (bataao). Tell me the way: मुझे रास्ता बताइए.',
    },
    pleaseShowMe: {
      words: [
        ["ज़रा", "zaraa"],
        ["दिखाइए", "dikhaaiye"],
      ],
      notes: "Casual: दिखाओ (dikhaao). Show me that: वह दिखाइए.",
    },
    callMe: {
      words: [
        ["मुझे", "mujhe"],
        ["फ़ोन", "fon"],
        ["कीजिए", "keejiye"],
      ],
      blank: 1,
      notes: "Casual: मुझे फ़ोन करना / कॉल करना. Give me a missed call: मिस्ड कॉल दे देना.",
    },
    help: {
      words: [["बचाओ!", "bachaao!"]],
      notes:
        'Literally "save (me)!" — shouted in an emergency. For ordinary help use मदद (madad): मदद कीजिए! Police: पुलिस; emergency number 112.',
    },
    itsOkay: {
      words: [
        ["कोई", "koee"],
        ["बात", "baat"],
        ["नहीं", "nahin"],
      ],
      notes:
        'Literally "(it\'s) no matter" — the standard reply to "sorry" and a kind way to say "it\'s fine". Also: चलता है (chaltaa hai, it\'ll do) and ठीक है.',
    },
  },
  extras: [
    // greetings
    {
      key: "namaskaar",
      lesson: "greetings",
      topic: "Greetings",
      script: "नमस्कार",
      roman: "namaskaar",
      meaning: "Hello (formal)",
      notes: "A slightly more formal namaste, used by news readers, officials and on stage.",
    },
    {
      key: "ram-ram",
      lesson: "greetings",
      topic: "Greetings",
      script: "राम राम",
      roman: "raam raam",
      meaning: "Hello (traditional, rural North India)",
      notes:
        "Common greeting in villages of Rajasthan, Haryana and UP, especially among men. Also जय श्री कृष्ण, सत् श्री अकाल (Sikh greeting) and आदाब (in Lucknow).",
    },
    {
      key: "chaltaa-hoon",
      lesson: "greetings",
      topic: "Greetings",
      words: [
        ["चलता", "chaltaa"],
        ["हूँ", "hoon"],
      ],
      meaning: "I'll be off (goodbye)",
      notes:
        "The most natural way to take leave. A woman says चलती हूँ (chaltee hoon). Reply: ठीक है, फिर मिलेंगे.",
    },
    {
      key: "adaab",
      lesson: "greetings",
      topic: "Greetings",
      script: "आदाब",
      roman: "aadaab",
      meaning: "Respectful greeting (Lucknow / Urdu)",
      notes: "Said with a raised hand, part of Lucknow's famous तहज़ीब (courtesy).",
    },
    // polite-words
    {
      key: "jee",
      lesson: "polite-words",
      topic: "Polite words",
      script: "जी",
      roman: "jee",
      meaning: "Polite particle (yes / sir / madam)",
      notes:
        'Add जी to names and titles for respect (रवि जी, माता जी), say जी alone for a polite "yes", or जी? for "pardon?".',
    },
    {
      key: "jee-haan",
      lesson: "polite-words",
      topic: "Polite words",
      script: "जी हाँ",
      roman: "jee haan",
      meaning: "Yes (polite)",
      notes:
        "The polite yes to elders, teachers and customers. The polite no is जी नहीं (jee nahin).",
    },
    {
      key: "shukriyaa",
      lesson: "polite-words",
      topic: "Polite words",
      script: "शुक्रिया",
      roman: "shukriyaa",
      meaning: "Thanks",
      notes: "From Urdu; as common as धन्यवाद and a bit warmer. Many thanks: बहुत-बहुत शुक्रिया.",
    },
    {
      key: "achchhaa-jee",
      lesson: "polite-words",
      topic: "Polite words",
      script: "अच्छा जी",
      roman: "achchhaa jee",
      meaning: "Oh I see / alright (polite)",
      notes:
        'अच्छा is the all-purpose "oh, okay, I see"; with जी it sounds polite. A drawn-out अच्छा? means "really?".',
    },
    // things
    {
      key: "chaabee",
      lesson: "things",
      topic: "Everyday things",
      script: "चाबी",
      roman: "chaabee",
      meaning: "Key",
      notes: "Also written चाभी (chaabhee).",
    },
    {
      key: "kursee",
      lesson: "things",
      topic: "Everyday things",
      script: "कुर्सी",
      roman: "kursee",
      meaning: "Chair",
      notes: "Also a metaphor for power/position: कुर्सी की लड़ाई (fight for the chair).",
    },
    {
      key: "ghadee",
      lesson: "things",
      topic: "Everyday things",
      script: "घड़ी",
      roman: "ghadee",
      meaning: "Watch / clock",
      notes: 'Feminine. घड़ी also means "a moment".',
    },
    {
      key: "chashmaa",
      lesson: "things",
      topic: "Everyday things",
      script: "चश्मा",
      roman: "chashmaa",
      meaning: "Glasses (spectacles)",
      notes: "Singular in Hindi: मेरा चश्मा कहाँ है? (where are my glasses?).",
    },
    // actions
    {
      key: "samajhnaa",
      lesson: "actions",
      topic: "Actions",
      script: "समझना",
      roman: "samajhnaa",
      meaning: "To understand",
      notes: "समझ गया / समझ गई (got it). समझाना (samjhaanaa) = to explain.",
    },
    {
      key: "jaannaa",
      lesson: "actions",
      topic: "Actions",
      script: "जानना",
      roman: "jaannaa",
      meaning: "To know",
      notes: "मैं उसे जानता हूँ (I know him/her); a woman: जानती हूँ.",
    },
    {
      key: "milnaa",
      lesson: "actions",
      topic: "Actions",
      script: "मिलना",
      roman: "milnaa",
      meaning: "To meet / to get",
      notes: "किसी से मिलना = to meet someone; मुझे टिकट मिला = I got a ticket.",
    },
    {
      key: "rakhnaa",
      lesson: "actions",
      topic: "Actions",
      script: "रखना",
      roman: "rakhnaa",
      meaning: "To keep / to put",
      notes: "यहाँ रखिए (please put it here). Also in अपना ख़याल रखना (take care).",
    },
    // this-and-that
    {
      key: "idhar",
      lesson: "this-and-that",
      topic: "Directions",
      script: "इधर",
      roman: "idhar",
      meaning: "Over here / this way",
      notes: "Very common in speech instead of यहाँ: इधर आओ (come here).",
    },
    {
      key: "udhar",
      lesson: "this-and-that",
      topic: "Directions",
      script: "उधर",
      roman: "udhar",
      meaning: "Over there / that way",
      notes: "इधर-उधर = here and there.",
    },
    {
      key: "kuchh",
      lesson: "this-and-that",
      topic: "Questions",
      script: "कुछ",
      roman: "kuchh",
      meaning: "Something / some",
      notes: "कुछ नहीं = nothing; और कुछ? = anything else?",
    },
    // how-are-you
    {
      key: "kyaa-haal-hai",
      lesson: "how-are-you",
      topic: "Introductions",
      words: [
        ["क्या", "kyaa"],
        ["हाल", "haal"],
        ["है?", "hai?"],
      ],
      meaning: "How's it going?",
      notes: "Friendly and very common. Answer: सब ठीक है (all good) or बढ़िया (great).",
    },
    {
      key: "sab-badhiyaa",
      lesson: "how-are-you",
      topic: "Introductions",
      words: [
        ["सब", "sab"],
        ["बढ़िया", "badhiyaa"],
      ],
      meaning: "All great",
      notes:
        'Cheerful reply to "how are you?". बढ़िया (great) is used everywhere: बढ़िया खाना (great food).',
    },
    // where-from
    {
      key: "raajya",
      lesson: "where-from",
      topic: "Introductions",
      script: "राज्य",
      roman: "raajya",
      meaning: "State",
      notes:
        "Hindi is the main language of several states, e.g. उत्तर प्रदेश (Uttar Pradesh), राजस्थान, मध्य प्रदेश, बिहार.",
    },
    {
      key: "mohallaa",
      lesson: "where-from",
      topic: "Places",
      script: "मोहल्ला",
      roman: "mohallaa",
      meaning: "Neighbourhood / locality",
      notes: "Also कॉलोनी (kolonee) in newer areas.",
    },
    // understanding
    {
      key: "kyaa-kahaa",
      lesson: "understanding",
      topic: "Understanding",
      words: [
        ["क्या", "kyaa"],
        ["कहा?", "kahaa?"],
      ],
      meaning: "What did you say?",
      notes: "Polite: आपने क्या कहा? or just जी? (pardon?).",
    },
    {
      key: "bhaashaa",
      lesson: "understanding",
      topic: "Understanding",
      script: "भाषा",
      roman: "bhaashaa",
      meaning: "Language",
      notes: "Mother tongue: मातृभाषा (maatribhaashaa).",
    },
    // parents-children
    {
      key: "mammee",
      lesson: "parents-children",
      topic: "Family",
      script: "मम्मी",
      roman: "mammee",
      meaning: "Mum",
      notes: "What most city children call their mother; पापा (paapaa) for father.",
    },
    {
      key: "pitaajee",
      lesson: "parents-children",
      topic: "Family",
      script: "पिताजी",
      roman: "pitaajee",
      meaning: "Father (respectful)",
      notes: "Respectful way to talk about or address one's father; mother: माताजी (maataajee).",
    },
    // siblings
    {
      key: "bhaiyaa",
      lesson: "siblings",
      topic: "Family",
      script: "भैया",
      roman: "bhaiyaa",
      meaning: "Big brother (form of address)",
      notes:
        "Also the polite way to address any young man: shopkeepers, rickshaw drivers, waiters.",
    },
    {
      key: "deedee",
      lesson: "siblings",
      topic: "Family",
      script: "दीदी",
      roman: "deedee",
      meaning: "Big sister (form of address)",
      notes: "Also used for any slightly older woman, e.g. a senior at college.",
    },
    {
      key: "bhaabhee",
      lesson: "siblings",
      topic: "Family",
      script: "भाभी",
      roman: "bhaabhee",
      meaning: "Elder brother's wife",
      notes: "Also used for a friend's wife.",
    },
    {
      key: "rakshaabandhan",
      lesson: "siblings",
      topic: "Family",
      script: "रक्षाबंधन",
      roman: "rakshaabandhan",
      meaning: "Raksha Bandhan (festival of brothers and sisters)",
      notes:
        "Sisters tie a राखी (raakhee) thread on their brothers' wrists; brothers promise protection and give gifts.",
    },
    // grandparents
    {
      key: "chaachaa",
      lesson: "grandparents",
      topic: "Family",
      script: "चाचा",
      roman: "chaachaa",
      meaning: "Uncle (father's younger brother)",
      notes:
        "His wife: चाची (chaachee). Father's elder brother: ताऊ (taaoo), his wife ताई (taaee).",
    },
    {
      key: "mausee",
      lesson: "grandparents",
      topic: "Family",
      script: "मौसी",
      roman: "mausee",
      meaning: "Aunt (mother's sister)",
      notes: "Her husband: मौसा (mausaa). Saying goes: मौसी, माँ जैसी (a mausi is like a mother).",
    },
    {
      key: "maamee",
      lesson: "grandparents",
      topic: "Family",
      script: "मामी",
      roman: "maamee",
      meaning: "Aunt (mother's brother's wife)",
    },
    {
      key: "phoophaa",
      lesson: "grandparents",
      topic: "Family",
      script: "फूफा",
      roman: "phoophaa",
      meaning: "Uncle (father's sister's husband)",
      notes: "बुआ's husband. Also फूफा जी.",
    },
    // people
    {
      key: "ankal-aantee",
      lesson: "people",
      topic: "People",
      script: "अंकल-आंटी",
      roman: "ankal-aantee",
      meaning: "Uncle and aunty (any older man/woman)",
      notes: "Children and young people call any older neighbour or parent's friend अंकल / आंटी.",
    },
    {
      key: "sahelee",
      lesson: "people",
      topic: "People",
      script: "सहेली",
      roman: "sahelee",
      meaning: "Female friend (of a woman)",
      notes: "A woman's friend; a man would say दोस्त for a female friend.",
    },
    {
      key: "log",
      lesson: "people",
      topic: "People",
      script: "लोग",
      roman: "log",
      meaning: "People",
      notes: "Also makes plurals of pronouns: हम लोग (we), आप लोग (you all).",
    },
    // describing-people
    {
      key: "motaa",
      lesson: "describing-people",
      topic: "Describing people",
      script: "मोटा",
      roman: "motaa",
      meaning: "Fat / thick",
      notes: "Feminine मोटी. Can be rude about people; for things it means thick.",
    },
    {
      key: "patlaa",
      lesson: "describing-people",
      topic: "Describing people",
      script: "पतला",
      roman: "patlaa",
      meaning: "Thin",
      notes: "Feminine पतली. Also for thin dal or thin roti.",
    },
    {
      key: "hoshiyaar",
      lesson: "describing-people",
      topic: "Describing people",
      script: "होशियार",
      roman: "hoshiyaar",
      meaning: "Clever / smart",
      notes: "Also समझदार (samajhdaar, sensible).",
    },
    // food-staples
    {
      key: "paraathaa",
      lesson: "food-staples",
      topic: "Food",
      script: "पराठा",
      roman: "paraathaa",
      meaning: "Paratha (layered or stuffed flatbread)",
      notes:
        "A North Indian breakfast favourite: आलू पराठा with दही and अचार. Delhi has a famous पराँठे वाली गली.",
    },
    {
      key: "pooree",
      lesson: "food-staples",
      topic: "Food",
      script: "पूरी",
      roman: "pooree",
      meaning: "Puri (puffed fried bread)",
      notes: "Often eaten with आलू की सब्ज़ी, especially on festivals and Sundays.",
    },
    {
      key: "ghee",
      lesson: "food-staples",
      topic: "Food",
      script: "घी",
      roman: "ghee",
      meaning: "Ghee (clarified butter)",
    },
    {
      key: "achaar",
      lesson: "food-staples",
      topic: "Food",
      script: "अचार",
      roman: "achaar",
      meaning: "Pickle",
      notes: "Spicy mango, lime or chilli pickle, often homemade by grandmothers.",
    },
    // drinks
    {
      key: "lassee",
      lesson: "drinks",
      topic: "Drinks",
      script: "लस्सी",
      roman: "lassee",
      meaning: "Lassi (thick yogurt drink)",
      notes: "Sweet (मीठी) or salty (नमकीन); Punjab and Varanasi are famous for it.",
    },
    {
      key: "sharbat",
      lesson: "drinks",
      topic: "Drinks",
      script: "शरबत",
      roman: "sharbat",
      meaning: "Sherbet (sweet cold drink)",
      notes: "E.g. रूह अफ़ज़ा, बेल का शरबत, offered to guests in summer.",
    },
    {
      key: "jaljeeraa",
      lesson: "drinks",
      topic: "Drinks",
      script: "जलजीरा",
      roman: "jaljeeraa",
      meaning: "Jaljeera (cumin-spiced drink)",
      notes: "A tangy summer drink sold from carts in Delhi and Jaipur.",
    },
    // fruits-vegetables
    {
      key: "paneer",
      lesson: "fruits-vegetables",
      topic: "Food",
      script: "पनीर",
      roman: "paneer",
      meaning: "Paneer (cottage cheese)",
      notes: "The vegetarian favourite: पालक पनीर, शाही पनीर, पनीर टिक्का.",
    },
    {
      key: "gobhee",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      script: "गोभी",
      roman: "gobhee",
      meaning: "Cauliflower",
      notes: "फूलगोभी = cauliflower, पत्तागोभी = cabbage.",
    },
    {
      key: "bhindee",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      script: "भिंडी",
      roman: "bhindee",
      meaning: "Okra (lady's finger)",
    },
    {
      key: "amrood",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      script: "अमरूद",
      roman: "amrood",
      meaning: "Guava",
      notes: "Prayagraj (Allahabad) guavas are famous; eaten with salt and chilli.",
    },
    // hungry-thirsty
    {
      key: "khattaa",
      lesson: "hungry-thirsty",
      topic: "Food",
      script: "खट्टा",
      roman: "khattaa",
      meaning: "Sour",
      notes: "Feminine खट्टी. खट्टा-मीठा = sweet and sour.",
    },
    {
      key: "namkeen",
      lesson: "hungry-thirsty",
      topic: "Food",
      script: "नमकीन",
      roman: "namkeen",
      meaning: "Salty / savoury snack",
      notes: "Also the name for packaged savoury snacks (भुजिया, मिक्सचर).",
    },
    // ordering-food
    {
      key: "thaalee",
      lesson: "ordering-food",
      topic: "Restaurant",
      script: "थाली",
      roman: "thaalee",
      meaning: "Thali (set meal on a plate)",
      notes: "Roti, rice, dal, vegetables, curd and a sweet — Rajasthani थाली is famous.",
    },
    {
      key: "samosaa",
      lesson: "ordering-food",
      topic: "Food",
      script: "समोसा",
      roman: "samosaa",
      meaning: "Samosa",
      notes: "The classic tea-time snack, with चटनी. Plural: समोसे.",
    },
    {
      key: "chhole-bhature",
      lesson: "ordering-food",
      topic: "Food",
      script: "छोले भटूरे",
      roman: "chhole bhatoore",
      meaning: "Chole bhature (chickpeas with fried bread)",
      notes: "A Delhi and Punjab favourite.",
    },
    {
      key: "jalebee",
      lesson: "ordering-food",
      topic: "Food",
      script: "जलेबी",
      roman: "jalebee",
      meaning: "Jalebi (syrupy fried sweet)",
      notes:
        "Eaten hot, often with milk or rabri. In Indore and Bhopal पोहा-जलेबी is a classic breakfast.",
    },
    // food-review
    {
      key: "poha",
      lesson: "food-review",
      topic: "Food",
      script: "पोहा",
      roman: "pohaa",
      meaning: "Poha (flattened rice breakfast)",
      notes: "The signature breakfast of Bhopal and Indore.",
    },
    {
      key: "daal-baatee",
      lesson: "food-review",
      topic: "Food",
      script: "दाल बाटी चूरमा",
      roman: "daal baatee choormaa",
      meaning: "Dal baati churma (Rajasthani dish)",
      notes: "Baked wheat balls with dal and a sweet crumble — Rajasthan's best-known meal.",
    },
    {
      key: "biryaanee",
      lesson: "food-review",
      topic: "Food",
      script: "बिरयानी",
      roman: "biryaanee",
      meaning: "Biryani",
      notes: "Lucknow's अवधी (Awadhi) biryani is famous, along with its कबाब.",
    },
    // numbers
    {
      key: "aadhaa",
      lesson: "big-numbers",
      topic: "Numbers",
      script: "आधा",
      roman: "aadhaa",
      meaning: "Half",
      notes: "आधा घंटा = half an hour; आधा किलो = half a kilo.",
    },
    {
      key: "dedh",
      lesson: "big-numbers",
      topic: "Numbers",
      script: "डेढ़",
      roman: "dedh",
      meaning: "One and a half",
      notes:
        "Hindi has special words: डेढ़ (1½), ढाई (dhaaee, 2½); then साढ़े (saadhe) + number: साढ़े तीन (3½).",
    },
    {
      key: "laakh",
      lesson: "big-numbers",
      topic: "Numbers",
      script: "लाख",
      roman: "laakh",
      meaning: "Lakh (one hundred thousand)",
      notes: "दस लाख = one million. करोड़ (karod) = ten million.",
    },
    // time
    {
      key: "parson",
      lesson: "time",
      topic: "Time",
      script: "परसों",
      roman: "parson",
      meaning: "Day after tomorrow / day before yesterday",
      notes: "Like कल, the verb tense shows which one.",
    },
    {
      key: "baad-mein",
      lesson: "time",
      topic: "Time",
      words: [
        ["बाद", "baad"],
        ["में", "mein"],
      ],
      meaning: "Later",
      notes: "बाद में बात करते हैं = let's talk later.",
    },
    {
      key: "ghantaa",
      lesson: "time",
      topic: "Time",
      script: "घंटा",
      roman: "ghantaa",
      meaning: "Hour",
      notes: "Two hours: दो घंटे. Minute: मिनट.",
    },
    // days
    {
      key: "taareekh",
      lesson: "days",
      topic: "Days",
      script: "तारीख़",
      roman: "taareekh",
      meaning: "Date",
      notes: "आज कौन-सी तारीख़ है? = What's the date today? Also तिथि (lunar date) for festivals.",
    },
    // routine
    {
      key: "taiyaar-honaa",
      lesson: "routine-verbs",
      topic: "Daily routine",
      script: "तैयार होना",
      roman: "taiyaar honaa",
      meaning: "To get ready",
      notes: "मैं तैयार हो रहा हूँ (I'm getting ready); a woman: हो रही हूँ.",
    },
    // places
    {
      key: "dhaabaa",
      lesson: "places-1",
      topic: "Places",
      script: "ढाबा",
      roman: "dhaabaa",
      meaning: "Dhaba (roadside eatery)",
      notes: "Simple, tasty, cheap food, especially on highways.",
    },
    {
      key: "galee",
      lesson: "places-2",
      topic: "Places",
      script: "गली",
      roman: "galee",
      meaning: "Lane / narrow street",
      notes: "Old Delhi and Lucknow are full of famous गलियाँ (lanes).",
    },
    {
      key: "chauraahaa",
      lesson: "position-words",
      topic: "Directions",
      script: "चौराहा",
      roman: "chauraahaa",
      meaning: "Crossroads / junction",
      notes: "Directions are given by landmarks: अगले चौराहे से बाएँ (left at the next crossing).",
    },
    {
      key: "gurudvaaraa",
      lesson: "places-2",
      topic: "Places",
      script: "गुरुद्वारा",
      roman: "gurudvaaraa",
      meaning: "Gurdwara (Sikh temple)",
      notes: "Everyone is welcome; cover your head and eat at the लंगर (free community kitchen).",
    },
    // shopping
    {
      key: "mol-bhaav",
      lesson: "money-words",
      topic: "Shopping",
      script: "मोल-भाव",
      roman: "mol-bhaav",
      meaning: "Bargaining",
      notes: "मोल-भाव करना = to bargain — expected in street markets.",
    },
    {
      key: "khulle-paise",
      lesson: "money-words",
      topic: "Shopping",
      words: [
        ["खुले", "khule"],
        ["पैसे", "paise"],
      ],
      meaning: "Change (small money)",
      notes: "खुले पैसे हैं? = Do you have change? Also छुट्टे (chhutte).",
    },
    {
      key: "gulaabee",
      lesson: "colours",
      topic: "Colours",
      script: "गुलाबी",
      roman: "gulaabee",
      meaning: "Pink",
      notes: "From गुलाब (rose). Jaipur is called the गुलाबी नगरी (Pink City).",
    },
    {
      key: "naarangee",
      lesson: "colours",
      topic: "Colours",
      script: "नारंगी",
      roman: "naarangee",
      meaning: "Orange (colour)",
      notes:
        "Also the fruit (orange) — though the fruit is usually संतरा (santaraa). Saffron colour: केसरिया.",
    },
    {
      key: "bhooraa",
      lesson: "colours",
      topic: "Colours",
      script: "भूरा",
      roman: "bhooraa",
      meaning: "Brown",
      notes: "Feminine भूरी.",
    },
    {
      key: "kurtaa",
      lesson: "clothes",
      topic: "Clothes",
      script: "कुर्ता",
      roman: "kurtaa",
      meaning: "Kurta (long tunic)",
      notes:
        "Worn by men and women; a short women's kurta is a कुर्ती (kurtee). कुर्ता-पजामा is classic festive wear.",
    },
    {
      key: "dupattaa",
      lesson: "clothes",
      topic: "Clothes",
      script: "दुपट्टा",
      roman: "dupattaa",
      meaning: "Dupatta (long scarf)",
      notes: "Worn with salwar kameez; also used to cover the head in temples and gurdwaras.",
    },
    // transport
    {
      key: "metro",
      lesson: "vehicles",
      topic: "Transport",
      script: "मेट्रो",
      roman: "metro",
      meaning: "Metro (city rail)",
      notes: "Delhi, Lucknow, Jaipur and Bhopal all have metros. मेट्रो से जाना = to go by metro.",
    },
    {
      key: "kiraayaa",
      lesson: "travel-words",
      topic: "Travel",
      script: "किराया",
      roman: "kiraayaa",
      meaning: "Fare / rent",
      notes: "किराया कितना है? = What's the fare? Also rent for a house.",
    },
    {
      key: "utarnaa",
      lesson: "travel-phrases",
      topic: "Travel",
      script: "उतरना",
      roman: "utarnaa",
      meaning: "To get off (a vehicle)",
      notes: "मुझे यहाँ उतरना है = I have to get off here. To get on: चढ़ना (chadhnaa).",
    },
    // conversations
    {
      key: "yaar",
      lesson: "conv-friend",
      topic: "Conversation",
      script: "यार",
      roman: "yaar",
      meaning: "Buddy / mate (filler)",
      notes: "Used constantly among friends: क्या यार! (oh come on!). Too casual for elders.",
    },
    {
      key: "are",
      lesson: "conv-friend",
      topic: "Conversation",
      script: "अरे",
      roman: "are",
      meaning: "Hey! / Oh! (exclamation)",
      notes: "Shows surprise or gets attention: अरे, तुम यहाँ? (oh, you're here?).",
    },
    {
      key: "naa",
      lesson: "conv-help",
      topic: "Conversation",
      script: "ना",
      roman: "naa",
      meaning: "Tag particle (…right? / please)",
      notes:
        "Softens requests and asks for agreement: बताओ ना (do tell me), आओ ना (come on, do come).",
    },
    {
      key: "pataa",
      lesson: "conv-help",
      topic: "Conversation",
      script: "पता",
      roman: "pataa",
      meaning: "Address / knowledge",
      notes:
        'Means both "address" and "known": मुझे पता है (I know); आपका पता क्या है? (what\'s your address?).',
    },
    {
      key: "laaibreree",
      lesson: "conv-college",
      topic: "College & work",
      script: "लाइब्रेरी",
      roman: "laaibreree",
      meaning: "Library",
      notes: "Formal: पुस्तकालय (pustakaalay), seen on signs.",
    },
    // grammar
    {
      key: "apnaa",
      lesson: "possession",
      topic: "Grammar",
      script: "अपना",
      roman: "apnaa",
      meaning: "One's own (my/your/his own)",
      notes:
        "Used instead of मेरा/तुम्हारा when the owner is the subject: मैं अपना काम करता हूँ (I do my work).",
    },
    {
      key: "mat",
      lesson: "questions-negatives",
      topic: "Grammar",
      script: "मत",
      roman: "mat",
      meaning: "Don't (in commands)",
      notes: "Negative for requests and orders: मत जाओ (don't go), चिंता मत कीजिए (don't worry).",
    },
    {
      key: "aap-log",
      lesson: "pronouns",
      topic: "Pronouns",
      words: [
        ["आप", "aap"],
        ["लोग", "log"],
      ],
      meaning: "You all (polite)",
      notes: "Polite plural you. Casual: तुम लोग (tum log).",
    },
    // feelings & health
    {
      key: "mazaa",
      lesson: "feelings",
      topic: "Feelings",
      script: "मज़ा",
      roman: "mazaa",
      meaning: "Fun / enjoyment",
      notes: "मज़ा आया! = It was fun! / I enjoyed it.",
    },
    {
      key: "galaa",
      lesson: "body",
      topic: "Body",
      script: "गला",
      roman: "galaa",
      meaning: "Throat / neck",
      notes: "Sore throat: गला ख़राब है / गले में दर्द है.",
    },
    {
      key: "naak",
      lesson: "body",
      topic: "Body",
      script: "नाक",
      roman: "naak",
      meaning: "Nose",
      notes: "Feminine. नाक कटना (to lose face) is a common idiom.",
    },
    {
      key: "zukaam",
      lesson: "health",
      topic: "Health",
      script: "ज़ुकाम",
      roman: "zukaam",
      meaning: "Cold (illness)",
      notes: "मुझे ज़ुकाम है = I have a cold. Also सर्दी-ज़ुकाम.",
    },
    {
      key: "khaansee",
      lesson: "health",
      topic: "Health",
      script: "खाँसी",
      roman: "khaansee",
      meaning: "Cough",
      notes: "मुझे खाँसी है = I have a cough.",
    },
    {
      key: "yaad",
      lesson: "love-friendship",
      topic: "Relationships",
      script: "याद",
      roman: "yaad",
      meaning: "Memory / remembrance",
      notes: "याद आना = to miss; याद रखना = to remember (keep in mind); याद है? = do you remember?",
    },
    // weather
    {
      key: "loo",
      lesson: "weather",
      topic: "Weather",
      script: "लू",
      roman: "loo",
      meaning: "Loo (scorching summer wind)",
      notes:
        "The hot, dry wind of May–June in Delhi, UP and Rajasthan. लू लगना = to get heatstroke.",
    },
    {
      key: "kohraa",
      lesson: "weather",
      topic: "Weather",
      script: "कोहरा",
      roman: "kohraa",
      meaning: "Fog",
      notes: "Dense winter fog delays trains in North India every December–January.",
    },
    {
      key: "sardee",
      lesson: "weather",
      topic: "Weather",
      script: "सर्दी",
      roman: "sardee",
      meaning: "Winter / cold",
      notes:
        "सर्दियाँ (sardiyaan) = winter; गर्मियाँ (garmiyaan) = summer; also सर्दी लगना = to feel cold.",
    },
    // college
    {
      key: "kaapee",
      lesson: "college-work",
      topic: "College & work",
      script: "कॉपी",
      roman: "kopee",
      meaning: "Notebook",
      notes: 'From English "copy"; the usual word for an exercise book.',
    },
    // hobbies
    {
      key: "patang",
      lesson: "hobbies",
      topic: "Hobbies",
      script: "पतंग",
      roman: "patang",
      meaning: "Kite",
      notes:
        "Kite flying (पतंगबाज़ी) is huge in Jaipur on Makar Sankranti and in Delhi on Independence Day.",
    },
    {
      key: "antaaksharee",
      lesson: "hobbies",
      topic: "Hobbies",
      script: "अंताक्षरी",
      roman: "antaaksharee",
      meaning: "Antakshari (song game)",
      notes:
        "A singing game: each song must start with the last letter of the previous one — a favourite on train journeys.",
    },
    // plans & festivals
    {
      key: "deevaalee",
      lesson: "plans",
      topic: "Plans & invitations",
      script: "दिवाली",
      roman: "divaalee",
      meaning: "Diwali (festival of lights)",
      notes:
        "Greeting: दिवाली की शुभकामनाएँ (best wishes for Diwali) or हैप्पी दिवाली. Also written दीवाली.",
    },
    {
      key: "holee",
      lesson: "plans",
      topic: "Plans & invitations",
      script: "होली",
      roman: "holee",
      meaning: "Holi (festival of colours)",
      notes:
        "Greeting: होली मुबारक / हैप्पी होली. Famous saying: बुरा न मानो, होली है! (don't mind, it's Holi!).",
    },
    {
      key: "shaadee",
      lesson: "plans",
      topic: "Plans & invitations",
      script: "शादी",
      roman: "shaadee",
      meaning: "Wedding / marriage",
      notes: "Wedding invitations come with sweets; going to a शादी is a big social event.",
    },
    {
      key: "eed-mubaarak",
      lesson: "plans",
      topic: "Plans & invitations",
      words: [
        ["ईद", "eed"],
        ["मुबारक", "mubaarak"],
      ],
      meaning: "Happy Eid",
      notes:
        "Lucknow and Bhopal celebrate Eid with सेवइयाँ (sweet vermicelli). मुबारक = congratulations.",
    },
    // requests
    {
      key: "zaraa",
      lesson: "requests-help",
      topic: "Requests & help",
      script: "ज़रा",
      roman: "zaraa",
      meaning: "A little / just (softener)",
      notes: "Makes requests gentler: ज़रा सुनिए (excuse me, listen a moment), ज़रा पानी दीजिए.",
    },
  ],
  dialogues: {
    meetingSomeone: {
      context: "Ravi (A) meets Asha (B) at a friend's house in Delhi.",
      lines: [
        { speaker: "A", script: "नमस्ते।", roman: "namaste.", meaning: "Hello." },
        { speaker: "B", script: "नमस्ते जी।", roman: "namaste jee.", meaning: "Hello." },
        {
          speaker: "A",
          script: "आपका नाम क्या है?",
          roman: "aapkaa naam kyaa hai?",
          meaning: "What is your name?",
        },
        {
          speaker: "B",
          script: "मेरा नाम आशा है। आपका नाम क्या है?",
          roman: "meraa naam Asha hai. aapkaa naam kyaa hai?",
          meaning: "My name is Asha. What is your name?",
        },
        {
          speaker: "A",
          script: "मेरा नाम रवि है। आप कहाँ से हैं?",
          roman: "meraa naam Ravi hai. aap kahaan se hain?",
          meaning: "My name is Ravi. Where are you from?",
        },
        {
          speaker: "B",
          script: "मैं जयपुर से हूँ। आपसे मिलकर अच्छा लगा।",
          roman: "main Jaipur se hoon. aapse milkar achchhaa lagaa.",
          meaning: "I am from Jaipur. Nice to meet you.",
        },
        {
          speaker: "A",
          script: "मुझे भी आपसे मिलकर अच्छा लगा।",
          roman: "mujhe bhee aapse milkar achchhaa lagaa.",
          meaning: "Nice to meet you too.",
        },
      ],
    },
    meetingFriend: {
      context:
        "Two college friends, Ravi (A) and Amit (B), bump into each other in a market in Lucknow.",
      lines: [
        {
          speaker: "A",
          script: "अरे अमित! कैसे हो?",
          roman: "are Amit! kaise ho?",
          meaning: "Hey Amit! How are you?",
        },
        {
          speaker: "B",
          script: "मैं ठीक हूँ। तुम सुनाओ?",
          roman: "main theek hoon. tum sunaao?",
          meaning: "I am fine. And you? (literally: you tell me)",
        },
        {
          speaker: "A",
          script: "मैं भी ठीक हूँ। बहुत दिनों बाद मिले!",
          roman: "main bhee theek hoon. bahut dinon baad mile!",
          meaning: "I am also fine. Long time no see!",
        },
        {
          speaker: "B",
          script: "हाँ। आजकल क्या कर रहे हो?",
          roman: "haan. aajkal kyaa kar rahe ho?",
          meaning: "Yes. What are you doing these days?",
        },
        {
          speaker: "A",
          script: "पढ़ाई कर रहा हूँ। तुमने खाना खाया?",
          roman: "padhaaee kar rahaa hoon. tumne khaanaa khaayaa?",
          meaning: "I am studying. Have you eaten?",
        },
        {
          speaker: "B",
          script: "हाँ, खा लिया। चलो, चाय पीते हैं।",
          roman: "haan, khaa liyaa. chalo, chaay peete hain.",
          meaning: "Yes, I have eaten. Let's have tea.",
        },
        {
          speaker: "A",
          script: "ठीक है, चलो।",
          roman: "theek hai, chalo.",
          meaning: "Okay, let's go.",
        },
      ],
    },
    restaurant: {
      context: "A waiter (A) takes an order from a customer (B) at a dhaba in Delhi.",
      lines: [
        {
          speaker: "A",
          script: "जी, आप क्या लेंगे?",
          roman: "jee, aap kyaa lenge?",
          meaning: "Yes, what would you like?",
        },
        {
          speaker: "B",
          script: "एक प्लेट दाल-चावल दीजिए।",
          roman: "ek plet daal-chaaval deejiye.",
          meaning: "Please give me one plate of rice and dal.",
        },
        {
          speaker: "A",
          script: "पीने के लिए कुछ?",
          roman: "peene ke lie kuchh?",
          meaning: "Anything to drink?",
        },
        {
          speaker: "B",
          script: "एक चाय, बिना चीनी के।",
          roman: "ek chaay, binaa cheenee ke.",
          meaning: "One tea, without sugar, please.",
        },
        {
          speaker: "A",
          script: "ठीक है। और कुछ?",
          roman: "theek hai. aur kuchh?",
          meaning: "Okay. Anything else?",
        },
        {
          speaker: "B",
          script: "थोड़ा पानी दीजिए। क्या दाल तीखी है?",
          roman: "thodaa paani deejiye. kyaa daal teekhee hai?",
          meaning: "Some water, please. Is the dal spicy?",
        },
        {
          speaker: "A",
          script: "थोड़ी-सी तीखी है।",
          roman: "thodee-see teekhee hai.",
          meaning: "It's a little spicy.",
        },
        {
          speaker: "B",
          script: "कोई बात नहीं। खाने के बाद बिल ले आइए।",
          roman: "koee baat nahin. khaane ke baad bil le aaiye.",
          meaning: "That's fine. Please bring the bill after the meal.",
        },
      ],
    },
    shopping: {
      context: "Asha (A) buys mangoes from a fruit seller (B) in a market in Bhopal.",
      lines: [
        {
          speaker: "A",
          script: "भैया, आपके पास आम हैं?",
          roman: "bhaiyaa, aapke paas aam hain?",
          meaning: "Brother, do you have mangoes?",
        },
        {
          speaker: "B",
          script: "हाँ जी, हैं।",
          roman: "haan jee, hain.",
          meaning: "Yes, we have.",
        },
        {
          speaker: "A",
          script: "एक किलो कितने का है?",
          roman: "ek kilo kitne kaa hai?",
          meaning: "How much does one kilo cost?",
        },
        { speaker: "B", script: "सौ रुपये।", roman: "sau rupaye.", meaning: "One hundred rupees." },
        {
          speaker: "A",
          script: "यह तो बहुत महँगा है। थोड़ा कम कीजिए।",
          roman: "yah to bahut mahangaa hai. thodaa kam keejiye.",
          meaning: "That is too expensive. Please reduce the price a little.",
        },
        {
          speaker: "B",
          script: "अच्छा, नब्बे रुपये दे दीजिए।",
          roman: "achchhaa, nabbe rupaye de deejiye.",
          meaning: "Okay, give me ninety rupees.",
        },
        {
          speaker: "A",
          script: "ठीक है, मैं एक किलो ले लूँगी।",
          roman: "theek hai, main ek kilo le loongee.",
          meaning: "Fine, I will take one kilo. (Asha uses the feminine ले लूँगी.)",
        },
      ],
    },
    directions: {
      context: "A visitor (A) asks a passer-by (B) for the way in Jaipur.",
      lines: [
        {
          speaker: "A",
          script: "सुनिए, रेलवे स्टेशन कहाँ है?",
          roman: "suniye, relve steshan kahaan hai?",
          meaning: "Excuse me, where is the railway station?",
        },
        {
          speaker: "B",
          script: "सीधे जाइए, फिर बाएँ मुड़िए।",
          roman: "seedhe jaaiye, phir baaen mudiye.",
          meaning: "Go straight, then turn left.",
        },
        {
          speaker: "A",
          script: "क्या वह दूर है?",
          roman: "kyaa vah door hai?",
          meaning: "Is it far?",
        },
        {
          speaker: "B",
          script: "नहीं, पास में ही है। पैदल पाँच मिनट लगेंगे।",
          roman: "nahin, paas mein hee hai. paidal paanch minat lagenge.",
          meaning: "No, it is near. About five minutes on foot.",
        },
        {
          speaker: "A",
          script: "बहुत-बहुत धन्यवाद।",
          roman: "bahut-bahut dhanyavaad.",
          meaning: "Thank you very much.",
        },
        {
          speaker: "B",
          script: "कोई बात नहीं।",
          roman: "koee baat nahin.",
          meaning: "You're welcome.",
        },
      ],
    },
    college: {
      context: "Ravi (A), a senior, meets Asha (B) on her first day at a college in Lucknow.",
      lines: [
        {
          speaker: "A",
          script: "हाय, क्या तुम यहाँ नई हो?",
          roman: "haay, kyaa tum yahaan naee ho?",
          meaning: "Hi, are you new here? (नई is feminine — he is talking to a girl.)",
        },
        {
          speaker: "B",
          script: "हाँ, आज मेरा पहला दिन है।",
          roman: "haan, aaj meraa pahlaa din hai.",
          meaning: "Yes, today is my first day.",
        },
        {
          speaker: "A",
          script: "तुम किस क्लास में हो?",
          roman: "tum kis klaas mein ho?",
          meaning: "Which class are you in?",
        },
        {
          speaker: "B",
          script: "मैं फ़र्स्ट ईयर में हूँ। लाइब्रेरी कहाँ है?",
          roman: "main farst eeyar mein hoon. laaibreree kahaan hai?",
          meaning: "I am in first year. Where is the library?",
        },
        {
          speaker: "A",
          script: "ऑफ़िस के पीछे है। चलो, मैं दिखाता हूँ।",
          roman: "ofis ke peechhe hai. chalo, main dikhaataa hoon.",
          meaning: "It is behind the office. Come, I will show you.",
        },
        {
          speaker: "B",
          script: "धन्यवाद! परीक्षा कब है?",
          roman: "dhanyavaad! pareekshaa kab hai?",
          meaning: "Thank you! When is the exam?",
        },
        { speaker: "A", script: "अगले महीने।", roman: "agle maheene.", meaning: "Next month." },
      ],
    },
    phoneCall: {
      context: "Ravi (A) phones his friend Asha (B).",
      lines: [
        { speaker: "A", script: "हेलो?", roman: "helo?", meaning: "Hello?" },
        {
          speaker: "B",
          script: "हेलो, कौन बोल रहा है?",
          roman: "helo, kaun bol rahaa hai?",
          meaning: "Hello, who is speaking?",
        },
        {
          speaker: "A",
          script: "मैं रवि बोल रहा हूँ। तुम कहाँ हो?",
          roman: "main Ravi bol rahaa hoon. tum kahaan ho?",
          meaning: "It's me, Ravi. Where are you?",
        },
        {
          speaker: "B",
          script: "मैं घर पर हूँ। क्या हुआ?",
          roman: "main ghar par hoon. kyaa huaa?",
          meaning: "I am at home. What happened?",
        },
        {
          speaker: "A",
          script: "क्या तुम कल फ़्री हो?",
          roman: "kyaa tum kal free ho?",
          meaning: "Are you free tomorrow?",
        },
        {
          speaker: "B",
          script: "हाँ, मैं फ़्री हूँ।",
          roman: "haan, main free hoon.",
          meaning: "Yes, I am free.",
        },
        {
          speaker: "A",
          script: "तो शाम को मेरे घर आओ।",
          roman: "to shaam ko mere ghar aao.",
          meaning: "Then come to my house in the evening.",
        },
        {
          speaker: "B",
          script: "ठीक है, मैं आऊँगी। मैं तुम्हें बाद में फ़ोन करूँगी।",
          roman: "theek hai, main aaoongee. main tumhen baad mein fon karoongee.",
          meaning: "Okay, I will come. I will call you later. (Asha uses the feminine forms.)",
        },
      ],
    },
    askingForHelp: {
      context: "A visitor (A) asks a shopkeeper (B) for help in Delhi.",
      lines: [
        {
          speaker: "A",
          script: "सुनिए, क्या आप मेरी मदद कर सकते हैं?",
          roman: "suniye, kyaa aap meree madad kar sakte hain?",
          meaning: "Excuse me, can you help me?",
        },
        {
          speaker: "B",
          script: "हाँ जी, बताइए।",
          roman: "haan jee, bataaiye.",
          meaning: "Yes, tell me.",
        },
        {
          speaker: "A",
          script: "मैं रास्ता भूल गया हूँ। मुझे यह पता समझ नहीं आ रहा।",
          roman: "main raastaa bhool gayaa hoon. mujhe yah pataa samajh nahin aa rahaa.",
          meaning: "I am lost. I don't understand this address.",
        },
        {
          speaker: "B",
          script: "दिखाइए। यह तो बाज़ार के पास है।",
          roman: "dikhaaiye. yah to baazaar ke paas hai.",
          meaning: "Show me. This is near the market.",
        },
        {
          speaker: "A",
          script: "थोड़ा धीरे बोलिए।",
          roman: "thodaa dheere boliye.",
          meaning: "Please speak slowly.",
        },
        {
          speaker: "B",
          script: "बाज़ार जाइए और वहाँ पूछ लीजिए। पास में ही है।",
          roman: "baazaar jaaiye aur vahaan poochh leejiye. paas mein hee hai.",
          meaning: "Go to the market and ask there. It is close.",
        },
        {
          speaker: "A",
          script: "बहुत-बहुत शुक्रिया।",
          roman: "bahut-bahut shukriyaa.",
          meaning: "Thank you so much.",
        },
      ],
    },
    travel: {
      context: "A passenger (A) talks to the bus conductor (B) on a city bus in Bhopal.",
      lines: [
        {
          speaker: "A",
          script: "क्या यह बस रेलवे स्टेशन जाती है?",
          roman: "kyaa yah bas relve steshan jaatee hai?",
          meaning: "Does this bus go to the railway station?",
        },
        {
          speaker: "B",
          script: "हाँ। कहाँ उतरना है?",
          roman: "haan. kahaan utarnaa hai?",
          meaning: "Yes. Where do you want to get off?",
        },
        {
          speaker: "A",
          script: "रेलवे स्टेशन पर। टिकट कितने का है?",
          roman: "relve steshan par. tikat kitne kaa hai?",
          meaning: "At the railway station. How much is the ticket?",
        },
        { speaker: "B", script: "बीस रुपये।", roman: "bees rupaye.", meaning: "Twenty rupees." },
        {
          speaker: "A",
          script: "कितना समय लगेगा?",
          roman: "kitnaa samay lagegaa?",
          meaning: "How long will it take?",
        },
        {
          speaker: "B",
          script: "लगभग आधा घंटा।",
          roman: "lagbhag aadhaa ghantaa.",
          meaning: "About half an hour.",
        },
        {
          speaker: "A",
          script: "स्टेशन आए तो मुझे बता दीजिए।",
          roman: "steshan aae to mujhe bataa deejiye.",
          meaning: "Please tell me when we reach the station.",
        },
        {
          speaker: "B",
          script: "ठीक है, बता दूँगा।",
          roman: "theek hai, bataa doongaa.",
          meaning: "Okay, I will tell you.",
        },
      ],
    },
    dailyRoutine: {
      context: "Ravi (A) asks his friend Asha (B) about her day. Asha uses feminine verb forms.",
      lines: [
        {
          speaker: "A",
          script: "तुम कितने बजे उठती हो?",
          roman: "tum kitne baje uthtee ho?",
          meaning: "What time do you wake up?",
        },
        {
          speaker: "B",
          script: "मैं छह बजे उठती हूँ।",
          roman: "main chhah baje uthtee hoon.",
          meaning: "I wake up at six o'clock.",
        },
        {
          speaker: "A",
          script: "उसके बाद क्या करती हो?",
          roman: "uske baad kyaa kartee ho?",
          meaning: "What do you do after that?",
        },
        {
          speaker: "B",
          script: "नहाती हूँ, नाश्ता करती हूँ और कॉलेज जाती हूँ।",
          roman: "nahaatee hoon, naashtaa kartee hoon aur kolej jaatee hoon.",
          meaning: "I bathe, eat breakfast and go to college.",
        },
        {
          speaker: "A",
          script: "घर कब आती हो?",
          roman: "ghar kab aatee ho?",
          meaning: "When do you come home?",
        },
        {
          speaker: "B",
          script: "शाम को घर आती हूँ और पढ़ाई करती हूँ।",
          roman: "shaam ko ghar aatee hoon aur padhaaee kartee hoon.",
          meaning: "I come home in the evening and study.",
        },
        {
          speaker: "A",
          script: "और सोती कब हो?",
          roman: "aur sotee kab ho?",
          meaning: "And when do you sleep?",
        },
        {
          speaker: "B",
          script: "रात को दस बजे सोती हूँ।",
          roman: "raat ko das baje sotee hoon.",
          meaning: "I sleep at ten o'clock at night.",
        },
      ],
    },
  },
  lessonNotes: {
    "polite-words":
      'Hindi politeness lives mostly in the verb, not in a word for "please": दीजिए (deejiye, please give) is polite, दो (do) is casual. Add जी (jee) to names, yes and no to sound respectful: जी हाँ, जी नहीं, रवि जी.',
    actions:
      "Hindi verbs are listed in the infinitive, which always ends in -ना (-naa): आना, जाना, खाना. Remove -ना to get the stem (आ, जा, खा) that all other forms are built on: आओ, आइए, आ रहा हूँ.",
    "my-name":
      'Hindi is verb-final: मेरा नाम आशा है is literally "my name Asha is". Words for "my/your" agree with the thing owned, not the owner: मेरा नाम (masculine) but मेरी किताब (feminine).',
    "how-are-you":
      "कैसे (kaise) agrees with the person asked: to a man आप कैसे हैं?, to a woman आप कैसी हैं? Your answer मैं ठीक हूँ is the same for everyone because ठीक never changes.",
    "where-from":
      "Hindi uses postpositions after the noun instead of prepositions before it: दिल्ली में (in Delhi), भारत से (from India). From here on, verbs with मैं change for gender: मैं रहता हूँ (man) / मैं रहती हूँ (woman).",
    understanding:
      'Many feelings and states use the "to me" pattern with मुझे (mujhe), where the verb does not depend on your gender: मुझे समझ नहीं आया (I didn\'t understand), मुझे पानी चाहिए (I need water). These are great sentences for beginners.',
    siblings:
      "Hindi marks older and younger siblings with बड़ा/बड़ी (big) and छोटा/छोटी (small): बड़ा भाई, छोटी बहन. You never call an elder sibling by name — use भैया (bhaiyaa) and दीदी (deedee); these are also polite ways to address strangers.",
    grandparents:
      "Hindi has separate words for each side of the family: father's parents are दादा/दादी, mother's parents are नाना/नानी. Uncles and aunts too: मामा (mother's brother), चाचा (father's younger brother), बुआ (father's sister), मौसी (mother's sister). Add -जी for respect: दादाजी.",
    "describing-people":
      "Adjectives ending in -आ change with the noun: लंबा लड़का, लंबी लड़की, लंबे लोग. Others like सुंदर and ख़ुश never change. Elders are spoken about in the respectful plural: ये मेरी माँ हैं.",
    "family-review":
      'Hindi has no verb "to have". For family and relations say "my … is/are": मेरे दो भाई हैं (I have two brothers). For things you carry use के पास: मेरे पास पेन है (I have a pen).',
    "hungry-thirsty":
      'Hunger and thirst "strike" you in Hindi: मुझे भूख लगी है (hunger has struck me). मुझे ... चाहिए (to me ... is needed) is the easiest way to ask for anything, and it never changes for gender.',
    "ordering-food":
      'The polite command ending -इए (-iye) does the work of "please": दीजिए, लाइए. Waiters and shopkeepers are addressed as भैया (bhaiyaa) and use आप with customers.',
    "numbers-1-10":
      "Hindi numbers come before the noun, and from two upwards the noun is plural: एक किताब, दो किताबें (masculine nouns not ending in -आ stay the same: दो भाई). Hindi digits (१ २ ३ …) appear on some signs and in books, but most people write and say prices and phone numbers in English digits.",
    "numbers-11-20":
      'Every number from 11 to 99 is its own word in Hindi (no simple "ten-one" pattern), so in cities people often use English for bigger numbers. Learn 11–20 well: they are used for time, ages and prices.',
    "big-numbers":
      "Indians count large amounts in लाख (lakh, 1,00,000) and करोड़ (crore, 1,00,00,000), written with commas in that pattern. Fractions have special words: आधा (½), डेढ़ (1½), ढाई (2½).",
    time: "कल (kal) means both yesterday and tomorrow, and परसों both the day before yesterday and the day after tomorrow — the verb tense tells you which. Time is said with बजे: पाँच बजे (at five o'clock), and parts of the day take को: शाम को (in the evening).",
    days: 'Day names end in -वार (-vaar, day) and are named after the planets: सोम (moon), मंगल (Mars), बुध (Mercury), गुरु (Jupiter), शुक्र (Venus), शनि (Saturn), रवि (sun). "On Monday" is सोमवार को.',
    "what-are-you-doing":
      "The present continuous is stem + रहा/रही/रहे + हूँ/है/हैं: मैं खा रहा हूँ (man), मैं खा रही हूँ (woman), हम खा रहे हैं (we). The रहा part always shows the speaker's gender.",
    "my-day":
      "Habits use stem + ता/ती/ते + हूँ/है/हैं: मैं उठता हूँ (man), मैं उठती हूँ (woman). Time words go early in the sentence and the verb comes last: मैं रोज़ कॉलेज जाता हूँ.",
    "position-words":
      "Position words become postpositions with के: स्टेशन के पास (near the station), घर के पीछे (behind the house), बैंक के सामने (in front of the bank). They always follow the noun.",
    "asking-directions":
      "Polite commands end in -इए: जाइए (go), मुड़िए (turn). People give directions by landmarks and often in minutes rather than distance, mixing in English: लेफ़्ट, राइट, सिग्नल.",
    "at-the-shop":
      'वाला (vaalaa) means "the one": यह वाला (this one), लाल वाला (the red one) — it becomes वाली for feminine things. Bargaining politely with भैया and थोड़ा कम कीजिए is normal in markets.',
    "travel-phrases":
      'Hindi says "Lucknow\'s ticket" (लखनऊ का टिकट) for a ticket to Lucknow. बस and ट्रेन are feminine, so the verb ends in -ई/-ती: बस आ गई, ट्रेन जाती है.',
    pronouns:
      'Hindi has three levels of "you": तू (too, intimate/rude), तुम (tum, casual), आप (aap, polite). There is no separate he/she/it: यह/ये (this one, near) and वह/वो (that one, far) cover all of them, and the verb ending shows gender: वह आता है (he comes), वह आती है (she comes). For respect, use the plural वे with a plural verb.',
    "word-order":
      'Hindi word order is subject – object – verb: मैं चावल खाता हूँ ("I rice eat am"). The verb agrees with the subject\'s gender and number: खाता (man), खाती (woman), खाते (plural or respectful); हूँ/है/हैं follow मैं / he, she / आप, हम, वे.',
    "past-future":
      "Future: stem + ऊँगा/ऊँगी (I will): खाऊँगा (man), खाऊँगी (woman). Past of verbs like खाना takes ने and agrees with the object, so men and women say the same: मैंने चावल खाए. Past of going/coming has no ने and agrees with the speaker: मैं गया (man), मैं गई (woman).",
    "questions-negatives":
      "Put क्या at the start to make a yes/no question: क्या आप मांस खाते हैं? — in speech rising intonation alone is enough. नहीं goes right before the verb (मैं नहीं जानता); मत (mat) is used in commands: मत जाओ (don't go).",
    possession:
      "Hindi uses postpositions after the noun: में (in), पर (on/at), से (from/by/with), को (to), के साथ (with), का/की/के (of). का/की/के agree with the thing owned: रवि का भाई, रवि की बहन, रवि के दोस्त. A noun before a postposition takes its oblique form, and pronouns merge with some: मुझ + से = मुझसे, उस + का = उसका.",
    "polite-casual":
      "The same verb has three command forms: आ (with तू), आओ (with तुम), आइए (with आप). For strangers, elders and guests always use the -इए form: बैठिए, खाइए, लीजिए.",
    feelings:
      "Some feelings are said with मैं + adjective (मैं ख़ुश हूँ), others with the \"to me\" pattern: मुझे डर लग रहा है (I'm scared), मुझे ग़ुस्सा आ रहा है (I'm angry). Adjectives ending in -आ change for a woman: थका → थकी.",
    health:
      "Pain is said with में दर्द है (there is pain in …): मेरे सिर में दर्द है. Illnesses use मुझे: मुझे बुख़ार है (I have a fever). Doctors and pharmacists use आप and polite -इए forms: यह दवाई लीजिए.",
    "love-friendship":
      'मैं तुमसे प्यार करता/करती हूँ is strong and romantic; families rarely say it aloud and show love through care instead. For liking, Hindi uses "to me … is liked": मुझे यह पसंद है, and for missing "your memory comes to me": मुझे तुम्हारी याद आ रही है — neither changes with your gender.',
    weather:
      "Weather is described with nouns: आज गर्मी है (today there is heat), आज ठंड है (today there is cold), बारिश हो रही है (rain is happening). North India has hot summers with लू, monsoon rains (बरसात) and foggy winters.",
    hobbies:
      'Liking uses मुझे … पसंद है, and the infinitive works like "-ing": मुझे फ़िल्में देखना पसंद है (I like watching films). English words like म्यूज़िक, हॉबी and डांस are completely normal in everyday Hindi.',
    plans:
      'Future forms change for gender: मैं आऊँगा (man), मैं आऊँगी (woman). To say you can\'t manage something use पाना: मैं नहीं आ पाऊँगा. Invitations are usually insisted on — a first "no" is often politely ignored.',
  },
};
