import type { LanguageContent } from "../types.ts";

// Telugu (తెలుగు) — everyday standard Telugu as spoken in Hyderabad / Vijayawada,
// written in standard spelling. Polite మీరు (meeru) by default; casual నువ్వు (nuvvu) in notes.
// Romanization: aa, ee, oo for long a/i/u; e/o for both short and long e/o (as in the
// knowledge base: nenu, peru); sh for శ/ష; ll for ళ్ళ. ‌ = zero-width non-joiner used in
// English loanwords with a case ending (స్టేషన్‌కి).

export const content: LanguageContent = {
  code: "te",
  entries: {
    // First words › Greetings (lesson "greetings")
    hello: {
      script: "నమస్కారం",
      roman: "namaskaaram",
      notes:
        'The polite all-purpose greeting, often with palms pressed together; it also works as a respectful goodbye. నమస్తే (namaste) is also understood; friends just say హాయ్ (haay) or ఏంటి సంగతి? (enti sangati?, "what\'s up?").',
    },
    goodbye: {
      script: "వెళ్ళొస్తాను",
      roman: "vellostaanu",
      notes:
        'Literally "I\'ll go and come (back)". Telugu speakers avoid a bare "I\'m going" (వెళ్తాను) when leaving, as it sounds final. Polite: వెళ్ళొస్తానండి (vellostaanandi); the host replies వెళ్ళి రండి (velli randi). "Bye" is also very common.',
    },
    seeYouLater: {
      words: [
        ["మళ్ళీ", "mallee"],
        ["కలుద్దాం", "kaluddaam"],
      ],
      notes:
        'Literally "we will meet again". కలుద్దాం (kaluddaam) is the "let\'s" form of కలవడం (to meet).',
    },
    goodMorning: {
      words: [["శుభోదయం", "shubhodayam"]],
      notes:
        'శుభోదయం (shubhodayam) is the formal word, heard on TV and in messages. In everyday life most people simply say "Good morning" in English, or నమస్కారం.',
    },
    goodNight: {
      words: [["శుభరాత్రి", "shubharaatri"]],
      notes:
        'Formal/written (also written శుభ రాత్రి). In daily life people say "Good night" in English; at bedtime family members may just say పడుకో (paduko, "go to sleep").',
    },
    thankYou: {
      script: "ధన్యవాదాలు",
      roman: "dhanyavaadaalu",
      notes:
        'Polite and a bit formal. In everyday speech people often say "thanks" or థాంక్స్ అండి (thaanks andi). Between close family, thanking is rare and can even sound distant.',
    },
    welcome: {
      script: "స్వాగతం",
      roman: "svaagatam",
      notes:
        'Used on signs and in speeches (సుస్వాగతం, susvaagatam = a warm welcome). To welcome a guest at home people say రండి, రండి (randi, randi — "come in, come in").',
    },
    // First words › Yes, no & polite words (lesson "polite-words")
    yes: {
      script: "అవును",
      roman: "avunu",
      notes:
        'Polite: అవునండి (avunandi). In conversation a quick ఆ (aa) or ఊ (oo) also means yes. For "okay, I\'ll do it" use సరే (sare) or అలాగే (alaage).',
    },
    no: {
      script: "కాదు",
      roman: "kaadu",
      notes:
        'కాదు (kaadu) = "it is not (so)". Telugu has other "no" words: లేదు (ledu) = "there isn\'t / didn\'t", and వద్దు (vaddu) = "don\'t want / don\'t". "Do you want tea?" — వద్దు, not కాదు.',
    },
    please: {
      script: "దయచేసి",
      roman: "dayachesi",
      notes:
        'Literally "showing kindness". It is formal; everyday politeness comes from the verb ending -ండి (-ndi), e.g. ఇవ్వండి (ivvandi, please give), and the particle అండి (andi).',
    },
    sorry: {
      script: "క్షమించండి",
      roman: "kshaminchandi",
      notes:
        'Literally "please forgive (me)". Casual: క్షమించు (kshaminchu). In everyday speech the English "sorry" (సారీ, saaree) is extremely common.',
    },
    excuseMe: {
      words: [["ఏమండీ", "emandee"]],
      notes:
        'The usual way to get a stranger\'s attention ("excuse me / hello there"). Some people also say "excuse me" in English. To apologise for disturbing, use క్షమించండి (kshaminchandi).',
    },
    okay: {
      script: "సరే",
      roman: "sare",
      notes:
        'Very common. అలాగే (alaage, "alright, will do") is a softer alternative; "okay" in English is used too.',
    },
    noProblem: {
      words: [
        ["ఇబ్బంది", "ibbandi"],
        ["లేదు", "ledu"],
      ],
      notes:
        'Literally "there is no trouble". You also hear ఏం పర్వాలేదు (em parvaaledu, "no problem at all") and English "no problem".',
    },
    youreWelcome: {
      words: [["పర్వాలేదండి", "parvaaledandi"]],
      notes:
        'Telugu has no fixed reply to "thank you". People say పర్వాలేదండి ("it\'s alright", polite) or, to friends, అయ్యో, దానికేముంది (ayyo, daanikemundi — "oh, that\'s nothing"). Casual: పర్వాలేదు.',
    },
    // First words › Everyday things (lesson "things")
    water: {
      script: "నీళ్ళు",
      roman: "neellu",
      notes:
        "Grammatically plural, so it takes plural verbs: నీళ్ళు ఉన్నాయి (neellu unnaayi, there is water). Drinking water is మంచి నీళ్ళు (manchi neellu).",
    },
    food: {
      script: "భోజనం",
      roman: "bhojanam",
      notes:
        'A (proper) meal. అన్నం (annam, cooked rice) is also used for "food/meal", and తిండి (tindi) is a casual word for food.',
    },
    house: {
      script: "ఇల్లు",
      roman: "illu",
      notes:
        "The stem changes before endings: ఇంట్లో (intlo, at home), ఇంటికి (intiki, to home), మా ఇల్లు (maa illu, our house / my home).",
    },
    book: { script: "పుస్తకం", roman: "pustakam", notes: "Plural: పుస్తకాలు (pustakaalu)." },
    phone: {
      script: "ఫోన్",
      roman: "phon",
      notes:
        'English loanword used by everyone; also సెల్ (sel) or మొబైల్ (mobail). "To call" is ఫోన్ చేయడం (phon cheyadam).',
    },
    bag: {
      script: "బ్యాగ్",
      roman: "byaag",
      notes:
        "The English word is normal for a school or travel bag. The native word సంచి (sanchi) is a cloth or shopping bag.",
    },
    pen: {
      script: "పెన్ను",
      roman: "pennu",
      notes: "English loan with the Telugu -u ending; also written పెన్ (pen).",
    },
    money: {
      script: "డబ్బు",
      roman: "dabbu",
      notes:
        "Often used in the plural: డబ్బులు (dabbulu). నా దగ్గర డబ్బులు లేవు = I don't have money.",
    },
    // First words › Common actions (lesson "actions")
    come: {
      script: "రావడం",
      roman: "raavadam",
      notes:
        'Verbs are listed as verbal nouns in -డం (-dam), "coming / to come". The casual command is రా (raa), polite రండి (randi); "I come / will come" is వస్తాను (vastaanu).',
    },
    go: {
      script: "వెళ్ళడం",
      roman: "velladam",
      notes:
        'Command: వెళ్ళు (vellu), polite వెళ్ళండి (vellandi). "I go / will go" is వెళ్తాను (veltaanu); పోవడం (povadam) is a more casual verb for "go".',
    },
    eat: {
      script: "తినడం",
      roman: "tinadam",
      notes: 'Command: తిను (tinu), polite తినండి (tinandi). "I eat" is తింటాను (tintaanu).',
    },
    drink: {
      script: "తాగడం",
      roman: "taagadam",
      notes:
        "Also written త్రాగడం (traagadam) in formal Telugu. Command: తాగు (taagu), polite తాగండి (taagandi).",
    },
    see: {
      script: "చూడడం",
      roman: "choodadam",
      notes: "Also spelled చూడటం (choodatam). Command: చూడు (choodu), polite చూడండి (choodandi).",
    },
    give: {
      script: "ఇవ్వడం",
      roman: "ivvadam",
      notes:
        "Polite request: ఇవ్వండి (ivvandi, please give) — one of the most useful words in shops and restaurants.",
    },
    take: {
      script: "తీసుకోవడం",
      roman: "teesukovadam",
      notes:
        "Polite: తీసుకోండి (teesukondi, please take). తీసుకురండి (teesukurandi) = please bring.",
    },
    doVerb: {
      script: "చేయడం",
      roman: "cheyadam",
      notes:
        "Forms many compound verbs: పని చేయడం (to work), వంట చేయడం (to cook), ఫోన్ చేయడం (to phone). Polite command: చేయండి (cheyandi).",
    },
    // First words › This, that & questions (lesson "this-and-that")
    this: {
      script: "ఇది",
      roman: "idi",
      notes:
        "Before a noun use ఈ (ee): ఈ పుస్తకం (ee pustakam, this book). Plural: ఇవి (ivi, these).",
    },
    that: {
      script: "అది",
      roman: "adi",
      notes: "Before a noun use ఆ (aa): ఆ ఇల్లు (aa illu, that house). Plural: అవి (avi, those).",
    },
    here: {
      script: "ఇక్కడ",
      roman: "ikkada",
      notes: '"(To) here" is ఇక్కడికి (ikkadiki): ఇక్కడికి రండి = come here.',
    },
    there: { script: "అక్కడ", roman: "akkada", notes: '"(To) there" is అక్కడికి (akkadiki).' },
    what: {
      script: "ఏమిటి",
      roman: "emiti",
      notes:
        "Colloquially ఏంటి (enti), and ఏం (em) before a verb: ఏం చేస్తున్నారు? (em chestunnaaru?, what are you doing?).",
    },
    who: {
      script: "ఎవరు",
      roman: "evaru",
      notes:
        "Used for one or many people, and it is respectful: ఆయన ఎవరు? (aayana evaru?, who is he?).",
    },
    whatIsThis: {
      words: [
        ["ఇది", "idi"],
        ["ఏమిటి?", "emiti?"],
      ],
      notes: 'Literally "this what?" — Telugu needs no "is". Colloquially ఇదేంటి? (identi?).',
    },
    whoIsThis: {
      words: [
        ["ఈయన", "eeyana"],
        ["ఎవరు?", "evaru?"],
      ],
      notes:
        'ఈయన (eeyana) is a respectful "this man". For a woman: ఈవిడ ఎవరు? (eevida evaru?). Casual: ఇతను ఎవరు? (itanu evaru?) / ఈమె ఎవరు? (eeme evaru?). On the phone ask ఎవరు మాట్లాడుతున్నారు? (evaru maatlaadutunnaaru?).',
    },
    thisIsWater: {
      words: [
        ["ఇవి", "ivi"],
        ["నీళ్ళు", "neellu"],
      ],
      blank: 1,
      notes:
        "Because నీళ్ళు (water) is grammatically plural, careful speech uses ఇవి (ivi, these); in casual speech you also hear ఇది నీళ్ళు (idi neellu).",
    },
    // Introducing yourself › My name is… (lesson "my-name")
    name: {
      script: "పేరు",
      roman: "peru",
      notes: 'Joins with "what" in speech: పేరేంటి? (perenti?, what\'s the name?).',
    },
    iPronoun: {
      script: "నేను",
      roman: "nenu",
      notes:
        'Often dropped, because the verb ending already shows "I": వస్తాను (vastaanu) = I will come.',
    },
    youFormal: {
      script: "మీరు",
      roman: "meeru",
      notes:
        'Polite (and plural) "you": use it with strangers, elders, teachers and anyone you are not close to. Casual: నువ్వు (nuvvu).',
    },
    my: {
      script: "నా",
      roman: "naa",
      notes:
        'For family and home Telugu prefers మా (maa, "our"): మా అమ్మ (maa amma, my mother), మా ఇల్లు (maa illu, my house).',
    },
    yourFormal: {
      script: "మీ",
      roman: "mee",
      notes: 'Polite/plural "your". Casual: నీ (nee) — నీ పేరు ఏంటి? (nee peru enti?).',
    },
    myNameIs: {
      words: [
        ["నా", "naa"],
        ["పేరు", "peru"],
        ["ఆశ", "Asha"],
      ],
      blank: 1,
      notes:
        'Literally "my name Asha" — no word for "is". You can also say నేను ఆశ (nenu Asha, "I am Asha").',
    },
    whatIsYourName: {
      words: [
        ["మీ", "mee"],
        ["పేరు", "peru"],
        ["ఏమిటి?", "emiti?"],
      ],
      notes: "Casual (to a child or friend): నీ పేరు ఏంటి? (nee peru enti?).",
    },
    // Introducing yourself › How are you? (lesson "how-are-you")
    howAreYou: {
      words: [
        ["మీరు", "meeru"],
        ["ఎలా", "elaa"],
        ["ఉన్నారు?", "unnaaru?"],
      ],
      notes:
        'Polite. Very common short form: బాగున్నారా? (baagunnaaraa?, "are you well?"). To a friend: ఎలా ఉన్నావు? (elaa unnaavu?).',
    },
    iAmFine: {
      words: [
        ["నేను", "nenu"],
        ["బాగున్నాను", "baagunnaanu"],
      ],
      blank: 1,
      notes:
        "బాగున్నాను = బాగా (well) + ఉన్నాను (I am). In speech often just బాగున్నా (baagunnaa) or బాగున్నానండి (polite).",
    },
    andYou: {
      words: [
        ["మరి", "mari"],
        ["మీరు?", "meeru?"],
      ],
      notes: 'మరి (mari) = "and / what about". To a friend: మరి నువ్వు? (mari nuvvu?).',
    },
    veryGood: {
      words: [
        ["చాలా", "chaalaa"],
        ["బాగుంది", "baagundi"],
      ],
      notes:
        'Literally "it is very good" — said about things and situations. చాలా (chaalaa) = very / a lot.',
    },
    iAmAlsoFine: {
      words: [
        ["నేను", "nenu"],
        ["కూడా", "koodaa"],
        ["బాగున్నాను", "baagunnaanu"],
      ],
      blank: 1,
      notes: "కూడా (koodaa) = also / too; it comes after the word it adds to.",
    },
    // Introducing yourself › Where are you from? (lesson "where-from")
    whereAreYouFrom: {
      words: [
        ["మీది", "meedi"],
        ["ఏ", "e"],
        ["ఊరు?", "ooru?"],
      ],
      notes:
        'Literally "yours is which town?" — the most natural way to ask. Also: మీరు ఎక్కడి నుండి వచ్చారు? (meeru ekkadi nundi vachchaaru?, where have you come from?). Answer: మాది హైదరాబాదు (maadi Haidaraabaadu).',
    },
    iAmFromIndia: {
      words: [
        ["నేను", "nenu"],
        ["భారతదేశం", "bhaaratadesham"],
        ["నుండి", "nundi"],
        ["వచ్చాను", "vachchaanu"],
      ],
      blank: 1,
      notes:
        'Literally "I came from India". నుండి (nundi, from) follows the noun. In speech people often say ఇండియా (indiyaa) and నుంచి (nunchi).',
    },
    india: {
      script: "భారతదేశం",
      roman: "bhaaratadesham",
      notes: "Also భారత్ (bhaarat); in everyday speech ఇండియా (indiyaa) is common.",
    },
    city: {
      script: "నగరం",
      roman: "nagaram",
      notes:
        "A town is పట్టణం (pattanam). In speech ఊరు (ooru) covers any town, village or hometown.",
    },
    village: {
      script: "గ్రామం",
      roman: "graamam",
      notes: "Formal. Everyday words: ఊరు (ooru) and పల్లెటూరు (palletooru, countryside village).",
    },
    country: {
      script: "దేశం",
      roman: "desham",
      notes: "మన దేశం (mana desham) = our country (including the listener).",
    },
    whereDoYouLive: {
      words: [
        ["మీరు", "meeru"],
        ["ఎక్కడ", "ekkada"],
        ["ఉంటారు?", "untaaru?"],
      ],
      notes:
        'Literally "where do you stay?" — Telugu uses ఉండడం (to be/stay) for "live". Casual: నువ్వు ఎక్కడ ఉంటావు? (nuvvu ekkada untaavu?).',
    },
    iLiveInCity: {
      words: [
        ["నేను", "nenu"],
        ["హైదరాబాదులో", "Haidaraabaadulo"],
        ["ఉంటాను", "untaanu"],
      ],
      meaning: "I live in Hyderabad.",
      blank: 1,
      notes:
        '-లో (-lo) = "in". You may also see హైదరాబాద్‌లో. With Vijayawada: నేను విజయవాడలో ఉంటాను (nenu Vijayavaadalo untaanu).',
    },
    // Introducing yourself › Nice to meet you (lesson "nice-to-meet-you")
    niceToMeetYou: {
      words: [
        ["మిమ్మల్ని", "mimmalni"],
        ["కలిసినందుకు", "kalisinanduku"],
        ["సంతోషం", "santosham"],
      ],
      blank: 2,
      notes:
        'Literally "happiness for having met you". It sounds slightly formal; casually people smile and say నాకు చాలా సంతోషం (naaku chaalaa santosham) or "nice to meet you" in English.',
    },
    iAmAStudent: {
      words: [
        ["నేను", "nenu"],
        ["విద్యార్థిని", "vidyaarthini"],
      ],
      blank: 1,
      notes:
        'విద్యార్థి (student) + -ని ("I am"). In speech: నేను స్టూడెంట్‌ని (nenu stoodentni). (విద్యార్థిని on its own can also mean "female student".)',
    },
    iAmLearningLanguage: {
      words: [
        ["నేను", "nenu"],
        ["తెలుగు", "telugu"],
        ["నేర్చుకుంటున్నాను", "nerchukuntunnaanu"],
      ],
      meaning: "I am learning Telugu.",
      blank: 1,
      notes: 'నేర్చుకోవడం (nerchukovadam) = to learn; -తున్నాను = "I am …-ing".',
    },
    iSpeakALittle: {
      words: [
        ["నాకు", "naaku"],
        ["కొంచెం", "konchem"],
        ["తెలుగు", "telugu"],
        ["వచ్చు", "vachchu"],
      ],
      meaning: "I speak a little Telugu.",
      accept: ["i know a little telugu"],
      blank: 1,
      notes:
        'Literally "to me a little Telugu comes" — the normal way to say you know a language. Also: నేను కొంచెం తెలుగు మాట్లాడగలను (I can speak a little Telugu).',
    },
    student: {
      script: "విద్యార్థి",
      roman: "vidyaarthi",
      notes:
        'Female: విద్యార్థిని (vidyaarthini). In speech the English "student" (స్టూడెంట్) is very common.',
    },
    teacher: {
      script: "ఉపాధ్యాయుడు",
      roman: "upaadhyaayudu",
      notes:
        "Formal word (female: ఉపాధ్యాయురాలు, upaadhyaayuraalu). Everyday: టీచర్ (teechar); students address teachers as సార్ (saar) or మేడమ్ (medam), and older people say మాస్టారు (maastaaru).",
    },
    // Introducing yourself › I don't understand (lesson "understanding")
    iUnderstand: {
      words: [
        ["నాకు", "naaku"],
        ["అర్థమైంది", "arthamaindi"],
      ],
      notes: 'Literally "to me it has become meaning" — a dative construction (నాకు = to me).',
    },
    iDontUnderstand: {
      words: [
        ["నాకు", "naaku"],
        ["అర్థం", "artham"],
        ["కాలేదు", "kaaledu"],
      ],
      notes:
        'Literally "to me meaning did not happen". While someone is still talking: అర్థం కావడం లేదు (artham kaavadam ledu, I\'m not getting it).',
    },
    pleaseRepeat: {
      words: [
        ["మళ్ళీ", "mallee"],
        ["చెప్పండి", "cheppandi"],
      ],
      notes:
        'Literally "say again" — the -ండి ending makes it polite. Casual: మళ్ళీ చెప్పు (mallee cheppu). Also ఇంకొకసారి చెప్పండి (inkokasaari cheppandi, say it once more).',
    },
    speakSlowly: {
      words: [
        ["కొంచెం", "konchem"],
        ["నెమ్మదిగా", "nemmadigaa"],
        ["మాట్లాడండి", "maatlaadandi"],
      ],
      blank: 1,
      notes:
        'కొంచెం (konchem, a little) softens the request. మెల్లగా (mellagaa) is another word for "slowly".',
    },
    whatDoesThisMean: {
      words: [
        ["దీని", "deeni"],
        ["అర్థం", "artham"],
        ["ఏమిటి?", "emiti?"],
      ],
      notes:
        'Literally "its meaning what?". దీని (deeni) = of this. Colloquially దీని అర్థం ఏంటి? or just అంటే? (ante?, meaning?).',
    },
    doYouSpeakEnglish: {
      words: [
        ["మీకు", "meeku"],
        ["ఇంగ్లీషు", "ingleeshu"],
        ["వచ్చా?", "vachchaa?"],
      ],
      blank: 1,
      notes:
        'Literally "to you, does English come?". Also: మీరు ఇంగ్లీషు మాట్లాడతారా? (meeru ingleeshu maatlaadataaraa?). The formal word for English is ఆంగ్లం (aanglam).',
    },
    howDoYouSay: {
      words: [
        ["దీన్ని", "deenni"],
        ["తెలుగులో", "telugulo"],
        ["ఎలా", "elaa"],
        ["అంటారు?", "antaaru?"],
      ],
      meaning: "How do you say this in Telugu?",
      blank: 1,
      notes: 'Literally "this, in Telugu, how do they say?". తెలుగులో = in Telugu (-లో = in).',
    },
    // Family & people › Parents & children (lesson "parents-children")
    mother: {
      script: "అమ్మ",
      roman: "amma",
      notes:
        "Formal: తల్లి (talli). Respectful when talking about someone's mother: అమ్మగారు (ammagaaru).",
    },
    father: {
      script: "నాన్న",
      roman: "naanna",
      notes:
        "Formal: తండ్రి (tandri). Respectful: నాన్నగారు (naannagaaru). Some families say నాయన (naayana) or డాడీ (daadee).",
    },
    parents: {
      script: "తల్లిదండ్రులు",
      roman: "tallidandrulu",
      notes: "Everyday speech often says అమ్మానాన్న (ammaanaanna, mum and dad).",
    },
    son: {
      script: "కొడుకు",
      roman: "koduku",
      notes: "Also అబ్బాయి (abbaayi, boy): మా అబ్బాయి = my son.",
    },
    daughter: {
      script: "కూతురు",
      roman: "kooturu",
      notes:
        "Also అమ్మాయి (ammaayi, girl): మా అమ్మాయి = my daughter. In Telangana బిడ్డ (bidda) often means daughter.",
    },
    child: {
      script: "బిడ్డ",
      roman: "bidda",
      notes:
        "A child or baby. Children = పిల్లలు (pillalu). A little boy is పిల్లవాడు (pillavaadu), a girl పిల్ల (pilla). In Telangana బిడ్డ often specifically means daughter.",
    },
    family: {
      script: "కుటుంబం",
      roman: "kutumbam",
      notes: 'In speech also మా వాళ్ళు (maa vaallu, "my people / my family").',
    },
    // Family & people › Brothers, sisters & partners (lesson "siblings")
    elderBrother: {
      script: "అన్న",
      roman: "anna",
      notes:
        "Addressing him: అన్నయ్య (annayya). Also used for any slightly older man you respect, e.g. an auto driver.",
    },
    youngerBrother: {
      script: "తమ్ముడు",
      roman: "tammudu",
      notes: "Addressing him: తమ్ముడూ (tammudoo) or just by name.",
    },
    elderSister: {
      script: "అక్క",
      roman: "akka",
      notes: "Also a friendly, respectful way to address any slightly older woman.",
    },
    youngerSister: {
      script: "చెల్లెలు",
      roman: "chellelu",
      notes: "Everyday short form: చెల్లి (chelli).",
    },
    husband: {
      script: "భర్త",
      roman: "bharta",
      notes:
        'Women often say మా ఆయన (maa aayana, "our him") instead of saying "my husband" directly.',
    },
    wife: {
      script: "భార్య",
      roman: "bhaarya",
      notes:
        'Men often say మా ఆవిడ (maa aavida) or మా ఇంటావిడ (maa intaavida, "the lady of our house") instead of saying "my wife" directly.',
    },
    // Family & people › Grandparents & relatives (lesson "grandparents")
    grandfatherPaternal: {
      script: "తాత",
      roman: "taata",
      notes:
        "Both grandfathers are called తాత (or తాతయ్య, taatayya). To specify, say నాన్న వైపు తాత (naanna vaipu taata, father's-side grandfather).",
    },
    grandmotherPaternal: {
      script: "నానమ్మ",
      roman: "naanamma",
      notes: 'From నాన్న + అమ్మ ("father\'s mother"); also written నాయనమ్మ (naayanamma).',
    },
    grandfatherMaternal: {
      script: "అమ్మ వైపు తాత",
      roman: "amma vaipu taata",
      notes:
        "Literally \"mother's-side grandfather\". Telugu has no separate word: you call him తాత / తాతయ్య just like your father's father.",
    },
    grandmotherMaternal: {
      script: "అమ్మమ్మ",
      roman: "ammamma",
      notes: 'From అమ్మ + అమ్మ ("mother\'s mother").',
    },
    uncleMaternal: {
      script: "మామయ్య",
      roman: "maamayya",
      notes:
        "Mother's brother (formal మేనమామ, menamaama). The same word is used for father-in-law. Father's brothers are బాబాయ్ (baabaay, younger) and పెదనాన్న (pedanaanna, elder).",
    },
    auntPaternal: {
      script: "అత్తయ్య",
      roman: "attayya",
      notes:
        "Father's sister (short: అత్త, atta); also mother-in-law. Mother's sisters are పిన్ని (pinni, younger) and పెద్దమ్మ (peddamma, elder).",
    },
    // Family & people › People (lesson "people")
    man: {
      script: "మగవాడు",
      roman: "magavaadu",
      notes:
        "Formal: పురుషుడు (purushudu). Respectfully, about a specific man: ఆయన (aayana); an older man: పెద్దాయన (peddaayana).",
    },
    woman: {
      script: "మహిళ",
      roman: "mahila",
      notes:
        "Neutral and polite. Also స్త్రీ (stree, formal); women = ఆడవాళ్ళు (aadavaallu). About a specific woman: ఆవిడ (aavida).",
    },
    boy: {
      script: "అబ్బాయి",
      roman: "abbaayi",
      notes: 'Also means "son" with మా (maa abbaayi). Used for young men too.',
    },
    girl: {
      script: "అమ్మాయి",
      roman: "ammaayi",
      notes: 'Also means "daughter" with మా (maa ammaayi). Used for young women too.',
    },
    friend: {
      script: "స్నేహితుడు",
      roman: "snehitudu",
      notes:
        "Male friend; a female friend is స్నేహితురాలు (snehituraalu). In everyday speech ఫ్రెండ్ (phrend) is most common; in Hyderabad you also hear దోస్త్ (dost).",
    },
    neighbour: {
      script: "పక్కింటివాళ్ళు",
      roman: "pakkintivaallu",
      notes:
        'Literally "the people of the next house" — how people actually say it. Formal: పొరుగువారు (poruguvaaru).',
    },
    person: {
      script: "మనిషి",
      roman: "manishi",
      notes: 'Formal: వ్యక్తి (vyakti). మనిషి also means "human being".',
    },
    doctor: {
      script: "డాక్టర్",
      roman: "daaktar",
      notes: "The English word is normal. Formal Telugu: వైద్యుడు (vaidyudu).",
    },
    // Family & people › Describing people (lesson "describing-people")
    tall: {
      script: "పొడుగు",
      roman: "podugu",
      notes: "Also means long. అతను పొడుగ్గా ఉంటాడు (atanu poduggaa untaadu) = he is tall.",
    },
    short: {
      script: "పొట్టి",
      roman: "potti",
      notes: "Short in height. For length/duration use చిన్న (chinna) or తక్కువ (takkuva).",
    },
    good: {
      script: "మంచి",
      roman: "manchi",
      notes: 'Before nouns: మంచి మనిషి (a good person). "It\'s good / nice" is బాగుంది (baagundi).',
    },
    beautiful: {
      script: "అందమైన",
      roman: "andamaina",
      notes:
        'Before a noun: అందమైన అమ్మాయి. "She is beautiful" = ఆమె అందంగా ఉంటుంది (aame andangaa untundi).',
    },
    young: {
      script: "చిన్న వయసు",
      roman: "chinna vayasu",
      notes:
        'Literally "small age" — Telugu describes youth this way: చిన్న వయసు అమ్మాయి (a young girl). A young man is యువకుడు (yuvakudu).',
    },
    old: {
      script: "పెద్ద వయసు",
      roman: "pedda vayasu",
      notes:
        'Literally "big age" — the polite way to say elderly. ముసలి (musali, old) exists but can sound blunt about people. For old things use పాత (paata).',
    },
    kind: {
      script: "దయగల",
      roman: "dayagala",
      notes:
        'Literally "having kindness". In speech people say మంచి మనసు (manchi manasu, a good heart).',
    },
    thisIsMyMother: {
      words: [
        ["ఈవిడ", "eevida"],
        ["మా", "maa"],
        ["అమ్మ", "amma"],
      ],
      blank: 2,
      notes:
        'ఈవిడ (eevida) = this lady (respectful). Telugu says మా అమ్మ ("our mother") rather than నా అమ్మ.',
    },
    heIsMyFriend: {
      words: [
        ["అతను", "atanu"],
        ["నా", "naa"],
        ["స్నేహితుడు", "snehitudu"],
      ],
      blank: 2,
      notes:
        "For a woman: ఆమె నా స్నేహితురాలు (aame naa snehituraalu). Very commonly: వాడు నా ఫ్రెండ్ (vaadu naa phrend — casual, among young people).",
    },
    sheIsMySister: {
      words: [
        ["ఆమె", "aame"],
        ["మా", "maa"],
        ["అక్క", "akka"],
      ],
      blank: 2,
      notes: "అక్క = elder sister. A younger sister: ఆమె మా చెల్లి (aame maa chelli).",
    },
    myFatherIsADoctor: {
      words: [
        ["మా", "maa"],
        ["నాన్నగారు", "naannagaaru"],
        ["డాక్టర్", "daaktar"],
      ],
      blank: 2,
      notes:
        'No verb "is" needed. నాన్నగారు adds respect (-గారు); plain మా నాన్న డాక్టర్ is also fine.',
    },
    // Family & people › Family review (lesson "family-review")
    howManyBrothers: {
      words: [
        ["మీకు", "meeku"],
        ["ఎంతమంది", "entamandi"],
        ["అన్నదమ్ములు", "annadammulu"],
        ["ఉన్నారు?", "unnaaru?"],
      ],
      blank: 2,
      notes:
        'Literally "to you how many brothers are there?" ఎంతమంది (entamandi) = how many (people). అన్నదమ్ములు = brothers (elder + younger).',
    },
    iHaveOneBrother: {
      words: [
        ["నాకు", "naaku"],
        ["ఒక", "oka"],
        ["తమ్ముడు", "tammudu"],
        ["ఉన్నాడు", "unnaadu"],
      ],
      blank: 2,
      notes:
        'Literally "to me one younger brother is there". Telugu has no verb "have": it uses నాకు … ఉన్నాడు/ఉంది.',
    },
    iHaveTwoSisters: {
      words: [
        ["నాకు", "naaku"],
        ["ఇద్దరు", "iddaru"],
        ["అక్కచెల్లెళ్ళు", "akkachellellu"],
        ["ఉన్నారు", "unnaaru"],
      ],
      blank: 1,
      notes:
        "For people Telugu uses special counting words: ఇద్దరు (iddaru, two people), ముగ్గురు (mugguru, three people), not రెండు/మూడు. అక్కచెల్లెళ్ళు = sisters.",
    },
    // Food & drinks › Everyday food (lesson "food-staples")
    rice: {
      script: "అన్నం",
      roman: "annam",
      notes: "Cooked rice — the centre of a Telugu meal. Uncooked rice is బియ్యం (biyyam).",
    },
    roti: {
      script: "చపాతీ",
      roman: "chapaatee",
      notes:
        "Wheat flatbread. రొట్టె (rotte) is the native word for bread/flatbread; జొన్న రొట్టె (jonna rotte) is a sorghum roti popular in Telangana.",
    },
    dal: {
      script: "పప్పు",
      roman: "pappu",
      notes:
        "Cooked lentils/dal — a daily dish (e.g. టమాటా పప్పు, tomato dal). పప్పు also means lentils/pulses in general.",
    },
    vegetables: {
      script: "కూరగాయలు",
      roman: "kooragaayalu",
      notes: "A cooked vegetable dish or curry is కూర (koora).",
    },
    curd: {
      script: "పెరుగు",
      roman: "perugu",
      notes: "A Telugu meal traditionally ends with curd rice: పెరుగన్నం (perugannam).",
    },
    salt: { script: "ఉప్పు", roman: "uppu" },
    sugar: {
      script: "చక్కెర",
      roman: "chakkera",
      notes:
        'In Andhra many people say పంచదార (panchadaara); "sugar" (షుగర్) is also used, especially when ordering tea.',
    },
    sweets: {
      script: "మిఠాయిలు",
      roman: "mithaayilu",
      notes:
        "Everyday speech often uses స్వీట్లు (sveetlu). Sweet dishes are also తీపి పదార్థాలు (teepi padaarthaalu).",
    },
    // Food & drinks › Drinks (lesson "drinks")
    tea: {
      script: "టీ",
      roman: "tee",
      notes: "In Hyderabad and Telangana people also say చాయ్ (chaay).",
    },
    coffee: {
      script: "కాఫీ",
      roman: "kaaphee",
      notes: "Filter coffee is popular in Andhra homes.",
    },
    milk: {
      script: "పాలు",
      roman: "paalu",
      notes:
        "Grammatically plural like నీళ్ళు: పాలు ఉన్నాయా? (paalu unnaayaa?, is there any milk?).",
    },
    juice: {
      script: "జ్యూస్",
      roman: "jyoos",
      notes:
        "The English word is normal. Native: పండ్ల రసం (pandla rasam, fruit juice); రసం alone usually means the tangy soup rasam.",
    },
    buttermilk: {
      script: "మజ్జిగ",
      roman: "majjiga",
      notes: "Thin salted buttermilk, drunk in summer and with meals.",
    },
    coconutWater: {
      script: "కొబ్బరి నీళ్ళు",
      roman: "kobbari neellu",
      notes:
        'Literally "coconut water"; sold from carts as కొబ్బరి బొండం (kobbari bondam, tender coconut).',
    },
    // Food & drinks › Fruits, vegetables & more (lesson "fruits-vegetables")
    fruit: {
      script: "పండు",
      roman: "pandu",
      notes: 'Plural: పండ్లు (pandlu). Also means "ripe". Many fruit names end in -పండు.',
    },
    banana: {
      script: "అరటిపండు",
      roman: "aratipandu",
      notes: "అరటి (banana) + పండు (fruit). Raw/cooking banana: అరటికాయ (aratikaaya).",
    },
    mango: {
      script: "మామిడిపండు",
      roman: "maamidipandu",
      notes: "Ripe mango. A raw mango is మామిడికాయ (maamidikaaya), used for pickles like ఆవకాయ.",
    },
    apple: { script: "ఆపిల్", roman: "aapil", notes: "Also ఆపిల్ పండు (aapil pandu)." },
    onion: { script: "ఉల్లిపాయ", roman: "ullipaaya", notes: "Plural: ఉల్లిపాయలు (ullipaayalu)." },
    tomato: { script: "టమాటా", roman: "tamaataa", notes: "Also written టమోటా (tamotaa)." },
    potato: {
      script: "బంగాళాదుంప",
      roman: "bangaalaadumpa",
      notes: "In Telangana and Hyderabad people usually say ఆలుగడ్డ (aalugadda).",
    },
    egg: { script: "గుడ్డు", roman: "guddu", notes: "Also కోడిగుడ్డు (kodiguddu, hen's egg)." },
    fish: {
      script: "చేప",
      roman: "chepa",
      notes:
        "Plural: చేపలు (chepalu). Fish curry is చేపల పులుసు (chepala pulusu), an Andhra coastal favourite.",
    },
    chicken: {
      script: "చికెన్",
      roman: "chiken",
      notes:
        "Chicken as food is usually the English word. కోడి (kodi) is the hen itself; కోడి కూర (kodi koora) = chicken curry.",
    },
    // Food & drinks › Hungry & thirsty (lesson "hungry-thirsty")
    hungry: {
      script: "ఆకలి",
      roman: "aakali",
      notes:
        'Literally "hunger" (a noun). Used as నాకు ఆకలిగా ఉంది (I am hungry) or ఆకలేస్తోంది (aakalestondi, I\'m getting hungry).',
    },
    thirsty: {
      script: "దాహం",
      roman: "daaham",
      notes:
        'Literally "thirst" (a noun). Used as నాకు దాహంగా ఉంది or దాహం వేస్తోంది (daaham vestondi).',
    },
    tasty: {
      script: "రుచికరమైన",
      roman: "ruchikaramaina",
      notes:
        "Formal adjective. In speech people say రుచిగా ఉంది (ruchigaa undi) or simply బాగుంది (baagundi, it's good).",
    },
    spicy: {
      script: "కారం",
      roman: "kaaram",
      notes:
        'Also chilli powder. "It is spicy" = కారంగా ఉంది (kaarangaa undi). Andhra food is famously spicy.',
    },
    sweetTaste: {
      script: "తీపి",
      roman: "teepi",
      notes: '"It is sweet" = తియ్యగా ఉంది (tiyyagaa undi).',
    },
    iAmHungry: {
      words: [
        ["నాకు", "naaku"],
        ["ఆకలిగా", "aakaligaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes:
        'A dative construction: literally "to me it is hungry-ly". Telugu says the feeling happens TO you (నాకు), not "I am hungry". Also: ఆకలేస్తోంది (aakalestondi).',
    },
    iAmThirsty: {
      words: [
        ["నాకు", "naaku"],
        ["దాహంగా", "daahangaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes: 'Literally "to me it is thirsty". Also: నాకు దాహం వేస్తోంది (naaku daaham vestondi).',
    },
    iWantWater: {
      words: [
        ["నాకు", "naaku"],
        ["నీళ్ళు", "neellu"],
        ["కావాలి", "kaavaali"],
      ],
      blank: 1,
      notes:
        'Literally "to me water is needed". కావాలి (kaavaali) = is wanted / needed; the person takes -కు (నాకు).',
    },
    iWantTea: {
      words: [
        ["నాకు", "naaku"],
        ["టీ", "tee"],
        ["కావాలి", "kaavaali"],
      ],
      blank: 1,
      notes: "Same pattern: నాకు + thing + కావాలి. Politely in a shop: ఒక టీ ఇవ్వండి.",
    },
    iWantFood: {
      words: [
        ["నాకు", "naaku"],
        ["భోజనం", "bhojanam"],
        ["కావాలి", "kaavaali"],
      ],
      blank: 1,
      notes: '"I don\'t want" uses వద్దు: నాకు భోజనం వద్దు (naaku bhojanam vaddu).',
    },
    iDontEatMeat: {
      words: [
        ["నేను", "nenu"],
        ["మాంసం", "maamsam"],
        ["తినను", "tinanu"],
      ],
      blank: 1,
      notes:
        'తినను (tinanu) = I don\'t eat (negative of తింటాను). You can also say నేను శాకాహారిని (nenu shaakaahaarini, I am vegetarian) or "veg".',
    },
    // Food & drinks › Ordering food (lesson "ordering-food")
    breakfast: {
      script: "టిఫిన్",
      roman: "tiphin",
      notes:
        'Breakfast (idli, dosa, upma…) is called టిఫిన్ ("tiffin"); టిఫిన్ చేశారా? = have you had breakfast? Formal: అల్పాహారం (alpaahaaram).',
    },
    lunch: {
      script: "మధ్యాహ్న భోజనం",
      roman: "madhyaahna bhojanam",
      notes: 'Literally "midday meal". In speech: మధ్యాహ్నం భోజనం or just భోజనం / "lunch".',
    },
    dinner: {
      script: "రాత్రి భోజనం",
      roman: "raatri bhojanam",
      notes: 'Literally "night meal". People also say "dinner".',
    },
    giveMeOneTea: {
      words: [
        ["ఒక", "oka"],
        ["టీ", "tee"],
        ["ఇవ్వండి", "ivvandi"],
      ],
      blank: 2,
      notes:
        "ఒక (oka) = one/a, before a noun. At a tea stall people often just say ఒక టీ (one tea). Casual: ఒక టీ ఇవ్వు.",
    },
    whatWouldYouLike: {
      words: [
        ["మీకు", "meeku"],
        ["ఏం", "em"],
        ["కావాలి?", "kaavaali?"],
      ],
      notes:
        'Literally "to you what is needed?". Waiters also say ఏం తీసుకుంటారు? (em teesukuntaaru?, what will you have?).',
    },
    billPlease: {
      words: [
        ["బిల్లు", "billu"],
        ["తీసుకురండి", "teesukurandi"],
      ],
      notes: 'Literally "please bring the bill". Also: బిల్లు ఇవ్వండి (billu ivvandi).',
    },
    withoutSugar: {
      words: [
        ["చక్కెర", "chakkera"],
        ["లేకుండా", "lekundaa"],
        ["ఇవ్వండి", "ivvandi"],
      ],
      blank: 1,
      notes:
        "లేకుండా (lekundaa) = without. At a tea stall people usually say షుగర్ లేకుండా (shugar lekundaa).",
    },
    isItSpicy: {
      words: [
        ["ఇది", "idi"],
        ["కారంగా", "kaarangaa"],
        ["ఉంటుందా?", "untundaa?"],
      ],
      blank: 1,
      notes:
        "The -ఆ (-aa) at the end turns a statement into a yes/no question: ఉంటుంది (it will be) → ఉంటుందా? (will it be?).",
    },
    itIsVeryTasty: {
      words: [
        ["చాలా", "chaalaa"],
        ["రుచిగా", "ruchigaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes: "Hosts love to hear this. Also simply చాలా బాగుంది (very good).",
    },
    giveMeWater: {
      words: [
        ["కొంచెం", "konchem"],
        ["నీళ్ళు", "neellu"],
        ["ఇవ్వండి", "ivvandi"],
      ],
      blank: 1,
      notes: "కొంచెం (konchem) = a little / some, and softens the request.",
    },
    oneMorePlease: {
      words: [
        ["ఇంకొకటి", "inkokati"],
        ["ఇవ్వండి", "ivvandi"],
      ],
      notes:
        "ఇంకొకటి (inkokati) = one more (thing). For more of something uncountable: ఇంకా కొంచెం (inkaa konchem, a little more).",
    },
    // Numbers, time & dates › Numbers 1–10 (lesson "numbers-1-10")
    one: {
      script: "ఒకటి",
      roman: "okati",
      notes: "Before a noun it becomes ఒక (oka): ఒక టీ (one tea). For one person: ఒక్కరు (okkaru).",
    },
    two: { script: "రెండు", roman: "rendu", notes: "Two people = ఇద్దరు (iddaru)." },
    three: { script: "మూడు", roman: "moodu", notes: "Three people = ముగ్గురు (mugguru)." },
    four: { script: "నాలుగు", roman: "naalugu", notes: "Four people = నలుగురు (naluguru)." },
    five: { script: "ఐదు", roman: "aidu", notes: "Also written అయిదు (ayidu)." },
    six: { script: "ఆరు", roman: "aaru" },
    seven: { script: "ఏడు", roman: "edu" },
    eight: { script: "ఎనిమిది", roman: "enimidi" },
    nine: { script: "తొమ్మిది", roman: "tommidi" },
    ten: { script: "పది", roman: "padi" },
    // Numbers, time & dates › Numbers 11–20 (lesson "numbers-11-20")
    eleven: { script: "పదకొండు", roman: "padakondu" },
    twelve: { script: "పన్నెండు", roman: "pannendu" },
    thirteen: { script: "పదమూడు", roman: "padamoodu" },
    fourteen: { script: "పద్నాలుగు", roman: "padnaalugu" },
    fifteen: { script: "పదిహేను", roman: "padihenu" },
    sixteen: { script: "పదహారు", roman: "padahaaru" },
    seventeen: { script: "పదిహేడు", roman: "padihedu" },
    eighteen: { script: "పద్దెనిమిది", roman: "paddenimidi" },
    nineteen: { script: "పందొమ్మిది", roman: "pandommidi" },
    twenty: {
      script: "ఇరవై",
      roman: "iravai",
      notes:
        'In cities, prices, phone numbers and times are often said in English numbers ("twenty"), but Telugu numbers are used everywhere.',
    },
    // Numbers, time & dates › Tens & big numbers (lesson "big-numbers")
    thirty: { script: "ముప్పై", roman: "muppai", notes: "Also written ముప్ఫై (mupphai)." },
    forty: { script: "నలభై", roman: "nalabhai" },
    fifty: { script: "యాభై", roman: "yaabhai" },
    hundred: {
      script: "వంద",
      roman: "vanda",
      notes: "Also నూరు (nooru), more traditional. 200 = రెండు వందలు (rendu vandalu).",
    },
    thousand: {
      script: "వెయ్యి",
      roman: "veyyi",
      notes:
        "2000 = రెండు వేలు (rendu velu). Big numbers: లక్ష (laksha, 100,000), కోటి (koti, 10 million).",
    },
    howMany: {
      words: [["ఎన్ని?", "enni?"]],
      notes: 'For things. For people use ఎంతమంది? (entamandi?). "How much?" is ఎంత? (enta?).',
    },
    // Numbers, time & dates › Age & phone numbers (lesson "age-phone")
    age: { script: "వయసు", roman: "vayasu", notes: "Also spelled వయస్సు (vayassu)." },
    year: {
      script: "సంవత్సరం",
      roman: "samvatsaram",
      notes:
        "Everyday: ఏడాది (edaadi). For age, years are ఏళ్ళు (ellu): ఇరవై ఏళ్ళు (twenty years).",
    },
    howOldAreYou: {
      words: [
        ["మీ", "mee"],
        ["వయసు", "vayasu"],
        ["ఎంత?", "enta?"],
      ],
      notes:
        'Literally "your age how much?". Casual: నీ వయసు ఎంత? or నీకు ఎన్నేళ్ళు? (neeku ennellu?).',
    },
    iAmTwentyYearsOld: {
      words: [
        ["నాకు", "naaku"],
        ["ఇరవై", "iravai"],
        ["ఏళ్ళు", "ellu"],
      ],
      blank: 1,
      notes:
        'Literally "to me twenty years". Also: నా వయసు ఇరవై (naa vayasu iravai, my age is twenty).',
    },
    phoneNumber: {
      script: "ఫోన్ నంబర్",
      roman: "phon nambar",
      notes: "Numbers are usually read out digit by digit, often in English.",
    },
    whatIsYourPhoneNumber: {
      words: [
        ["మీ", "mee"],
        ["ఫోన్", "phon"],
        ["నంబర్", "nambar"],
        ["ఎంత?", "enta?"],
      ],
      blank: 3,
      notes:
        'Telugu asks "how much" (ఎంత) for numbers. మీ నంబర్ ఏంటి? is also heard. Casual: నీ నంబర్ ఎంత?',
    },
    // Numbers, time & dates › Time of day (lesson "time")
    time: {
      script: "సమయం",
      roman: "samayam",
      notes: "In speech the English టైం (taim) is very common: టైం లేదు (no time).",
    },
    now: { script: "ఇప్పుడు", roman: "ippudu", notes: '"Right now" = ఇప్పుడే (ippude).' },
    today: {
      script: "ఈరోజు",
      roman: "eeroju",
      notes: "ఈ (this) + రోజు (day); also written ఈ రోజు. Colloquially ఇవాళ (ivaala).",
    },
    tomorrow: { script: "రేపు", roman: "repu", notes: "Day after tomorrow = ఎల్లుండి (ellundi)." },
    yesterday: { script: "నిన్న", roman: "ninna", notes: "Day before yesterday = మొన్న (monna)." },
    morning: {
      script: "ఉదయం",
      roman: "udayam",
      notes: 'Everyday word: పొద్దున (podduna); "early morning" = పొద్దున్నే (poddunne).',
    },
    afternoon: { script: "మధ్యాహ్నం", roman: "madhyaahnam" },
    evening: { script: "సాయంత్రం", roman: "saayantram" },
    night: {
      script: "రాత్రి",
      roman: "raatri",
      notes: "At night = రాత్రి (no ending needed): రాత్రి వస్తాను (I'll come at night).",
    },
    whatTimeIsIt: {
      words: [
        ["టైం", "taim"],
        ["ఎంత", "enta"],
        ["అయింది?", "ayindi?"],
      ],
      notes:
        'Literally "how much time has it become?". Formal: సమయం ఎంత అయింది? (samayam enta ayindi?).',
    },
    itIsFiveOClock: {
      words: [
        ["ఐదు", "aidu"],
        ["గంటలు", "gantalu"],
        ["అయింది", "ayindi"],
      ],
      blank: 0,
      notes:
        "గంట (ganta) = hour/o'clock. One o'clock is ఒంటి గంట (onti ganta), not ఒకటి గంట. \"At five\" = ఐదు గంటలకు (aidu gantalaku).",
    },
    // Numbers, time & dates › Days of the week (lesson "days")
    monday: {
      script: "సోమవారం",
      roman: "somavaaram",
      notes:
        'Each day ends in -వారం (vaaram, day/week). English day names ("Monday") are also widely used.',
    },
    tuesday: { script: "మంగళవారం", roman: "mangalavaaram" },
    wednesday: { script: "బుధవారం", roman: "budhavaaram" },
    thursday: {
      script: "గురువారం",
      roman: "guruvaaram",
      notes: "Also బృహస్పతివారం (brihaspativaaram), formal.",
    },
    friday: { script: "శుక్రవారం", roman: "shukravaaram" },
    saturday: { script: "శనివారం", roman: "shanivaaram" },
    sunday: { script: "ఆదివారం", roman: "aadivaaram" },
    day: {
      script: "రోజు",
      roman: "roju",
      notes: "Every day = రోజూ (rojoo) or ప్రతిరోజు (pratiroju).",
    },
    week: {
      script: "వారం",
      roman: "vaaram",
      notes: 'Next week = వచ్చే వారం (vachche vaaram, "the coming week").',
    },
    month: {
      script: "నెల",
      roman: "nela",
      notes: "Next month = వచ్చే నెల (vachche nela); this month = ఈ నెల (ee nela).",
    },
    whatDayIsToday: {
      words: [
        ["ఈరోజు", "eeroju"],
        ["ఏ", "e"],
        ["వారం?", "vaaram?"],
      ],
      notes: 'Literally "today which -vaaram?". Colloquially ఈరోజు ఏం వారం? (eeroju em vaaram?).',
    },
    todayIsMonday: {
      words: [
        ["ఈరోజు", "eeroju"],
        ["సోమవారం", "somavaaram"],
      ],
      blank: 1,
      notes: 'No verb "is" needed.',
    },
    // Daily life › Morning & evening (lesson "routine-verbs")
    wakeUp: {
      script: "లేవడం",
      roman: "levadam",
      notes: '"I wake up" = లేస్తాను (lestaanu). Also means "to get up / stand up".',
    },
    sleep: {
      script: "నిద్రపోవడం",
      roman: "nidrapovadam",
      notes:
        '"Go to bed / lie down" = పడుకోవడం (padukovadam), which is what people usually say: పది గంటలకు పడుకుంటాను.',
    },
    bathe: {
      script: "స్నానం చేయడం",
      roman: "snaanam cheyadam",
      notes: 'Literally "to do a bath". There is no separate word for "shower".',
    },
    cook: {
      script: "వంట చేయడం",
      roman: "vanta cheyadam",
      notes: 'Literally "to do cooking"; వంట (vanta) = cooking, వంటిల్లు (vantillu) = kitchen.',
    },
    wash: {
      script: "కడగడం",
      roman: "kadagadam",
      notes: "For hands, dishes, face. Washing clothes is ఉతకడం (utakadam).",
    },
    wear: {
      script: "వేసుకోవడం",
      roman: "vesukovadam",
      notes: "For shirts, shoes, etc. A saree or dhoti is కట్టుకోవడం (kattukovadam, to tie on).",
    },
    // Daily life › Study, work & play (lesson "activity-verbs")
    study: {
      script: "చదువుకోవడం",
      roman: "chaduvukovadam",
      notes:
        'From చదువు (study/education). "What are you studying?" = ఏం చదువుతున్నారు? (em chaduvutunnaaru?).',
    },
    work: {
      script: "పని చేయడం",
      roman: "pani cheyadam",
      notes: 'Literally "to do work"; పని (pani) = work/task.',
    },
    read: {
      script: "చదవడం",
      roman: "chadavadam",
      notes: 'Same root as "study": చదవడం = read, చదువుకోవడం = study (read for oneself).',
    },
    write: {
      script: "రాయడం",
      roman: "raayadam",
      notes: "Also written వ్రాయడం (vraayadam) in formal Telugu.",
    },
    play: {
      script: "ఆడడం",
      roman: "aadadam",
      notes: "Also spelled ఆడటం. ఆడుకోవడం (aadukovadam) = to play (for fun, as children do).",
    },
    listen: {
      script: "వినడం",
      roman: "vinadam",
      notes: 'Polite command: వినండి (vinandi). "Can you hear?" = వినిపిస్తోందా? (vinipistondaa?).',
    },
    speak: {
      script: "మాట్లాడడం",
      roman: "maatlaadadam",
      notes: "From మాట (word) + ఆడడం. Also spelled మాట్లాడటం.",
    },
    // Daily life › Sit, stand & wait (lesson "movement-verbs")
    sit: {
      script: "కూర్చోవడం",
      roman: "koorchovadam",
      notes: "Polite: కూర్చోండి (koorchondi); casual: కూర్చో (koorcho).",
    },
    stand: { script: "నిలబడడం", roman: "nilabadadam", notes: "Polite: నిలబడండి (nilabadandi)." },
    walk: {
      script: "నడవడం",
      roman: "nadavadam",
      notes: '"On foot" = నడిచి (nadichi): నడిచి ఐదు నిమిషాలు (five minutes\' walk).',
    },
    run: {
      script: "పరిగెత్తడం",
      roman: "parigettadam",
      notes: "Also spelled పరుగెత్తడం (parugettadam).",
    },
    wait: {
      script: "ఎదురుచూడడం",
      roman: "eduruchoodadam",
      notes:
        '"To wait for / look forward to". For "wait!" people say ఆగండి (aagandi, stop/wait) or English "wait": వెయిట్ చేయండి (veyit cheyandi).',
    },
    open: {
      script: "తెరవడం",
      roman: "teravadam",
      notes: "In speech people often say తీయడం (teeyadam): తలుపు తీయండి (open the door).",
    },
    close: {
      script: "మూయడం",
      roman: "mooyadam",
      notes: "In speech people often say వేయడం (veyadam): తలుపు వేయండి (close the door).",
    },
    // Daily life › What are you doing? (lesson "what-are-you-doing")
    whatAreYouDoing: {
      words: [
        ["మీరు", "meeru"],
        ["ఏం", "em"],
        ["చేస్తున్నారు?", "chestunnaaru?"],
      ],
      blank: 2,
      notes: "Casual: ఏం చేస్తున్నావు? (em chestunnaavu?), often shortened to ఏం చేస్తున్నావ్?.",
    },
    iAmStudying: {
      words: [
        ["నేను", "nenu"],
        ["చదువుకుంటున్నాను", "chaduvukuntunnaanu"],
      ],
      notes:
        'Present continuous: verb stem + -తున్నాను (-tunnaanu) for "I am …-ing". Speech shortens -ఆను to -ఆ: చదువుకుంటున్నా.',
    },
    iAmEating: {
      words: [
        ["నేను", "nenu"],
        ["తింటున్నాను", "tintunnaanu"],
      ],
      notes: "తిను (eat) + -తున్నాను. Casual short form: తింటున్నా (tintunnaa).",
    },
    iAmDrinkingWater: {
      words: [
        ["నేను", "nenu"],
        ["నీళ్ళు", "neellu"],
        ["తాగుతున్నాను", "taagutunnaanu"],
      ],
      blank: 2,
      notes: 'Object before verb: "I water am-drinking".',
    },
    iAmSleeping: {
      words: [
        ["నేను", "nenu"],
        ["నిద్రపోతున్నాను", "nidrapotunnaanu"],
      ],
      notes: '"I\'m going to bed" = పడుకుంటున్నాను (padukuntunnaanu).',
    },
    iAmWorking: {
      words: [
        ["నేను", "nenu"],
        ["పని", "pani"],
        ["చేస్తున్నాను", "chestunnaanu"],
      ],
      blank: 2,
    },
    iAmComing: {
      words: [
        ["నేను", "nenu"],
        ["వస్తున్నాను", "vastunnaanu"],
      ],
      notes:
        "Shouted from another room: వస్తున్నా! (vastunnaa!). Endings show the person: వస్తున్నాడు (he), వస్తోంది (she), వస్తున్నారు (you/they).",
    },
    iAmGoing: {
      words: [
        ["నేను", "nenu"],
        ["వెళ్తున్నాను", "veltunnaanu"],
      ],
      notes:
        "Also spelled వెళ్ళుతున్నాను. When leaving someone's house, say వెళ్ళొస్తాను (I'll go and come) instead.",
    },
    // Daily life › My day (lesson "my-day")
    everyDay: {
      script: "ప్రతిరోజు",
      roman: "pratiroju",
      notes: "In speech: రోజూ (rojoo): నేను రోజూ వస్తాను (I come every day).",
    },
    iAmGoingHome: {
      words: [
        ["నేను", "nenu"],
        ["ఇంటికి", "intiki"],
        ["వెళ్తున్నాను", "veltunnaanu"],
      ],
      blank: 1,
      notes: "ఇంటికి (intiki) = to home: ఇల్లు + -కి (to).",
    },
    iAmGoingToCollege: {
      words: [
        ["నేను", "nenu"],
        ["కాలేజీకి", "kaalejeeki"],
        ["వెళ్తున్నాను", "veltunnaanu"],
      ],
      blank: 1,
      notes: '-కి / -కు = "to". Words ending in -i/-ee take -కి: కాలేజీకి.',
    },
    iWakeUpAtSix: {
      words: [
        ["నేను", "nenu"],
        ["ఆరు", "aaru"],
        ["గంటలకు", "gantalaku"],
        ["లేస్తాను", "lestaanu"],
      ],
      blank: 1,
      notes:
        '"At six o\'clock" = ఆరు గంటలకు (six hours-at). Habits use the same form as the future: లేస్తాను = I wake up / I will wake up.',
    },
    iGoToCollegeEveryDay: {
      words: [
        ["నేను", "nenu"],
        ["రోజూ", "rojoo"],
        ["కాలేజీకి", "kaalejeeki"],
        ["వెళ్తాను", "veltaanu"],
      ],
      blank: 1,
      notes: "Time words come early, before the place and the verb.",
    },
    iEatLunchAtOne: {
      words: [
        ["నేను", "nenu"],
        ["ఒంటి", "onti"],
        ["గంటకు", "gantaku"],
        ["భోజనం", "bhojanam"],
        ["చేస్తాను", "chestaanu"],
      ],
      blank: 1,
      notes:
        'One o\'clock is ఒంటి గంట (onti ganta). "To eat a meal" is భోజనం చేయడం (to do a meal); you can also say అన్నం తింటాను.',
    },
    iSleepAtTen: {
      words: [
        ["నేను", "nenu"],
        ["రాత్రి", "raatri"],
        ["పది", "padi"],
        ["గంటలకు", "gantalaku"],
        ["పడుకుంటాను", "padukuntaanu"],
      ],
      blank: 2,
      notes: "పడుకోవడం (to lie down / go to bed) is what people say for bedtime.",
    },
    // Places & directions › Places in town (lesson "places-1")
    school: {
      script: "స్కూల్",
      roman: "skool",
      notes: "Everyday word. Native: బడి (badi); formal: పాఠశాల (paathashaala).",
    },
    college: { script: "కాలేజీ", roman: "kaalejee", notes: "Formal: కళాశాల (kalaashaala)." },
    office: {
      script: "ఆఫీసు",
      roman: "aapheesu",
      notes: "Formal: కార్యాలయం (kaaryaalayam). At the office = ఆఫీసులో (aapheesulo).",
    },
    shop: {
      script: "దుకాణం",
      roman: "dukaanam",
      notes: "Also కొట్టు (kottu, small shop) and English షాపు (shaapu).",
    },
    market: {
      script: "బజారు",
      roman: "bajaaru",
      notes: "Also మార్కెట్ (maarket). A weekly village market is సంత (santa).",
    },
    restaurant: {
      script: "హోటల్",
      roman: "hotal",
      notes:
        'In India a restaurant is commonly called a "hotel". రెస్టారెంట్ (restaarent) is used for fancier places; a small eatery is మెస్ (mes).',
    },
    // Places & directions › More places (lesson "places-2")
    hospital: {
      script: "ఆసుపత్రి",
      roman: "aasupatri",
      notes: "Also హాస్పిటల్ (haaspital), very common.",
    },
    station: {
      script: "రైల్వే స్టేషన్",
      roman: "railve steshan",
      notes: "Usually just స్టేషన్ (steshan). To the station = స్టేషన్‌కి (steshanki).",
    },
    bank: { script: "బ్యాంకు", roman: "byaanku" },
    temple: {
      script: "గుడి",
      roman: "gudi",
      notes: "Formal: దేవాలయం (devaalayam). Famous: Tirumala, near Tirupati.",
    },
    bathroom: {
      script: "బాత్రూం",
      roman: "baatroom",
      notes:
        "Everyday word, also టాయిలెట్ (taayilet). Formal: మరుగుదొడ్డి (marugudoddi, toilet) and స్నానాల గది (bathroom for bathing).",
    },
    road: {
      script: "రోడ్డు",
      roman: "roddu",
      notes: "A path or way is దారి (daari); a street/lane is వీధి (veedhi).",
    },
    // Places & directions › Near, far, left & right (lesson "position-words")
    near: {
      script: "దగ్గర",
      roman: "daggara",
      notes:
        'Comes after the noun: బజారు దగ్గర (near the market). నా దగ్గర also means "with me / I have".',
    },
    far: {
      script: "దూరం",
      roman: "dooram",
      notes: 'Also a noun "distance": ఎంత దూరం? (how far?).',
    },
    left: { script: "ఎడమ", roman: "edama", notes: "To the left = ఎడమ వైపు (edama vaipu)." },
    right: {
      script: "కుడి",
      roman: "kudi",
      notes: "To the right = కుడి వైపు (kudi vaipu). (కుడి also means right-hand.)",
    },
    straight: {
      script: "నేరుగా",
      roman: "nerugaa",
      notes: 'Also తిన్నగా (tinnagaa) and English "straight" (స్ట్రెయిట్).',
    },
    inFront: {
      script: "ముందు",
      roman: "mundu",
      notes: 'After a noun: ఇంటి ముందు (in front of the house). Also means "before" in time.',
    },
    behind: {
      script: "వెనక",
      roman: "venaka",
      notes: "Also written వెనుక (venuka). ఆఫీసు వెనక = behind the office.",
    },
    inside: {
      script: "లోపల",
      roman: "lopala",
      notes: "Into = లోపలికి (lopaliki): లోపలికి రండి (come in).",
    },
    outside: { script: "బయట", roman: "bayata", notes: "Out to = బయటికి (bayatiki)." },
    // Places & directions › Asking for directions (lesson "asking-directions")
    where: {
      script: "ఎక్కడ",
      roman: "ekkada",
      notes: "Where to = ఎక్కడికి (ekkadiki); where from = ఎక్కడి నుండి (ekkadi nundi).",
    },
    whereIsTheBathroom: {
      words: [
        ["బాత్రూం", "baatroom"],
        ["ఎక్కడ", "ekkada"],
        ["ఉంది?", "undi?"],
      ],
      blank: 0,
      notes: "Polite opener: ఏమండీ, బాత్రూం ఎక్కడ ఉంది?. Also టాయిలెట్ ఎక్కడ?",
    },
    whereIsTheStation: {
      words: [
        ["రైల్వే", "railve"],
        ["స్టేషన్", "steshan"],
        ["ఎక్కడ", "ekkada"],
        ["ఉంది?", "undi?"],
      ],
      blank: 1,
      notes: 'Literally "railway station where is?" — the question word comes before the verb.',
    },
    goStraight: {
      words: [
        ["నేరుగా", "nerugaa"],
        ["వెళ్ళండి", "vellandi"],
      ],
      notes: "Casual: నేరుగా వెళ్ళు (nerugaa vellu) or స్ట్రెయిట్ వెళ్ళు.",
    },
    turnLeft: {
      words: [
        ["ఎడమ", "edama"],
        ["వైపు", "vaipu"],
        ["తిరగండి", "tiragandi"],
      ],
      blank: 0,
      notes:
        "వైపు (vaipu) = side/direction; తిరగండి = please turn. Casual: ఎడమ వైపు తిరుగు. People also say లెఫ్ట్ తీసుకోండి (take a left).",
    },
    turnRight: {
      words: [
        ["కుడి", "kudi"],
        ["వైపు", "vaipu"],
        ["తిరగండి", "tiragandi"],
      ],
      blank: 0,
      notes: "Casual: కుడి వైపు తిరుగు. Also రైట్ తీసుకోండి (take a right).",
    },
    itIsNear: {
      words: [
        ["దగ్గరే", "daggare"],
        ["ఉంది", "undi"],
      ],
      notes: 'The -ఏ (-e) on దగ్గరే adds emphasis: "it\'s quite near".',
    },
    itIsFar: {
      words: [
        ["దూరంగా", "doorangaa"],
        ["ఉంది", "undi"],
      ],
      notes: "Also చాలా దూరం (chaalaa dooram, very far).",
    },
    howFarIsIt: {
      words: [
        ["ఎంత", "enta"],
        ["దూరం", "dooram"],
        ["ఉంటుంది?", "untundi?"],
      ],
      notes: 'Literally "how much distance will it be?". Short: ఎంత దూరం?',
    },
    // Places & directions › Where are you going? (lesson "where-are-you-going")
    whereAreYouGoing: {
      words: [
        ["మీరు", "meeru"],
        ["ఎక్కడికి", "ekkadiki"],
        ["వెళ్తున్నారు?", "veltunnaaru?"],
      ],
      blank: 1,
      notes:
        "ఎక్కడికి = where to. Casual: ఎక్కడికి వెళ్తున్నావు?. (Some older people consider asking this to someone just setting out unlucky, and ask ఎటు? or nothing.)",
    },
    iAmGoingToTheMarket: {
      words: [
        ["నేను", "nenu"],
        ["బజారుకు", "bajaaruku"],
        ["వెళ్తున్నాను", "veltunnaanu"],
      ],
      blank: 1,
      notes: "బజారు + -కు = to the market. In speech you also hear బజారుకి and మార్కెట్‌కి.",
    },
    whereAreYou: {
      words: [
        ["మీరు", "meeru"],
        ["ఎక్కడ", "ekkada"],
        ["ఉన్నారు?", "unnaaru?"],
      ],
      notes: "Casual (e.g. on the phone to a friend): ఎక్కడ ఉన్నావు? (ekkada unnaavu?).",
    },
    iAmAtHome: {
      words: [
        ["నేను", "nenu"],
        ["ఇంట్లో", "intlo"],
        ["ఉన్నాను", "unnaanu"],
      ],
      blank: 1,
      notes: "ఇంట్లో (intlo) = in the house / at home: ఇల్లు + -లో (in).",
    },
    comeHere: {
      words: [
        ["ఇక్కడికి", "ikkadiki"],
        ["రండి", "randi"],
      ],
      notes: "Polite. Casual: ఇక్కడికి రా (ikkadiki raa).",
    },
    waitHere: {
      words: [
        ["ఇక్కడే", "ikkade"],
        ["ఆగండి", "aagandi"],
      ],
      notes:
        'Literally "stop right here". ఆగడం (aagadam) = to stop/wait. Also ఇక్కడే ఉండండి (stay right here). Casual: ఇక్కడే ఆగు.',
    },
    // Shopping & money › Money & prices (lesson "money-words")
    rupee: {
      script: "రూపాయి",
      roman: "roopaayi",
      notes: "Plural: రూపాయలు (roopaayalu): వంద రూపాయలు (100 rupees).",
    },
    price: { script: "ధర", roman: "dhara", notes: "Also రేటు (retu, rate), common in markets." },
    buy: { script: "కొనడం", roman: "konadam", notes: '"I\'ll buy" = కొంటాను (kontaanu).' },
    sell: {
      script: "అమ్మడం",
      roman: "ammadam",
      notes: "Careful: అమ్మ (amma) is mother; అమ్మడం is to sell.",
    },
    expensive: {
      script: "ఖరీదైన",
      roman: "khareedaina",
      notes:
        '"It\'s expensive" = ఖరీదు ఎక్కువ or చాలా ఖరీదు. English "costly" (కాస్ట్లీ) is very common.',
    },
    cheap: { script: "చౌక", roman: "chauka", notes: "Also తక్కువ ధర (takkuva dhara, low price)." },
    howMuch: {
      script: "ఎంత",
      roman: "enta",
      notes: 'Used for price, amount, distance and even numbers. ఎంత? alone = "how much?".',
    },
    // Shopping & money › Colours (lesson "colours")
    colour: { script: "రంగు", roman: "rangu", notes: '"In red" = ఎర్ర రంగులో (erra rangulo).' },
    red: {
      script: "ఎరుపు",
      roman: "erupu",
      notes: "Before a noun: ఎర్ర (erra): ఎర్ర చీర (a red saree).",
    },
    blue: { script: "నీలం", roman: "neelam", notes: "Before a noun: నీలి (neeli) or నీలం రంగు." },
    green: {
      script: "ఆకుపచ్చ",
      roman: "aakupachcha",
      notes: 'Literally "leaf-green"; often just పచ్చ (pachcha).',
    },
    yellow: { script: "పసుపు", roman: "pasupu", notes: "Also the word for turmeric." },
    white: {
      script: "తెలుపు",
      roman: "telupu",
      notes: "Before a noun: తెల్ల (tella): తెల్ల చొక్కా (a white shirt).",
    },
    black: { script: "నలుపు", roman: "nalupu", notes: "Before a noun: నల్ల (nalla)." },
    // Shopping & money › Clothes (lesson "clothes")
    clothes: { script: "బట్టలు", roman: "battalu" },
    shirt: { script: "చొక్కా", roman: "chokkaa", notes: "Also షర్టు (shartu)." },
    trousers: { script: "ప్యాంటు", roman: "pyaantu" },
    saree: {
      script: "చీర",
      roman: "cheera",
      notes:
        "Andhra is famous for handloom sarees from Venkatagiri, Mangalagiri and Dharmavaram; Telangana for Pochampally.",
    },
    shoes: { script: "బూట్లు", roman: "bootlu", notes: "Also షూస్ (shoos)." },
    slippers: {
      script: "చెప్పులు",
      roman: "cheppulu",
      notes: "Take them off before entering a home or temple.",
    },
    // Shopping & money › At the shop (lesson "at-the-shop")
    howMuchIsThis: {
      words: [
        ["ఇది", "idi"],
        ["ఎంత?", "enta?"],
      ],
      notes:
        'Literally "this how much?". Also దీని ధర ఎంత? (deeni dhara enta?, what is the price of this?).',
    },
    thisIsTooExpensive: {
      words: [
        ["ఇది", "idi"],
        ["చాలా", "chaalaa"],
        ["ఖరీదు", "khareedu"],
      ],
      blank: 2,
      notes: 'In markets people often say చాలా ఎక్కువ ("too much") or "చాలా costly".',
    },
    reduceThePrice: {
      words: [
        ["ధర", "dhara"],
        ["కొంచెం", "konchem"],
        ["తగ్గించండి", "tagginchandi"],
      ],
      blank: 2,
      notes:
        "Bargaining is normal in markets. Also: కొంచెం తగ్గించి ఇవ్వండి (give it a bit cheaper).",
    },
    doYouHaveMangoes: {
      words: [
        ["మామిడిపండ్లు", "maamidipandlu"],
        ["ఉన్నాయా?", "unnaayaa?"],
      ],
      blank: 0,
      notes:
        'Literally "are there mangoes?" — Telugu asks whether something exists. Plural ఉన్నాయా? for plural things; ఉందా? for one.',
    },
    iNeedABag: {
      words: [
        ["నాకు", "naaku"],
        ["ఒక", "oka"],
        ["సంచి", "sanchi"],
        ["కావాలి", "kaavaali"],
      ],
      blank: 2,
      notes:
        'సంచి (sanchi) = cloth/shopping bag. Shops call a plastic carry bag కవర్ (kavar, "cover"): ఒక కవర్ ఇవ్వండి.',
    },
    giveMeThisOne: {
      words: [
        ["ఇది", "idi"],
        ["ఇవ్వండి", "ivvandi"],
      ],
      notes: 'Casual: ఇది ఇవ్వు. With emphasis on "this one": ఇదే ఇవ్వండి (ide ivvandi).',
    },
    iWillTakeIt: {
      words: [
        ["సరే,", "sare,"],
        ["తీసుకుంటాను", "teesukuntaanu"],
      ],
      blank: 1,
      notes:
        'Literally "okay, I\'ll take (it)" — Telugu usually drops "it". Also కొంటాను (kontaanu, I\'ll buy).',
    },
    showMeThatOne: {
      words: [
        ["అది", "adi"],
        ["చూపించండి", "choopinchandi"],
      ],
      notes: "చూపించండి (choopinchandi) = please show. Casual: అది చూపించు.",
    },
    doYouHaveARedOne: {
      words: [
        ["ఎర్ర", "erra"],
        ["రంగులో", "rangulo"],
        ["ఉందా?", "undaa?"],
      ],
      blank: 0,
      notes:
        'Literally "is there (one) in red colour?". Also ఎర్రది ఉందా? (erradi undaa?, is there a red one?).',
    },
    // Travel & transport › Getting around (lesson "vehicles")
    bus: {
      script: "బస్సు",
      roman: "bassu",
      notes:
        "English loan with the Telugu -u ending. City buses in Hyderabad and the state RTC buses are the main way to travel.",
    },
    train: { script: "రైలు", roman: "railu", notes: "Also ట్రైన్ (train)." },
    autoRickshaw: {
      script: "ఆటో",
      roman: "aato",
      notes: "Everyone says ఆటో. Agree on the fare or ask for the meter before getting in.",
    },
    taxi: { script: "టాక్సీ", roman: "taaksee", notes: "App cabs are called క్యాబ్ (kyaab)." },
    car: { script: "కారు", roman: "kaaru" },
    bike: {
      script: "బైక్",
      roman: "baik",
      notes: "Any two-wheeler is commonly called బండి (bandi, vehicle).",
    },
    // Travel & transport › Tickets & stations (lesson "travel-words")
    ticket: { script: "టికెట్", roman: "tiket", notes: "Also written టిక్కెట్టు (tikkettu)." },
    platform: {
      script: "ప్లాట్‌ఫారం",
      roman: "plaatphaaram",
      notes: "English loanword; often just ప్లాట్‌ఫాం (plaatphaam).",
    },
    busStop: {
      script: "బస్ స్టాప్",
      roman: "bas staap",
      notes: "A big bus station is బస్టాండ్ (bastaand) or బస్ స్టేషన్.",
    },
    airport: {
      script: "విమానాశ్రయం",
      roman: "vimaanaashrayam",
      notes: "Formal; in speech everyone says ఎయిర్‌పోర్ట్ (eyirport).",
    },
    luggage: {
      script: "సామాను",
      roman: "saamaanu",
      notes: 'Also "things, goods" in general; English "luggage" (లగేజీ) is also used.',
    },
    journey: {
      script: "ప్రయాణం",
      roman: "prayaanam",
      notes: "Happy journey = శుభ ప్రయాణం (shubha prayaanam).",
    },
    // Travel & transport › When & how long? (lesson "when-how-long")
    when: { script: "ఎప్పుడు", roman: "eppudu" },
    howLong: {
      script: "ఎంతసేపు",
      roman: "entasepu",
      notes: "For a short time span (minutes/hours). For days: ఎన్ని రోజులు? (enni rojulu?).",
    },
    late: {
      script: "ఆలస్యం",
      roman: "aalasyam",
      notes:
        'Late (adverb) = ఆలస్యంగా (aalasyangaa). English "late" (లేట్) is very common: నాకు లేట్ అయింది (naaku let ayindi, I\'m late / I got late).',
    },
    early: {
      script: "ముందుగా",
      roman: "mundugaa",
      notes:
        '"Early / ahead of time". Early in the morning = పొద్దున్నే (poddunne). త్వరగా (tvaragaa) also means early/soon.',
    },
    quickly: {
      script: "త్వరగా",
      roman: "tvaragaa",
      notes: "Also తొందరగా (tondaragaa). In Hyderabad you also hear జల్దీ (jaldee).",
    },
    slowly: { script: "నెమ్మదిగా", roman: "nemmadigaa", notes: "Also మెల్లగా (mellagaa)." },
    whenDoesTheBusCome: {
      words: [
        ["బస్సు", "bassu"],
        ["ఎప్పుడు", "eppudu"],
        ["వస్తుంది?", "vastundi?"],
      ],
      blank: 1,
      notes: "వస్తుంది = it will come / it comes (Telugu uses one form for both).",
    },
    howLongDoesItTake: {
      words: [
        ["ఎంతసేపు", "entasepu"],
        ["పడుతుంది?", "padutundi?"],
      ],
      notes:
        'పట్టడం (to take time): literally "how long will it take". ఎంత టైం పడుతుంది? is also common.',
    },
    theTrainIsLate: {
      words: [
        ["రైలు", "railu"],
        ["ఆలస్యంగా", "aalasyangaa"],
        ["నడుస్తోంది", "nadustondi"],
      ],
      blank: 1,
      notes: 'Literally "the train is running late". Also: రైలు లేట్ (railu let).',
    },
    // Travel & transport › Travel phrases (lesson "travel-phrases")
    oneTicketPlease: {
      words: [
        ["విజయవాడకు", "Vijayavaadaku"],
        ["ఒక", "oka"],
        ["టికెట్", "tiket"],
        ["ఇవ్వండి", "ivvandi"],
      ],
      meaning: "One ticket to Vijayawada, please.",
      blank: 2,
      notes:
        "విజయవాడ + -కు = to Vijayawada (colloquially విజయవాడకి). For two tickets: రెండు టికెట్లు ఇవ్వండి.",
    },
    whichPlatform: {
      words: [
        ["ఏ", "e"],
        ["ప్లాట్‌ఫారం?", "plaatphaaram?"],
      ],
      notes:
        "ఏ (e) = which, before a noun. Full question: రైలు ఏ ప్లాట్‌ఫారం మీదకి వస్తుంది? (which platform does the train come on?).",
    },
    stopHerePlease: {
      words: [
        ["ఇక్కడ", "ikkada"],
        ["ఆపండి", "aapandi"],
      ],
      notes:
        "ఆపడం (aapadam) = to stop (something, e.g. a vehicle). Casual: ఇక్కడ ఆపు. Also: సైడ్ ఆపండి (stop at the side).",
    },
    goSlowlyPlease: {
      words: [
        ["నెమ్మదిగా", "nemmadigaa"],
        ["వెళ్ళండి", "vellandi"],
      ],
      notes: "To a driver. Also: కొంచెం మెల్లగా పోనివ్వండి (konchem mellagaa ponivvandi).",
    },
    howMuchToStation: {
      words: [
        ["రైల్వే", "railve"],
        ["స్టేషన్‌కి", "steshanki"],
        ["ఎంత?", "enta?"],
      ],
      blank: 1,
      notes:
        "Said to an auto driver. Usually just స్టేషన్‌కి ఎంత?. Or ask స్టేషన్ వస్తారా? (will you go to the station?).",
    },
    iAmLost: {
      words: [
        ["నేను", "nenu"],
        ["దారి", "daari"],
        ["తప్పిపోయాను", "tappipoyaanu"],
      ],
      blank: 2,
      notes: 'Literally "I have strayed from the way".',
    },
    doesThisBusGoToStation: {
      words: [
        ["ఈ", "ee"],
        ["బస్సు", "bassu"],
        ["రైల్వే", "railve"],
        ["స్టేషన్‌కి", "steshanki"],
        ["వెళ్తుందా?", "veltundaa?"],
      ],
      blank: 4,
      notes: "వెళ్తుంది (it goes) + -ఆ = yes/no question.",
    },
    // Everyday conversations › Meeting a friend (lesson "conv-friend")
    whatsNew: {
      words: [
        ["ఏంటి", "enti"],
        ["సంగతులు?", "sangatulu?"],
      ],
      notes:
        "Casual, to friends: \"what's up / what's the news?\". Also ఏంటి విశేషాలు? (enti visheshaalu?).",
    },
    longTimeNoSee: {
      words: [
        ["చూసి", "choosi"],
        ["చాలా", "chaalaa"],
        ["రోజులైంది", "rojulaindi"],
      ],
      blank: 2,
      notes:
        'Literally "many days have passed since (I) saw (you)". Fuller: మిమ్మల్ని చూసి చాలా రోజులైంది.',
    },
    haveYouEaten: {
      words: [
        ["భోజనం", "bhojanam"],
        ["చేశారా?", "cheshaaraa?"],
      ],
      notes:
        "A very common friendly greeting, not an invitation. Casual: తిన్నావా? (tinnaavaa?) or భోజనం చేశావా?.",
    },
    yesIAte: {
      words: [
        ["అవును,", "avunu,"],
        ["చేశాను", "cheshaanu"],
      ],
      notes:
        'Literally "yes, I did (the meal)". Casual: ఆ, తిన్నాను (aa, tinnaanu). Also spelled చేసాను.',
    },
    // Everyday conversations › At college (lesson "conv-college")
    whereIsTheClass: {
      words: [
        ["క్లాస్‌రూం", "klaasroom"],
        ["ఎక్కడ", "ekkada"],
        ["ఉంది?", "undi?"],
      ],
      blank: 0,
      notes: "Formal Telugu: తరగతి గది (taragati gadi). Students say క్లాస్ ఎక్కడ?",
    },
    whenIsTheExam: {
      words: [
        ["పరీక్ష", "pareeksha"],
        ["ఎప్పుడు?", "eppudu?"],
      ],
      blank: 0,
      notes: "No verb needed. Students also say ఎగ్జామ్ ఎప్పుడు? (egzaam eppudu?).",
    },
    canIComeIn: {
      words: [
        ["లోపలికి", "lopaliki"],
        ["రావచ్చా?", "raavachchaa?"],
      ],
      notes:
        'Literally "may (I) come inside?". To a teacher add సార్ / మేడమ్ at the start. -వచ్చా = may I?',
    },
    isThisSeatFree: {
      words: [
        ["ఈ", "ee"],
        ["సీటు", "seetu"],
        ["ఖాళీగా", "khaaleegaa"],
        ["ఉందా?", "undaa?"],
      ],
      blank: 2,
      notes: "ఖాళీ (khaalee) = empty/free. Or ask: ఇక్కడ కూర్చోవచ్చా? (may I sit here?).",
    },
    // Everyday conversations › On the phone (lesson "conv-phone")
    hello_onPhone: {
      words: [["హలో?", "halo?"]],
      notes:
        'Everyone answers the phone with హలో. Then: చెప్పండి (cheppandi, "tell me") is a common way to invite the caller to speak.',
    },
    whoIsSpeaking: {
      words: [
        ["ఎవరు", "evaru"],
        ["మాట్లాడుతున్నారు?", "maatlaadutunnaaru?"],
      ],
      notes: "Polite. Casually just ఎవరు? (evaru?).",
    },
    callYouLater: {
      words: [
        ["మీకు", "meeku"],
        ["తర్వాత", "tarvaata"],
        ["ఫోన్", "phon"],
        ["చేస్తాను", "chestaanu"],
      ],
      blank: 1,
      notes: '"To call someone" = someone-కు ఫోన్ చేయడం. Casual: నీకు తర్వాత ఫోన్ చేస్తా.',
    },
    canYouHearMe: {
      words: [
        ["నా", "naa"],
        ["మాట", "maata"],
        ["వినిపిస్తోందా?", "vinipistondaa?"],
      ],
      blank: 2,
      notes: 'Literally "is my word audible?". Often just వినిపిస్తోందా?',
    },
    justAMinute: {
      words: [
        ["ఒక్క", "okka"],
        ["నిమిషం", "nimisham"],
      ],
      notes: "ఒక్క (okka) = just one. Also: ఒక్క నిమిషం ఆగండి (wait one minute).",
    },
    // Everyday conversations › Asking for help (lesson "conv-help")
    whatIsTheNameOfThisPlace: {
      words: [
        ["ఈ", "ee"],
        ["ప్రాంతం", "praantam"],
        ["పేరు", "peru"],
        ["ఏమిటి?", "emiti?"],
      ],
      blank: 1,
      notes:
        "ప్రాంతం (praantam) = area/locality. For a town: ఈ ఊరి పేరు ఏమిటి? (ee oori peru emiti?).",
    },
    ofCourse: {
      words: [["తప్పకుండా", "tappakundaa"]],
      notes:
        'Literally "without fail" — a warm "sure!" when agreeing to a request. Also అలాగే (alaage).',
    },
    // Grammar & sentence building › I, you, he, she… (lesson "pronouns")
    youCasual: {
      script: "నువ్వు",
      roman: "nuvvu",
      notes:
        "For close friends, younger people and children. Using it with elders or strangers is rude; use మీరు (meeru). Verb endings change too: నువ్వు వస్తావా? vs మీరు వస్తారా?",
    },
    he: {
      script: "అతను",
      roman: "atanu",
      notes:
        'Neutral "he". Respectful: ఆయన (aayana) for elders and people you respect. Very casual: వాడు (vaadu), only for friends/younger males.',
    },
    she: {
      script: "ఆమె",
      roman: "aame",
      notes:
        'Neutral "she". Respectful: ఆవిడ (aavida). Very casually (only for close or younger females, e.g. a little sister) people use అది (adi), the same word as "it" — this sounds rude about anyone else.',
    },
    we: {
      script: "మేము",
      roman: "memu",
      notes:
        '"We" not including the listener. మనం (manam) = we including you: మనం వెళ్దాం (let\'s go, you and I).',
    },
    they: {
      script: "వాళ్ళు",
      roman: "vaallu",
      notes: "Respectful/formal: వారు (vaaru). Also used respectfully for a single person.",
    },
    itPronoun: {
      script: "అది (ఇది)",
      roman: "adi (idi)",
      notes:
        'Telugu has no separate word for "it": things far away or already mentioned are అది (adi, "that"), things nearby are ఇది (idi, "this"). Plural: అవి / ఇవి.',
    },
    // Grammar & sentence building › Word order & the present (lesson "word-order")
    iEatRice: {
      words: [
        ["నేను", "nenu"],
        ["అన్నం", "annam"],
        ["తింటాను", "tintaanu"],
      ],
      blank: 2,
      notes:
        'Subject – object – verb: "I rice eat". The ending -ఆను (-aanu) means "I". This form also means "I will eat".',
    },
    sheDrinksTea: {
      words: [
        ["ఆమె", "aame"],
        ["టీ", "tee"],
        ["తాగుతుంది", "taagutundi"],
      ],
      blank: 2,
      notes:
        "-తుంది (-tundi) is the present/future ending for she/it (తాగుతుంది = she drinks). Respectful: ఆవిడ టీ తాగుతారు (aavida tee taagutaaru).",
    },
    weGoToCollege: {
      words: [
        ["మేము", "memu"],
        ["కాలేజీకి", "kaalejeeki"],
        ["వెళ్తాము", "veltaamu"],
      ],
      blank: 1,
      notes: '-ఆము (-aamu) = "we" ending; in speech often -ఆం: వెళ్తాం (veltaam).',
    },
    heReadsABook: {
      words: [
        ["అతను", "atanu"],
        ["పుస్తకం", "pustakam"],
        ["చదువుతాడు", "chaduvutaadu"],
      ],
      blank: 2,
      notes: '-ఆడు (-aadu) = "he" ending. "He is reading" = చదువుతున్నాడు (chaduvutunnaadu).',
    },
    theyLiveInIndia: {
      words: [
        ["వాళ్ళు", "vaallu"],
        ["భారతదేశంలో", "bhaaratadeshamlo"],
        ["ఉంటారు", "untaaru"],
      ],
      blank: 1,
      notes: '-లో (-lo) = in. -ఆరు (-aaru) = "they / you (polite)" ending.',
    },
    myMotherCooksFood: {
      words: [
        ["మా", "maa"],
        ["అమ్మ", "amma"],
        ["వంట", "vanta"],
        ["చేస్తుంది", "chestundi"],
      ],
      blank: 2,
      notes:
        'Literally "our mother does cooking". Many people use the respectful plural for their mother: మా అమ్మ వంట చేస్తారు.',
    },
    iSpeakEnglish: {
      words: [
        ["నేను", "nenu"],
        ["ఇంగ్లీషు", "ingleeshu"],
        ["మాట్లాడతాను", "maatlaadataanu"],
      ],
      blank: 1,
      notes: "Also నాకు ఇంగ్లీషు వచ్చు (naaku ingleeshu vachchu, I know English).",
    },
    // Grammar & sentence building › Past & future (lesson "past-future")
    iAteRice: {
      words: [
        ["నేను", "nenu"],
        ["అన్నం", "annam"],
        ["తిన్నాను", "tinnaanu"],
      ],
      blank: 2,
      notes: "Past: తిన్నాను (tinnaanu, I ate). Compare తింటాను (I eat / will eat).",
    },
    iWillEatRice: {
      words: [
        ["నేను", "nenu"],
        ["తర్వాత", "tarvaata"],
        ["అన్నం", "annam"],
        ["తింటాను", "tintaanu"],
      ],
      meaning: "I will eat rice later.",
      accept: ["i will eat rice", "i'll eat rice later"],
      blank: 3,
      notes:
        "Telugu uses the same verb form for habits and the future (తింటాను = I eat / I will eat); a time word like తర్వాత (tarvaata, later) or రేపు (tomorrow) makes the future clear.",
    },
    iWentToTheMarketYesterday: {
      words: [
        ["నేను", "nenu"],
        ["నిన్న", "ninna"],
        ["బజారుకు", "bajaaruku"],
        ["వెళ్ళాను", "vellaanu"],
      ],
      blank: 3,
      notes: "Past: వెళ్ళాను (vellaanu, I went). Time word first, then the place, then the verb.",
    },
    iWillGoTomorrow: {
      words: [
        ["నేను", "nenu"],
        ["రేపు", "repu"],
        ["వెళ్తాను", "veltaanu"],
      ],
      blank: 2,
      notes: "Future/habitual: వెళ్తాను (veltaanu). Casual: రేపు వెళ్తా.",
    },
    sheCameYesterday: {
      words: [
        ["ఆమె", "aame"],
        ["నిన్న", "ninna"],
        ["వచ్చింది", "vachchindi"],
      ],
      blank: 2,
      notes:
        "-ఇంది (-indi) = past for she/it. He came = అతను వచ్చాడు (vachchaadu); respectful: ఆవిడ వచ్చారు (vachchaaru).",
    },
    weWillComeTomorrow: {
      words: [
        ["మేము", "memu"],
        ["రేపు", "repu"],
        ["వస్తాము", "vastaamu"],
      ],
      blank: 2,
      notes: "In speech: మేము రేపు వస్తాం (vastaam).",
    },
    // Grammar & sentence building › Questions & negatives (lesson "questions-negatives")
    why: {
      script: "ఎందుకు",
      roman: "enduku",
      notes: "Comes before the verb: ఎందుకు వచ్చారు? (why did you come?).",
    },
    how: { script: "ఎలా", roman: "elaa" },
    which: {
      script: "ఏది",
      roman: "edi",
      notes: '"Which one?" alone. Before a noun use ఏ (e): ఏ బస్సు? (which bus?).',
    },
    doYouEatMeat: {
      words: [
        ["మీరు", "meeru"],
        ["మాంసం", "maamsam"],
        ["తింటారా?", "tintaaraa?"],
      ],
      blank: 1,
      notes:
        'Yes/no question: add -ఆ (-aa) to the verb: తింటారు → తింటారా?. Casual: నువ్వు మాంసం తింటావా?. People also ask "veg-aa, non-veg-aa?".',
    },
    iDontKnow: {
      words: [
        ["నాకు", "naaku"],
        ["తెలియదు", "teliyadu"],
      ],
      notes:
        'Literally "to me it is not known". In speech: నాకు తెలీదు (naaku teleedu). "I know" = నాకు తెలుసు (naaku telusu).',
    },
    isThisYourBook: {
      words: [
        ["ఇది", "idi"],
        ["మీ", "mee"],
        ["పుస్తకమా?", "pustakamaa?"],
      ],
      blank: 2,
      notes:
        "-ఆ added to the noun makes the question: పుస్తకం → పుస్తకమా?. Casual: ఇది నీ పుస్తకమా?",
    },
    thisIsNotMyBook: {
      words: [
        ["ఇది", "idi"],
        ["నా", "naa"],
        ["పుస్తకం", "pustakam"],
        ["కాదు", "kaadu"],
      ],
      blank: 3,
      notes:
        'కాదు (kaadu) denies identity ("is not"). To say something doesn\'t exist use లేదు (ledu): పుస్తకం లేదు (there is no book).',
    },
    whyAreYouLate: {
      words: [
        ["మీరు", "meeru"],
        ["ఎందుకు", "enduku"],
        ["ఆలస్యంగా", "aalasyangaa"],
        ["వచ్చారు?", "vachchaaru?"],
      ],
      blank: 1,
      notes:
        'Literally "why did you come late?". Casual: ఎందుకు లేట్ అయింది? (enduku let ayindi?).',
    },
    howDoYouGoToCollege: {
      words: [
        ["మీరు", "meeru"],
        ["కాలేజీకి", "kaalejeeki"],
        ["ఎలా", "elaa"],
        ["వెళ్తారు?", "veltaaru?"],
      ],
      blank: 2,
      notes: 'Answer: బస్సులో వెళ్తాను (I go by bus — literally "in the bus").',
    },
    // Grammar & sentence building › My, your & small words (lesson "possession")
    inPostposition: {
      script: "-లో",
      roman: "-lo",
      notes:
        "Added to the end of a noun: ఇల్లు → ఇంట్లో (intlo, in the house), బ్యాగ్‌లో (in the bag), హైదరాబాదులో (in Hyderabad).",
    },
    onPostposition: {
      script: "మీద",
      roman: "meeda",
      notes: "Comes after the noun: టేబుల్ మీద (on the table). Also పైన (paina, above/on top).",
    },
    withPostposition: {
      script: "-తో",
      roman: "-to",
      notes:
        'Added to a noun: అమ్మతో (ammato, with mother), స్నేహితుడితో (with a friend). It also means "by means of": పెన్నుతో రాయండి (write with a pen).',
    },
    fromPostposition: {
      script: "నుండి",
      roman: "nundi",
      notes:
        "Comes after the noun: ఇంటి నుండి (from home), హైదరాబాదు నుండి (from Hyderabad). In speech also నుంచి (nunchi).",
    },
    table: {
      script: "టేబుల్",
      roman: "tebul",
      notes: "English word used in homes and offices. Native: బల్ల (balla).",
    },
    thisIsMyBook: {
      words: [
        ["ఇది", "idi"],
        ["నా", "naa"],
        ["పుస్తకం", "pustakam"],
      ],
      blank: 1,
      notes: 'Possessive words come before the noun. "This is mine" = ఇది నాది (idi naadi).',
    },
    hisNameIsRavi: {
      words: [
        ["అతని", "atani"],
        ["పేరు", "peru"],
        ["రవి", "Ravi"],
      ],
      blank: 0,
      notes:
        "అతని (atani) = his. Her name: ఆమె పేరు (aame peru). Respectful: ఆయన పేరు (aayana peru).",
    },
    theBookIsOnTheTable: {
      words: [
        ["పుస్తకం", "pustakam"],
        ["టేబుల్", "tebul"],
        ["మీద", "meeda"],
        ["ఉంది", "undi"],
      ],
      blank: 2,
      notes: 'Literally "book table on is". ఉంది (undi) = is (located).',
    },
    iGoWithMyFriend: {
      words: [
        ["నేను", "nenu"],
        ["నా", "naa"],
        ["స్నేహితుడితో", "snehitudito"],
        ["వెళ్తాను", "veltaanu"],
      ],
      blank: 2,
      notes: "స్నేహితుడు + -తో → స్నేహితుడితో (with a friend). Everyday: నా ఫ్రెండ్‌తో వెళ్తాను.",
    },
    sheIsComingFromHome: {
      words: [
        ["ఆమె", "aame"],
        ["ఇంటి", "inti"],
        ["నుండి", "nundi"],
        ["వస్తోంది", "vastondi"],
      ],
      blank: 2,
      notes:
        "ఇల్లు becomes ఇంటి before నుండి. వస్తోంది (vastondi) = she is coming (formal written form: వస్తున్నది). Don't confuse it with వస్తుంది (vastundi) = she comes / will come.",
    },
    // Grammar & sentence building › Polite & casual (lesson "polite-casual")
    comeCasual: {
      words: [["రా!", "raa!"]],
      notes: "Casual command, only for friends, younger people or children. Polite: రండి (randi).",
    },
    comePolite: {
      words: [["రండి", "randi"]],
      notes:
        "Polite/plural command (-ండి). Welcoming a guest you repeat it: రండి, రండి! Casual: రా.",
    },
    sitCasual: {
      words: [["కూర్చో!", "koorcho!"]],
      notes: "Casual. Polite: కూర్చోండి (koorchondi).",
    },
    sitPolite: {
      words: [["కూర్చోండి", "koorchondi"]],
      notes: "Polite (-ండి). To a guest, often with దయచేసి or repeated: కూర్చోండి, కూర్చోండి.",
    },
    eatPolite: {
      words: [
        ["భోజనం", "bhojanam"],
        ["చేయండి", "cheyandi"],
      ],
      notes:
        "What a host says to a guest; hosts insist several times. Also తినండి (tinandi, please eat). Casual: తిను (tinu).",
    },
    howAreYouCasual: {
      words: [
        ["ఎలా", "elaa"],
        ["ఉన్నావు?", "unnaavu?"],
      ],
      notes:
        "Casual (నువ్వు form, -ఆవు ending). Also బాగున్నావా? (baagunnaavaa?). Polite: ఎలా ఉన్నారు?",
    },
    // Feelings, health & relationships › How do you feel? (lesson "feelings")
    happy: {
      script: "సంతోషం",
      roman: "santosham",
      notes: 'Literally "happiness". "Happily" = సంతోషంగా (santoshangaa).',
    },
    sad: {
      script: "బాధ",
      roman: "baadha",
      notes: 'Literally "sorrow / pain". బాధపడకండి (don\'t be sad).',
    },
    angry: {
      script: "కోపం",
      roman: "kopam",
      notes: 'Literally "anger". నా మీద కోపమా? (are you angry with me?).',
    },
    tired: {
      script: "అలసట",
      roman: "alasata",
      notes: 'Literally "tiredness". "I\'m tired" uses the verb: అలసిపోయాను.',
    },
    scared: {
      script: "భయం",
      roman: "bhayam",
      notes: 'Literally "fear". "Don\'t be afraid" = భయపడకండి (bhayapadakandi).',
    },
    worried: {
      script: "ఆందోళన",
      roman: "aandolana",
      notes:
        'Formal "anxiety". Everyday: కంగారు (kangaaru, flustered/worried) or English టెన్షన్ (tenshan).',
    },
    iAmHappy: {
      words: [
        ["నేను", "nenu"],
        ["సంతోషంగా", "santoshangaa"],
        ["ఉన్నాను", "unnaanu"],
      ],
      blank: 1,
      notes:
        "Also with the dative: నాకు చాలా సంతోషంగా ఉంది (naaku chaalaa santoshangaa undi, I feel very happy).",
    },
    iAmSad: {
      words: [
        ["నాకు", "naaku"],
        ["బాధగా", "baadhagaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes: 'Dative construction: "to me it is sad". Feelings usually take నాకు …గా ఉంది.',
    },
    iAmTired: {
      words: [
        ["నేను", "nenu"],
        ["అలసిపోయాను", "alasipoyaanu"],
      ],
      notes:
        'Literally "I have become tired" (past form). Casual: అలసిపోయా or చాలా టైర్డ్ గా ఉంది.',
    },
    // Feelings, health & relationships › I'm okay, don't worry (lesson "feelings-2")
    iAmAngry: {
      words: [
        ["నాకు", "naaku"],
        ["కోపంగా", "kopangaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes: 'Literally "to me it is angry". నాకు కోపం వచ్చింది (anger came to me) = I got angry.',
    },
    iAmOkay: {
      words: [
        ["నేను", "nenu"],
        ["బాగానే", "baagaane"],
        ["ఉన్నాను", "unnaanu"],
      ],
      blank: 1,
      notes: 'బాగానే = "well enough" — the -ఏ softens it to "I\'m okay". Casual: బాగానే ఉన్నా.',
    },
    iAmNotFeelingWell: {
      words: [
        ["నాకు", "naaku"],
        ["ఒంట్లో", "ontlo"],
        ["బాగాలేదు", "baagaaledu"],
      ],
      blank: 1,
      notes:
        'Literally "to me, in the body, it is not well". ఒంట్లో (ontlo) = in the body. Also: ఒంట్లో నలతగా ఉంది.',
    },
    dontWorry: {
      words: [
        ["కంగారు", "kangaaru"],
        ["పడకండి", "padakandi"],
      ],
      notes:
        "Polite. Casual: కంగారు పడకు (kangaaru padaku). Also common: టెన్షన్ పడకండి, and బాధపడకండి (don't be sad).",
    },
    iAmScared: {
      words: [
        ["నాకు", "naaku"],
        ["భయంగా", "bhayangaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes:
        "Dative construction like నాకు ఆకలిగా ఉంది. Also: నాకు భయం వేస్తోంది (naaku bhayam vestondi).",
    },
    // Feelings, health & relationships › The body (lesson "body")
    head: { script: "తల", roman: "tala", notes: "Headache = తలనొప్పి (talanoppi)." },
    hand: { script: "చెయ్యి", roman: "cheyyi", notes: "Also means arm. Plural: చేతులు (chetulu)." },
    leg: { script: "కాలు", roman: "kaalu", notes: "Also means foot. Plural: కాళ్ళు (kaallu)." },
    eye: { script: "కన్ను", roman: "kannu", notes: "Plural: కళ్ళు (kallu)." },
    ear: { script: "చెవి", roman: "chevi", notes: "Plural: చెవులు (chevulu)." },
    mouth: { script: "నోరు", roman: "noru" },
    stomach: {
      script: "కడుపు",
      roman: "kadupu",
      notes: '"I\'m full" = కడుపు నిండింది (kadupu nindindi).',
    },
    tooth: {
      script: "పన్ను",
      roman: "pannu",
      notes: "Plural: పళ్ళు (pallu). (పన్ను also means tax.)",
    },
    // Feelings, health & relationships › At the doctor (lesson "health")
    fever: { script: "జ్వరం", roman: "jvaram" },
    medicine: {
      script: "మందు",
      roman: "mandu",
      notes: 'Plural: మందులు (mandulu). A tablet is మాత్ర (maatra) or "tablet".',
    },
    iHaveAFever: {
      words: [
        ["నాకు", "naaku"],
        ["జ్వరం", "jvaram"],
        ["వచ్చింది", "vachchindi"],
      ],
      blank: 1,
      notes: 'Literally "to me fever has come". Also: నాకు జ్వరంగా ఉంది (I feel feverish).',
    },
    iHaveAHeadache: {
      words: [
        ["నాకు", "naaku"],
        ["తలనొప్పిగా", "talanoppigaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes: "తల (head) + నొప్పి (pain). Also: నాకు తలనొప్పి వచ్చింది.",
    },
    myStomachHurts: {
      words: [
        ["నాకు", "naaku"],
        ["కడుపు", "kadupu"],
        ["నొప్పిగా", "noppigaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes: 'Literally "to me stomach is painful". నొప్పి (noppi) = pain.',
    },
    iNeedADoctor: {
      words: [
        ["నాకు", "naaku"],
        ["డాక్టర్", "daaktar"],
        ["కావాలి", "kaavaali"],
      ],
      blank: 1,
      notes: "Or: నేను డాక్టర్‌ని చూడాలి (nenu daaktarni choodaali, I need to see a doctor).",
    },
    callADoctor: {
      words: [
        ["డాక్టర్‌ని", "daaktarni"],
        ["పిలవండి", "pilavandi"],
      ],
      blank: 0,
      notes:
        "-ని (-ni) marks the object (the person called). పిలవండి = please call (summon). By phone: డాక్టర్‌కి ఫోన్ చేయండి.",
    },
    takeThisMedicine: {
      words: [
        ["ఈ", "ee"],
        ["మందు", "mandu"],
        ["వేసుకోండి", "vesukondi"],
      ],
      blank: 1,
      notes: 'Tablets are "put on" (వేసుకోవడం) in Telugu, not "taken". Casual: ఈ మందు వేసుకో.',
    },
    // Feelings, health & relationships › Love & friendship (lesson "love-friendship")
    iLoveYou: {
      words: [
        ["నేను", "nenu"],
        ["నిన్ను", "ninnu"],
        ["ప్రేమిస్తున్నాను", "premistunnaanu"],
      ],
      blank: 2,
      notes:
        'Romantic and quite strong — it sounds like a film dialogue. Couples often say "I love you" in English or నువ్వంటే నాకు చాలా ఇష్టం (nuvvante naaku chaalaa ishtam, "I like you very much"). It uses నిన్ను (casual "you") because it is intimate; it is not said to parents or friends.',
    },
    iLikeYou: {
      words: [
        ["నువ్వంటే", "nuvvante"],
        ["నాకు", "naaku"],
        ["ఇష్టం", "ishtam"],
      ],
      blank: 2,
      notes:
        'Literally "as for you, to me (there is) liking". It can sound romantic. Polite/respectful: మీరంటే నాకు ఇష్టం (meerante naaku ishtam). For a friendly "I like you (as a person)" people say నువ్వు చాలా మంచివాడివి/మంచిదానివి (you\'re a very nice person).',
    },
    iMissYou: {
      words: [
        ["నువ్వు", "nuvvu"],
        ["గుర్తొస్తున్నావు", "gurtostunnaavu"],
      ],
      blank: 1,
      notes:
        'Literally "you are coming to (my) mind" — the natural, gentle Telugu way. Polite: మీరు గుర్తొస్తున్నారు. Young people also say నిన్ను మిస్ అవుతున్నా (ninnu mis avutunnaa) or just "miss you".',
    },
    iLoveMyFamily: {
      words: [
        ["నాకు", "naaku"],
        ["మా", "maa"],
        ["కుటుంబం", "kutumbam"],
        ["అంటే", "ante"],
        ["చాలా", "chaalaa"],
        ["ఇష్టం", "ishtam"],
      ],
      blank: 2,
      notes:
        'Literally "to me, my family is very dear". Telugu uses ఇష్టం (liking) for family love; ప్రేమిస్తున్నాను would sound odd here. People rarely say it aloud — love is shown, not stated.',
    },
    youAreMyFriend: {
      words: [
        ["నువ్వు", "nuvvu"],
        ["నా", "naa"],
        ["స్నేహితుడివి", "snehitudivi"],
      ],
      blank: 2,
      notes:
        "To a man. To a woman: నువ్వు నా స్నేహితురాలివి (snehituraalivi). Polite: మీరు నా స్నేహితులు. Very commonly: నువ్వు నా ఫ్రెండ్‌వి.",
    },
    youAreMyBestFriend: {
      words: [
        ["నువ్వు", "nuvvu"],
        ["నా", "naa"],
        ["ప్రాణ", "praana"],
        ["స్నేహితుడివి", "snehitudivi"],
      ],
      blank: 2,
      notes:
        'ప్రాణ స్నేహితుడు (praana snehitudu) = "life-friend", a dear, closest friend (to a woman: ప్రాణ స్నేహితురాలివి). Young people mostly say నువ్వు నా బెస్ట్ ఫ్రెండ్‌వి.',
    },
    iLikeThis: {
      words: [
        ["ఇది", "idi"],
        ["నాకు", "naaku"],
        ["నచ్చింది", "nachchindi"],
      ],
      blank: 2,
      notes:
        'Literally "this pleased me" — used for something you see, taste or try now. For lasting likes use ఇష్టం: నాకు ఇది ఇష్టం.',
    },
    iDontLikeThis: {
      words: [
        ["ఇది", "idi"],
        ["నాకు", "naaku"],
        ["నచ్చలేదు", "nachchaledu"],
      ],
      blank: 2,
      notes: 'Literally "this did not please me". For a general dislike: నాకు ఇది ఇష్టం లేదు.',
    },
    takeCare: {
      words: [
        ["జాగ్రత్తగా", "jaagrattagaa"],
        ["ఉండండి", "undandi"],
      ],
      blank: 0,
      notes:
        'Literally "stay carefully". Casual: జాగ్రత్త (jaagratta) or జాగ్రత్తగా ఉండు. Parents say it to anyone leaving on a journey.',
    },
    // Practical communication › Weather (lesson "weather")
    weather: {
      script: "వాతావరణం",
      roman: "vaataavaranam",
      notes:
        "Formal; in speech people talk about ఎండ (sun/heat), వర్షం (rain) and చలి (cold) directly.",
    },
    hot: {
      script: "వేడి",
      roman: "vedi",
      notes: "Hot (temperature, food). Hot sunny weather is ఎండ (enda): చాలా ఎండగా ఉంది.",
    },
    cold: {
      script: "చలి",
      roman: "chali",
      notes: "Cold weather (chill). Cold things (water, drinks) are చల్లని (challani) / చల్లగా.",
    },
    rain: { script: "వర్షం", roman: "varsham", notes: "Also వాన (vaana), more colloquial." },
    sun: {
      script: "ఎండ",
      roman: "enda",
      notes: "Sunshine / the heat of the sun. The sun itself (in the sky) is సూర్యుడు (sooryudu).",
    },
    wind: {
      script: "గాలి",
      roman: "gaali",
      notes: "Also means air. Strong wind = గాలి బాగా వీస్తోంది (the wind is blowing hard).",
    },
    itIsHotToday: {
      words: [
        ["ఈరోజు", "eeroju"],
        ["వేడిగా", "vedigaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes:
        "Also ఈరోజు చాలా ఎండగా ఉంది (it's very sunny/hot today) — very common in Telangana and Andhra summers.",
    },
    itIsRaining: {
      words: [
        ["వర్షం", "varsham"],
        ["పడుతోంది", "padutondi"],
      ],
      blank: 0,
      notes: 'Literally "rain is falling". Also వాన పడుతోంది (vaana padutondi).',
    },
    itIsColdToday: {
      words: [
        ["ఈరోజు", "eeroju"],
        ["చలిగా", "chaligaa"],
        ["ఉంది", "undi"],
      ],
      blank: 1,
      notes: "Also చలి వేస్తోంది (chali vestondi, I'm feeling cold).",
    },
    // Practical communication › College & work (lesson "college-work")
    classroom: {
      script: "క్లాసు",
      roman: "klaasu",
      notes: "Formal: తరగతి (taragati, class/grade); a classroom is తరగతి గది.",
    },
    exam: { script: "పరీక్ష", roman: "pareeksha", notes: "Students also say ఎగ్జామ్ (egzaam)." },
    homework: {
      script: "హోంవర్క్",
      roman: "homvark",
      notes: "The English word is used in schools; literal native: ఇంటి పని (inti pani).",
    },
    job: {
      script: "ఉద్యోగం",
      roman: "udyogam",
      notes: "Also జాబ్ (jaab). An employee is ఉద్యోగి (udyogi).",
    },
    holiday: {
      script: "సెలవు",
      roman: "selavu",
      notes: "Holiday/day off; leave from work is also సెలవు or లీవ్ (leev).",
    },
    iHaveAnExamTomorrow: {
      words: [
        ["నాకు", "naaku"],
        ["రేపు", "repu"],
        ["పరీక్ష", "pareeksha"],
        ["ఉంది", "undi"],
      ],
      blank: 2,
      notes: 'Literally "to me tomorrow an exam is there" — the నాకు … ఉంది pattern for "I have".',
    },
    todayIsAHoliday: {
      words: [
        ["ఈరోజు", "eeroju"],
        ["సెలవు", "selavu"],
      ],
      blank: 1,
      notes: "Also ఈరోజు సెలవు రోజు (today is a holiday day).",
    },
    iWorkInAnOffice: {
      words: [
        ["నేను", "nenu"],
        ["ఒక", "oka"],
        ["ఆఫీసులో", "aapheesulo"],
        ["పని", "pani"],
        ["చేస్తాను", "chestaanu"],
      ],
      blank: 2,
      notes: 'Literally "I in an office work do". ఆఫీసులో = in an office.',
    },
    // Practical communication › Hobbies & likes (lesson "hobbies")
    music: {
      script: "సంగీతం",
      roman: "sangeetam",
      notes: "Also మ్యూజిక్ (myoozik). Carnatic music is popular; Thyagaraja composed in Telugu.",
    },
    movie: {
      script: "సినిమా",
      roman: "sinimaa",
      notes: 'Telugu cinema ("Tollywood") is one of India\'s biggest film industries.',
    },
    song: {
      script: "పాట",
      roman: "paata",
      notes: "Plural: పాటలు (paatalu). To sing = పాడడం (paadadam).",
    },
    cricket: { script: "క్రికెట్", roman: "kriket" },
    dance: {
      script: "డాన్స్",
      roman: "daans",
      notes:
        "Everyday word. Formal: నృత్యం (nrityam) or నాట్యం (naatyam), e.g. Kuchipudi, the classical dance of Andhra.",
    },
    iLikeMusic: {
      words: [
        ["నాకు", "naaku"],
        ["సంగీతం", "sangeetam"],
        ["అంటే", "ante"],
        ["ఇష్టం", "ishtam"],
      ],
      blank: 1,
      notes:
        'Pattern: నాకు X అంటే ఇష్టం ("to me, as for X, (there is) liking"). Shorter: నాకు సంగీతం ఇష్టం.',
    },
    doYouLikeCricket: {
      words: [
        ["మీకు", "meeku"],
        ["క్రికెట్", "kriket"],
        ["అంటే", "ante"],
        ["ఇష్టమా?", "ishtamaa?"],
      ],
      blank: 1,
      notes: "ఇష్టం + -ఆ = question. Casual: నీకు క్రికెట్ ఇష్టమా?",
    },
    iLikeWatchingMovies: {
      words: [
        ["నాకు", "naaku"],
        ["సినిమాలు", "sinimaalu"],
        ["చూడడం", "choodadam"],
        ["ఇష్టం", "ishtam"],
      ],
      blank: 1,
      notes: "The -డం verbal noun (చూడడం = watching) works like an English -ing word.",
    },
    whatIsYourHobby: {
      words: [
        ["మీ", "mee"],
        ["హాబీ", "haabee"],
        ["ఏమిటి?", "emiti?"],
      ],
      blank: 1,
      notes: 'People use the English word "hobby". The formal Telugu word is అభిరుచి (abhiruchi).',
    },
    // Practical communication › Plans & invitations (lesson "plans")
    letsGo: {
      words: [["వెళ్దాం", "veldaam"]],
      notes:
        'The -దాం (-daam) ending = "let\'s". Very common alternatives: పదండి (padandi, polite) and పద (pada, casual) = "come on, let\'s go".',
    },
    comeToMyHouse: {
      words: [
        ["మా", "maa"],
        ["ఇంటికి", "intiki"],
        ["రండి", "randi"],
      ],
      blank: 1,
      notes:
        'Literally "come to our house" — Telugu says మా ఇల్లు for my home. Casual: మా ఇంటికి రా.',
    },
    areYouFreeTomorrow: {
      words: [
        ["మీరు", "meeru"],
        ["రేపు", "repu"],
        ["ఖాళీగా", "khaaleegaa"],
        ["ఉన్నారా?", "unnaaraa?"],
      ],
      blank: 2,
      notes:
        "ఖాళీగా (khaaleegaa) = free/empty. People also say ఫ్రీగా ఉన్నారా? (freegaa unnaaraa?). Casual: రేపు ఖాళీగా ఉన్నావా?",
    },
    yesIWillCome: {
      words: [
        ["అలాగే,", "alaage,"],
        ["వస్తాను", "vastaanu"],
      ],
      blank: 1,
      notes:
        'అలాగే (alaage, "sure / alright") is the natural "yes" to an invitation. Stronger: తప్పకుండా వస్తాను (I\'ll come for sure).',
    },
    sorryICantCome: {
      words: [
        ["క్షమించండి,", "kshaminchandi,"],
        ["నేను", "nenu"],
        ["రాలేను", "raalenu"],
      ],
      blank: 2,
      notes:
        "రాలేను (raalenu) = I cannot come. In everyday speech: సారీ, రాలేను. Telugu speakers usually add a reason to soften it.",
    },
    seeYouTomorrow: {
      words: [
        ["రేపు", "repu"],
        ["కలుద్దాం", "kaluddaam"],
      ],
      blank: 0,
      notes: 'Literally "let\'s meet tomorrow".',
    },
    // Practical communication › Requests & help (lesson "requests-help")
    canYouHelpMe: {
      words: [
        ["మీరు", "meeru"],
        ["నాకు", "naaku"],
        ["సహాయం", "sahaayam"],
        ["చేయగలరా?", "cheyagalaraa?"],
      ],
      blank: 2,
      notes:
        '-గలరా = "can you?". Softer and very common: కొంచెం సహాయం చేస్తారా? or కొంచెం హెల్ప్ చేస్తారా?',
    },
    iNeedHelp: {
      words: [
        ["నాకు", "naaku"],
        ["సహాయం", "sahaayam"],
        ["కావాలి", "kaavaali"],
      ],
      blank: 1,
      notes: "Same pattern as నాకు నీళ్ళు కావాలి. In speech also సాయం (saayam) and హెల్ప్.",
    },
    pleaseHelpMe: {
      words: [
        ["దయచేసి", "dayachesi"],
        ["నాకు", "naaku"],
        ["సహాయం", "sahaayam"],
        ["చేయండి", "cheyandi"],
      ],
      blank: 2,
      notes: "Polite and earnest. Casual: నాకు సాయం చెయ్యి.",
    },
    pleaseWait: {
      words: [
        ["కొంచెం", "konchem"],
        ["ఆగండి", "aagandi"],
      ],
      notes: 'Literally "stop a little". Also కాసేపు ఆగండి (wait a while). Casual: ఆగు (aagu).',
    },
    pleaseTellMe: {
      words: [["చెప్పండి", "cheppandi"]],
      notes:
        'Very common: also the way shopkeepers and people on the phone say "yes, go ahead / how can I help?". Casual: చెప్పు (cheppu).',
    },
    pleaseShowMe: {
      words: [
        ["నాకు", "naaku"],
        ["చూపించండి", "choopinchandi"],
      ],
      notes: "Casual: నాకు చూపించు.",
    },
    callMe: {
      words: [
        ["నాకు", "naaku"],
        ["ఫోన్", "phon"],
        ["చేయండి", "cheyandi"],
      ],
      blank: 1,
      notes: 'Literally "do a phone to me". Casual: నాకు ఫోన్ చెయ్యి.',
    },
    help: {
      words: [["కాపాడండి!", "kaapaadandi!"]],
      notes:
        'Literally "save (me)!" — shouted in an emergency. Addressed to one person casually: కాపాడు! (kaapaadu!).',
    },
    itsOkay: {
      words: [["పర్వాలేదు", "parvaaledu"]],
      notes:
        '"It\'s fine / never mind / no matter" — very common. Also spelled ఫరవాలేదు (pharavaaledu); colloquially పర్లేదు (parledu).',
    },
  },

  extras: [
    // greetings
    {
      key: "velli-randi",
      lesson: "greetings",
      topic: "Greetings",
      meaning: "Go and come back (reply to goodbye)",
      words: [
        ["వెళ్ళి", "velli"],
        ["రండి", "randi"],
      ],
      notes:
        "The host's reply to వెళ్ళొస్తాను — it wishes the guest a safe return. Casual: వెళ్ళి రా.",
    },
    {
      key: "baagunnaaraa",
      lesson: "how-are-you",
      topic: "Introductions",
      meaning: "Are you well?",
      words: [["బాగున్నారా?", "baagunnaaraa?"]],
      notes:
        "The most common short greeting between acquaintances. Casual: బాగున్నావా? Answer: బాగున్నాను.",
    },
    // polite words
    {
      key: "andi",
      lesson: "polite-words",
      topic: "Polite words",
      meaning: "Polite particle (sir / madam)",
      script: "అండి",
      roman: "andi",
      notes:
        "Added to words or used alone to sound respectful: అవునండి (yes), సరేనండి (okay), ఏమండీ (excuse me).",
    },
    {
      key: "vaddu",
      lesson: "polite-words",
      topic: "Polite words",
      meaning: "Don't want / No thanks",
      script: "వద్దు",
      roman: "vaddu",
      notes:
        "Refusing something offered: టీ వద్దు (no tea, thanks). Polite: వద్దండి (vaddandi). Also \"don't\": వెళ్ళొద్దు (don't go).",
    },
    {
      key: "ledu",
      lesson: "polite-words",
      topic: "Polite words",
      meaning: "No / there isn't",
      script: "లేదు",
      roman: "ledu",
      notes:
        "Says something is absent or didn't happen: డబ్బు లేదు (there is no money). Compare కాదు (it is not).",
    },
    // things
    {
      key: "taalam",
      lesson: "things",
      topic: "Everyday things",
      meaning: "Lock",
      script: "తాళం",
      roman: "taalam",
      notes: "A key is తాళం చెవి (taalam chevi). To lock = తాళం వేయడం.",
    },
    {
      key: "godugu",
      lesson: "things",
      topic: "Everyday things",
      meaning: "Umbrella",
      script: "గొడుగు",
      roman: "godugu",
      notes: "Used for both rain and the strong sun.",
    },
    // actions
    {
      key: "cheppadam",
      lesson: "actions",
      topic: "Actions",
      meaning: "To tell / to say",
      script: "చెప్పడం",
      roman: "cheppadam",
      notes: 'Polite command: చెప్పండి (cheppandi). "I\'ll tell" = చెప్తాను (cheptaanu).',
    },
    {
      key: "kaavaali",
      lesson: "actions",
      topic: "Actions",
      meaning: "Want / need (is needed)",
      script: "కావాలి",
      roman: "kaavaali",
      notes:
        "Used with the dative: నాకు X కావాలి (I want X). Question: కావాలా? (do you want?). Opposite: వద్దు.",
    },
    // this & that
    {
      key: "ee",
      lesson: "this-and-that",
      topic: "Questions",
      meaning: "This (before a noun)",
      script: "ఈ",
      roman: "ee",
      notes: 'ఈ పుస్తకం (this book), ఈ ఊరు (this town). Standing alone, "this" is ఇది.',
    },
    {
      key: "aa",
      lesson: "this-and-that",
      topic: "Questions",
      meaning: "That (before a noun)",
      script: "ఆ",
      roman: "aa",
      notes:
        'ఆ ఇల్లు (that house). Standing alone, "that" is అది. (ఆ on its own in conversation also means "yeah".)',
    },
    {
      key: "ivi-avi",
      lesson: "this-and-that",
      topic: "Questions",
      meaning: "These, those",
      words: [
        ["ఇవి,", "ivi,"],
        ["అవి", "avi"],
      ],
      notes: "Plurals of ఇది and అది: ఇవి ఏమిటి? (what are these?).",
    },
    // my name
    {
      key: "gaaru",
      lesson: "my-name",
      topic: "Introductions",
      meaning: "Respectful suffix (Mr / Ms)",
      script: "గారు",
      roman: "gaaru",
      notes:
        "Added after names and titles to show respect: రవి గారు (Mr Ravi), నాన్నగారు (father, respectfully), డాక్టర్ గారు.",
    },
    // where from
    {
      key: "ooru",
      lesson: "where-from",
      topic: "Introductions",
      meaning: "Town / village / hometown",
      script: "ఊరు",
      roman: "ooru",
      notes:
        "The everyday word for any place people live, especially one's hometown: మా ఊరు (my hometown). మీది ఏ ఊరు? = where are you from?",
    },
    {
      key: "telangana",
      lesson: "where-from",
      topic: "Introductions",
      meaning: "Telangana",
      script: "తెలంగాణ",
      roman: "telangaana",
      notes: "State whose capital is Hyderabad. Telugu is its main language.",
    },
    {
      key: "andhra-pradesh",
      lesson: "where-from",
      topic: "Introductions",
      meaning: "Andhra Pradesh",
      script: "ఆంధ్రప్రదేశ్",
      roman: "aandhrapradesh",
      notes:
        "The other Telugu state, with cities like Vijayawada, Visakhapatnam (Vizag) and Tirupati; capital Amaravati. People often say ఆంధ్ర (aandhra).",
    },
    {
      key: "telugu",
      lesson: "where-from",
      topic: "Introductions",
      meaning: "Telugu (the language)",
      script: "తెలుగు",
      roman: "telugu",
      notes: '"In Telugu" = తెలుగులో. A Telugu person is తెలుగువాడు / తెలుగువారు.',
    },
    // understanding
    {
      key: "ante",
      lesson: "understanding",
      topic: "Understanding",
      meaning: "Meaning? / You mean?",
      words: [["అంటే?", "ante?"]],
      notes: 'A quick way to ask someone to explain. As a word, అంటే also means "that is / i.e.".',
    },
    {
      key: "naaku-telusu",
      lesson: "understanding",
      topic: "Understanding",
      meaning: "I know.",
      words: [
        ["నాకు", "naaku"],
        ["తెలుసు", "telusu"],
      ],
      notes: 'Dative construction: "to me it is known". Opposite: నాకు తెలియదు (I don\'t know).',
    },
    // family
    {
      key: "pillalu",
      lesson: "parents-children",
      topic: "Family",
      meaning: "Children",
      script: "పిల్లలు",
      roman: "pillalu",
      notes: 'Also "kids" in general: మీకు ఎంతమంది పిల్లలు? (how many children do you have?).',
    },
    {
      key: "annayya",
      lesson: "siblings",
      topic: "Family",
      meaning: "Elder brother (when addressing him)",
      script: "అన్నయ్య",
      roman: "annayya",
      notes:
        "The affectionate/respectful form of అన్న, used to call him. Also used for older male friends.",
    },
    {
      key: "vadina",
      lesson: "siblings",
      topic: "Family",
      meaning: "Sister-in-law (elder brother's wife)",
      script: "వదిన",
      roman: "vadina",
      notes:
        "Also used for a wife's elder sister, an elder female cross-cousin (e.g. your మామయ్య's daughter) and, affectionately, for a friend's wife.",
    },
    {
      key: "baava",
      lesson: "siblings",
      topic: "Family",
      meaning: "Brother-in-law (sister's husband)",
      script: "బావ",
      roman: "baava",
      notes:
        "Also used for a husband, a wife's elder brother and a male cross-cousin (son of your అత్తయ్య or మామయ్య), and jokingly between close male friends.",
    },
    {
      key: "baabaay",
      lesson: "grandparents",
      topic: "Family",
      meaning: "Uncle (father's younger brother)",
      script: "బాబాయ్",
      roman: "baabaay",
      notes: "His wife is పిన్ని (pinni). Father's elder brother is పెదనాన్న (pedanaanna).",
    },
    {
      key: "pedanaanna",
      lesson: "grandparents",
      topic: "Family",
      meaning: "Uncle (father's elder brother)",
      script: "పెదనాన్న",
      roman: "pedanaanna",
      notes: 'Literally "big father". His wife is పెద్దమ్మ (peddamma).',
    },
    {
      key: "pinni",
      lesson: "grandparents",
      topic: "Family",
      meaning: "Aunt (mother's younger sister)",
      script: "పిన్ని",
      roman: "pinni",
      notes: "Also the wife of బాబాయ్ (father's younger brother).",
    },
    {
      key: "peddamma",
      lesson: "grandparents",
      topic: "Family",
      meaning: "Aunt (mother's elder sister)",
      script: "పెద్దమ్మ",
      roman: "peddamma",
      notes: 'Literally "big mother". Also the wife of పెదనాన్న.',
    },
    // people
    {
      key: "snehituraalu",
      lesson: "people",
      topic: "People",
      meaning: "Friend (female)",
      script: "స్నేహితురాలు",
      roman: "snehituraalu",
      notes: "The female form of స్నేహితుడు. Plural for a mixed group: స్నేహితులు (snehitulu).",
    },
    {
      key: "andaroo",
      lesson: "people",
      topic: "People",
      meaning: "Everyone",
      script: "అందరూ",
      roman: "andaroo",
      notes: "అందరికీ నమస్కారం (andarikee namaskaaram) = hello everyone.",
    },
    // describing
    {
      key: "pedda",
      lesson: "describing-people",
      topic: "Describing people",
      meaning: "Big / elder",
      script: "పెద్ద",
      roman: "pedda",
      notes:
        "Used for size and for age/seniority: పెద్ద ఇల్లు (a big house), పెద్దవాళ్ళు (elders).",
    },
    {
      key: "chinna",
      lesson: "describing-people",
      topic: "Describing people",
      meaning: "Small / younger",
      script: "చిన్న",
      roman: "chinna",
      notes: "చిన్న పిల్లలు (small children), చిన్నవాడు (a younger/young boy).",
    },
    // food
    {
      key: "pulihora",
      lesson: "food-staples",
      topic: "Food",
      meaning: "Pulihora (tamarind rice)",
      script: "పులిహోర",
      roman: "pulihora",
      notes: "Tangy tamarind (or lemon) rice, made for festivals and temple offerings.",
    },
    {
      key: "gongura-pachchadi",
      lesson: "food-staples",
      topic: "Food",
      meaning: "Gongura chutney (sorrel-leaf pickle)",
      script: "గోంగూర పచ్చడి",
      roman: "gongoora pachchadi",
      notes:
        "A sour, spicy chutney of sorrel leaves — a symbol of Andhra food. పచ్చడి (pachchadi) = chutney.",
    },
    {
      key: "aavakaaya",
      lesson: "food-staples",
      topic: "Food",
      meaning: "Avakaya (Andhra mango pickle)",
      script: "ఆవకాయ",
      roman: "aavakaaya",
      notes: "Fiery raw-mango pickle made every summer; eaten mixed with hot rice and ghee.",
    },
    {
      key: "biryani",
      lesson: "food-staples",
      topic: "Food",
      meaning: "Biryani",
      script: "బిర్యానీ",
      roman: "biryaanee",
      notes: "Hyderabadi biryani is world-famous.",
    },
    // drinks
    {
      key: "chaay",
      lesson: "drinks",
      topic: "Drinks",
      meaning: "Tea (Hyderabad / Telangana word)",
      script: "చాయ్",
      roman: "chaay",
      notes: "In Hyderabad and Telangana tea is usually చాయ్; in Andhra, టీ.",
    },
    {
      key: "irani-chaay",
      lesson: "drinks",
      topic: "Drinks",
      meaning: "Irani chai (Hyderabadi milky tea)",
      words: [
        ["ఇరానీ", "iraanee"],
        ["చాయ్", "chaay"],
      ],
      notes:
        "Thick, creamy tea served in Hyderabad's Irani cafés, often with ఉస్మానియా బిస్కెట్ (Osmania biscuit).",
    },
    {
      key: "raagi-jaava",
      lesson: "drinks",
      topic: "Drinks",
      meaning: "Ragi java (finger-millet drink)",
      script: "రాగి జావ",
      roman: "raagi jaava",
      notes:
        "A cooling, nutritious millet porridge drunk thin, often with buttermilk and salt in summer.",
    },
    // fruits & vegetables
    {
      key: "maamidikaaya",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      meaning: "Raw (green) mango",
      script: "మామిడికాయ",
      roman: "maamidikaaya",
      notes: "-కాయ (-kaaya) = unripe fruit / vegetable; -పండు (-pandu) = ripe fruit.",
    },
    {
      key: "vankaaya",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      meaning: "Brinjal (eggplant)",
      script: "వంకాయ",
      roman: "vankaaya",
      notes:
        "Called the king of vegetables in Telugu cooking; గుత్తి వంకాయ కూర (stuffed brinjal curry) is a classic.",
    },
    {
      key: "bendakaaya",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      meaning: "Okra (lady's finger)",
      script: "బెండకాయ",
      roman: "bendakaaya",
    },
    {
      key: "seetaaphalam",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      meaning: "Custard apple",
      script: "సీతాఫలం",
      roman: "seetaaphalam",
      notes: "A sweet seasonal fruit sold everywhere in Telangana after the monsoon.",
    },
    // hungry & thirsty
    {
      key: "kadupu-nindindi",
      lesson: "hungry-thirsty",
      topic: "Food",
      meaning: "I'm full.",
      words: [
        ["కడుపు", "kadupu"],
        ["నిండింది", "nindindi"],
      ],
      notes:
        'Literally "the stomach is filled". Useful when a host keeps serving you: చాలు, కడుపు నిండింది (enough, I\'m full).',
    },
    {
      key: "chaalu",
      lesson: "hungry-thirsty",
      topic: "Food",
      meaning: "Enough",
      script: "చాలు",
      roman: "chaalu",
      notes:
        "Say it (with a hand over your plate) when you don't want more food. Polite: చాలండి (chaalandi).",
    },
    // ordering
    {
      key: "idli",
      lesson: "ordering-food",
      topic: "Restaurant",
      meaning: "Idli (steamed rice cakes)",
      script: "ఇడ్లీ",
      roman: "idlee",
      notes: "A common breakfast (టిఫిన్), served with chutney and sambar.",
    },
    {
      key: "dosha",
      lesson: "ordering-food",
      topic: "Restaurant",
      meaning: "Dosa",
      script: "దోశ",
      roman: "dosha",
      notes:
        "Andhra's green-gram dosa is పెసరట్టు (pesarattu), often with upma inside (ఎమ్మెల్యే పెసరట్టు).",
    },
    {
      key: "inkaa-konchem",
      lesson: "ordering-food",
      topic: "Restaurant",
      meaning: "A little more",
      words: [
        ["ఇంకా", "inkaa"],
        ["కొంచెం", "konchem"],
      ],
      notes: "ఇంకా = more / still. Asking for more rice: ఇంకా కొంచెం అన్నం వేయండి.",
    },
    // numbers
    {
      key: "iddaru",
      lesson: "numbers-1-10",
      topic: "Numbers",
      meaning: "Two (people)",
      script: "ఇద్దరు",
      roman: "iddaru",
      notes:
        "People are counted with special forms: ఒక్కరు (1), ఇద్దరు (2), ముగ్గురు (3), నలుగురు (4), ఐదుగురు (5).",
    },
    {
      key: "laksha",
      lesson: "big-numbers",
      topic: "Numbers",
      meaning: "One lakh (100,000)",
      script: "లక్ష",
      roman: "laksha",
      notes: "Indian numbering: లక్ష (1,00,000) and కోటి (koti, 1,00,00,000 = 10 million).",
    },
    // time
    {
      key: "ganta",
      lesson: "time",
      topic: "Time",
      meaning: "Hour / o'clock",
      script: "గంట",
      roman: "ganta",
      notes: "Also means a bell. Half an hour = అరగంట (araganta).",
    },
    {
      key: "ellundi",
      lesson: "time",
      topic: "Time",
      meaning: "Day after tomorrow",
      script: "ఎల్లుండి",
      roman: "ellundi",
    },
    {
      key: "monna",
      lesson: "time",
      topic: "Time",
      meaning: "Day before yesterday",
      script: "మొన్న",
      roman: "monna",
      notes: 'Also used loosely for "the other day".',
    },
    // days
    {
      key: "ugaadi",
      lesson: "days",
      topic: "Days",
      meaning: "Ugadi (Telugu New Year)",
      script: "ఉగాది",
      roman: "ugaadi",
      notes:
        "Celebrated in March/April with ఉగాది పచ్చడి, a chutney mixing six tastes for the joys and sorrows of the year.",
    },
    {
      key: "sankraanti",
      lesson: "days",
      topic: "Days",
      meaning: "Sankranti (harvest festival)",
      script: "సంక్రాంతి",
      roman: "sankraanti",
      notes:
        "The biggest festival in Andhra (January), with ముగ్గులు (rangoli), kites and family gatherings in home villages.",
    },
    // routine
    {
      key: "pallu-tomukovadam",
      lesson: "routine-verbs",
      topic: "Daily routine",
      meaning: "To brush one's teeth",
      script: "పళ్ళు తోముకోవడం",
      roman: "pallu tomukovadam",
    },
    {
      key: "padukovadam",
      lesson: "routine-verbs",
      topic: "Daily routine",
      meaning: "To lie down / go to bed",
      script: "పడుకోవడం",
      roman: "padukovadam",
      notes: "The everyday verb for going to sleep: పడుకుంటాను (I'll go to bed).",
    },
    // activities
    {
      key: "nerchukovadam",
      lesson: "activity-verbs",
      topic: "Activities",
      meaning: "To learn",
      script: "నేర్చుకోవడం",
      roman: "nerchukovadam",
      notes: "To teach = నేర్పించడం (nerpinchadam).",
    },
    // my day
    {
      key: "tarvaata",
      lesson: "my-day",
      topic: "Daily routine",
      meaning: "After / later / then",
      script: "తర్వాత",
      roman: "tarvaata",
      notes:
        'After a noun: భోజనం తర్వాత (after the meal). Alone: "later / then". Also spelled తరువాత.',
    },
    // places
    {
      key: "chaarminaar",
      lesson: "places-2",
      topic: "Places",
      meaning: "Charminar",
      script: "చార్మినార్",
      roman: "chaarminaar",
      notes:
        "Hyderabad's iconic 16th-century monument, surrounded by the bangle and pearl markets of the old city.",
    },
    {
      key: "tirumala",
      lesson: "places-2",
      topic: "Places",
      meaning: "Tirumala (temple hill near Tirupati)",
      script: "తిరుమల",
      roman: "tirumala",
      notes:
        "Home of the Venkateswara temple, one of the most visited pilgrim sites in the world. Its laddu prasadam is famous.",
    },
    // positions
    {
      key: "pakkana",
      lesson: "position-words",
      topic: "Directions",
      meaning: "Beside / next to",
      script: "పక్కన",
      roman: "pakkana",
      notes: "బ్యాంకు పక్కన (next to the bank). పక్కిల్లు (pakkillu) = the house next door.",
    },
    {
      key: "paina",
      lesson: "position-words",
      topic: "Directions",
      meaning: "Above / upstairs",
      script: "పైన",
      roman: "paina",
    },
    {
      key: "kinda",
      lesson: "position-words",
      topic: "Directions",
      meaning: "Below / under / downstairs",
      script: "కింద",
      roman: "kinda",
      notes: "Also written క్రింద (krinda). టేబుల్ కింద = under the table.",
    },
    // money
    {
      key: "chillara",
      lesson: "money-words",
      topic: "Shopping",
      meaning: "Change (small money)",
      script: "చిల్లర",
      roman: "chillara",
      notes: "చిల్లర ఉందా? (do you have change?) — a common question at shops and in autos.",
    },
    // colours
    {
      key: "gulaabee-rangu",
      lesson: "colours",
      topic: "Colours",
      meaning: "Pink",
      script: "గులాబీ రంగు",
      roman: "gulaabee rangu",
      notes: 'Literally "rose colour" (గులాబీ = rose).',
    },
    // clothes
    {
      key: "panche",
      lesson: "clothes",
      topic: "Clothes",
      meaning: "Dhoti (men's wrap)",
      script: "పంచె",
      roman: "panche",
      notes: "Traditional white wrap worn by men, especially at festivals and weddings.",
    },
    {
      key: "langaa-onee",
      lesson: "clothes",
      topic: "Clothes",
      meaning: "Half-saree (langa voni)",
      script: "లంగా ఓణీ",
      roman: "langaa onee",
      notes: "Traditional dress of young girls: a long skirt (లంగా) with a half-saree (ఓణీ).",
    },
    // shop
    {
      key: "mottam-enta",
      lesson: "at-the-shop",
      topic: "Shopping",
      meaning: "How much is it in total?",
      words: [
        ["మొత్తం", "mottam"],
        ["ఎంత", "enta"],
        ["అయింది?", "ayindi?"],
      ],
      notes: "మొత్తం (mottam) = total / altogether.",
    },
    {
      key: "kavar",
      lesson: "at-the-shop",
      topic: "Shopping",
      meaning: "Carry bag (plastic bag)",
      script: "కవర్",
      roman: "kavar",
      notes: 'From English "cover" — what shopkeepers call a plastic or paper carry bag.',
    },
    // vehicles
    {
      key: "bandi",
      lesson: "vehicles",
      topic: "Transport",
      meaning: "Vehicle / two-wheeler",
      script: "బండి",
      roman: "bandi",
      notes:
        "Originally a bullock cart; now any vehicle, especially a scooter or motorbike. A push-cart seller is బండివాడు.",
    },
    {
      key: "metro",
      lesson: "vehicles",
      topic: "Transport",
      meaning: "Metro (train)",
      script: "మెట్రో",
      roman: "metro",
      notes: "Hyderabad Metro is a common way to cross the city.",
    },
    // travel phrases
    {
      key: "charminar-vastaaraa",
      lesson: "travel-phrases",
      topic: "Travel",
      meaning: "Will you go to Charminar? (to an auto driver)",
      words: [
        ["చార్మినార్‌కి", "chaarminaarki"],
        ["వస్తారా?", "vastaaraa?"],
      ],
      notes:
        'How you hail an auto: name the place + వస్తారా? ("will you come?"). Then ask ఎంత? and agree on the fare.',
    },
    {
      key: "meetar-veyandi",
      lesson: "travel-phrases",
      topic: "Travel",
      meaning: "Please put the meter on.",
      words: [
        ["మీటర్", "meetar"],
        ["వేయండి", "veyandi"],
      ],
      notes: "Ask an auto driver to charge by the meter instead of a fixed price.",
    },
    // conversation
    {
      key: "kadaa",
      lesson: "conv-friend",
      topic: "Conversation",
      meaning: "Isn't it? / right?",
      script: "కదా",
      roman: "kadaa",
      notes:
        "Added at the end of a sentence to seek agreement: బాగుంది కదా? (it's nice, isn't it?).",
    },
    {
      key: "ee-madhya",
      lesson: "conv-friend",
      topic: "Conversation",
      meaning: "These days / recently",
      words: [
        ["ఈ", "ee"],
        ["మధ్య", "madhya"],
      ],
      notes: "ఈ మధ్య ఏం చేస్తున్నావు? = what are you doing these days?",
    },
    {
      key: "emaindi",
      lesson: "conv-phone",
      topic: "Conversation",
      meaning: "What happened?",
      words: [["ఏమైంది?", "emaindi?"]],
      notes: 'Also used as "what\'s wrong?". Polite and casual alike.',
    },
    {
      key: "ayyo",
      lesson: "conv-help",
      topic: "Conversation",
      meaning: "Oh no! / Oh dear!",
      script: "అయ్యో",
      roman: "ayyo",
      notes: "Expresses sympathy, regret or surprise: అయ్యో, పాపం (oh, poor thing).",
    },
    // feelings & health
    {
      key: "paapam",
      lesson: "feelings",
      topic: "Feelings",
      meaning: "Poor thing! / What a pity",
      script: "పాపం",
      roman: "paapam",
      notes: 'Very common expression of sympathy. (Literally "sin".)',
    },
    {
      key: "daggu",
      lesson: "health",
      topic: "Health",
      meaning: "Cough",
      script: "దగ్గు",
      roman: "daggu",
      notes: "A cold (runny nose) is జలుబు (jalubu): నాకు జలుబు, దగ్గు ఉంది.",
    },
    // love & friendship
    {
      key: "ishtam",
      lesson: "love-friendship",
      topic: "Relationships",
      meaning: "Liking / fondness",
      script: "ఇష్టం",
      roman: "ishtam",
      notes:
        "The everyday word for liking and affection, used with the dative: నాకు X అంటే ఇష్టం (I like X).",
    },
    {
      key: "prema",
      lesson: "love-friendship",
      topic: "Relationships",
      meaning: "Love",
      script: "ప్రేమ",
      roman: "prema",
      notes:
        "Covers romantic and parental love: అమ్మ ప్రేమ (a mother's love). A love marriage is ప్రేమ పెళ్ళి.",
    },
    // weather
    {
      key: "endaakaalam",
      lesson: "weather",
      topic: "Weather",
      meaning: "Summer",
      script: "ఎండాకాలం",
      roman: "endaakaalam",
      notes:
        "Very hot in Telangana and Andhra (April–June). Monsoon = వానాకాలం (vaanaakaalam); winter = చలికాలం (chalikaalam).",
    },
    {
      key: "vaanaakaalam",
      lesson: "weather",
      topic: "Weather",
      meaning: "Rainy season (monsoon)",
      script: "వానాకాలం",
      roman: "vaanaakaalam",
    },
    // college & work
    {
      key: "jeetam",
      lesson: "college-work",
      topic: "College & work",
      meaning: "Salary",
      script: "జీతం",
      roman: "jeetam",
      notes: "Also శాలరీ (shaalaree).",
    },
    // hobbies
    {
      key: "koochipoodi",
      lesson: "hobbies",
      topic: "Hobbies",
      meaning: "Kuchipudi (classical dance)",
      script: "కూచిపూడి",
      roman: "koochipoodi",
      notes: "Classical dance from the village of Kuchipudi in Andhra Pradesh.",
    },
    {
      key: "paadadam",
      lesson: "hobbies",
      topic: "Hobbies",
      meaning: "To sing",
      script: "పాడడం",
      roman: "paadadam",
      notes: "From పాట (song): పాట పాడండి (please sing a song).",
    },
    // plans
    {
      key: "pada",
      lesson: "plans",
      topic: "Plans & invitations",
      meaning: "Come on, let's go (casual)",
      script: "పద",
      roman: "pada",
      notes: "Casual, to friends. Polite/plural: పదండి (padandi).",
    },
    {
      key: "batukamma",
      lesson: "plans",
      topic: "Plans & invitations",
      meaning: "Bathukamma (Telangana flower festival)",
      script: "బతుకమ్మ",
      roman: "batukamma",
      notes:
        "Women stack flowers into a tower and sing and dance around it for nine days before Dasara — Telangana's state festival.",
    },
    // requests & help
    {
      key: "konchem",
      lesson: "requests-help",
      topic: "Requests & help",
      meaning: "A little / please (softener)",
      script: "కొంచెం",
      roman: "konchem",
      notes: 'Softens any request, much like "please": కొంచెం ఆగండి, కొంచెం చెప్పండి.',
    },
  ],

  dialogues: {
    meetingSomeone: {
      context: "Ravi meets Asha at a friend's function in Hyderabad.",
      lines: [
        { speaker: "A", script: "నమస్కారం.", roman: "namaskaaram.", meaning: "Hello." },
        { speaker: "B", script: "నమస్కారం.", roman: "namaskaaram.", meaning: "Hello." },
        {
          speaker: "A",
          script: "మీ పేరు ఏమిటి?",
          roman: "mee peru emiti?",
          meaning: "What is your name?",
        },
        {
          speaker: "B",
          script: "నా పేరు ఆశ. మీ పేరు?",
          roman: "naa peru Asha. mee peru?",
          meaning: "My name is Asha. And your name?",
        },
        {
          speaker: "A",
          script: "నా పేరు రవి. మీది ఏ ఊరు?",
          roman: "naa peru Ravi. meedi e ooru?",
          meaning: "My name is Ravi. Where are you from?",
        },
        {
          speaker: "B",
          script: "మాది విశాఖపట్నం. మిమ్మల్ని కలిసినందుకు సంతోషం.",
          roman: "maadi Vishaakhapatnam. mimmalni kalisinanduku santosham.",
          meaning: "I'm from Visakhapatnam. Nice to meet you.",
        },
        {
          speaker: "A",
          script: "నాకు కూడా చాలా సంతోషం.",
          roman: "naaku koodaa chaalaa santosham.",
          meaning: "Nice to meet you too.",
        },
      ],
    },
    meetingFriend: {
      context: "Two old college friends bump into each other (casual నువ్వు forms).",
      lines: [
        {
          speaker: "A",
          script: "హాయ్! ఎలా ఉన్నావు?",
          roman: "haay! elaa unnaavu?",
          meaning: "Hi! How are you?",
        },
        {
          speaker: "B",
          script: "బాగున్నాను. మరి నువ్వు?",
          roman: "baagunnaanu. mari nuvvu?",
          meaning: "I'm fine. And you?",
        },
        {
          speaker: "A",
          script: "నేను కూడా బాగున్నాను. చూసి చాలా రోజులైంది!",
          roman: "nenu koodaa baagunnaanu. choosi chaalaa rojulaindi!",
          meaning: "I'm fine too. Long time no see!",
        },
        {
          speaker: "B",
          script: "అవును. ఈ మధ్య ఏం చేస్తున్నావు?",
          roman: "avunu. ee madhya em chestunnaavu?",
          meaning: "Yes. What are you doing these days?",
        },
        {
          speaker: "A",
          script: "చదువుకుంటున్నాను. భోజనం చేశావా?",
          roman: "chaduvukuntunnaanu. bhojanam cheshaavaa?",
          meaning: "I'm studying. Have you eaten?",
        },
        {
          speaker: "B",
          script: "ఆ, చేశాను. పద, టీ తాగుదాం.",
          roman: "aa, cheshaanu. pada, tee taagudaam.",
          meaning: "Yes, I've eaten. Come on, let's have tea.",
        },
        {
          speaker: "A",
          script: "సరే, వెళ్దాం.",
          roman: "sare, veldaam.",
          meaning: "Okay, let's go.",
        },
      ],
    },
    restaurant: {
      context: "Ordering lunch at a small hotel in Vijayawada.",
      lines: [
        {
          speaker: "A",
          script: "మీకు ఏం కావాలి?",
          roman: "meeku em kaavaali?",
          meaning: "What would you like?",
        },
        {
          speaker: "B",
          script: "ఒక ప్లేట్ అన్నం, పప్పు ఇవ్వండి.",
          roman: "oka plet annam, pappu ivvandi.",
          meaning: "Please give me one plate of rice and dal.",
        },
        {
          speaker: "A",
          script: "తాగడానికి ఏమైనా కావాలా?",
          roman: "taagadaaniki emainaa kaavaalaa?",
          meaning: "Anything to drink?",
        },
        {
          speaker: "B",
          script: "ఒక టీ, చక్కెర లేకుండా.",
          roman: "oka tee, chakkera lekundaa.",
          meaning: "One tea, without sugar, please.",
        },
        {
          speaker: "A",
          script: "సరే. ఇంకా ఏమైనా?",
          roman: "sare. inkaa emainaa?",
          meaning: "Okay. Anything else?",
        },
        {
          speaker: "B",
          script: "కొంచెం నీళ్ళు ఇవ్వండి. ఇది కారంగా ఉంటుందా?",
          roman: "konchem neellu ivvandi. idi kaarangaa untundaa?",
          meaning: "Some water, please. Is it spicy?",
        },
        {
          speaker: "A",
          script: "కొంచెం కారంగా ఉంటుంది.",
          roman: "konchem kaarangaa untundi.",
          meaning: "It's a little spicy.",
        },
        {
          speaker: "B",
          script: "పర్వాలేదు. భోజనం అయ్యాక బిల్లు తీసుకురండి.",
          roman: "parvaaledu. bhojanam ayyaaka billu teesukurandi.",
          meaning: "That's fine. Please bring the bill after the meal.",
        },
      ],
    },
    shopping: {
      context: "Buying mangoes from a fruit seller at a market in Hyderabad.",
      lines: [
        {
          speaker: "A",
          script: "మామిడిపండ్లు ఉన్నాయా?",
          roman: "maamidipandlu unnaayaa?",
          meaning: "Do you have mangoes?",
        },
        { speaker: "B", script: "ఉన్నాయండి.", roman: "unnaayandi.", meaning: "Yes, we have." },
        {
          speaker: "A",
          script: "కిలో ఎంత?",
          roman: "kilo enta?",
          meaning: "How much does one kilo cost?",
        },
        {
          speaker: "B",
          script: "వంద రూపాయలు.",
          roman: "vanda roopaayalu.",
          meaning: "One hundred rupees.",
        },
        {
          speaker: "A",
          script: "ఇది చాలా ఖరీదు. ధర కొంచెం తగ్గించండి.",
          roman: "idi chaalaa khareedu. dhara konchem tagginchandi.",
          meaning: "That is too expensive. Please reduce the price a little.",
        },
        {
          speaker: "B",
          script: "సరే, తొంభై రూపాయలు.",
          roman: "sare, tombhai roopaayalu.",
          meaning: "Okay, ninety rupees.",
        },
        {
          speaker: "A",
          script: "సరే, ఒక కిలో ఇవ్వండి.",
          roman: "sare, oka kilo ivvandi.",
          meaning: "Fine, I'll take one kilo.",
        },
      ],
    },
    directions: {
      context: "A visitor asks a passer-by the way to the railway station in Tirupati.",
      lines: [
        {
          speaker: "A",
          script: "ఏమండీ, రైల్వే స్టేషన్ ఎక్కడ ఉంది?",
          roman: "emandee, railve steshan ekkada undi?",
          meaning: "Excuse me, where is the railway station?",
        },
        {
          speaker: "B",
          script: "నేరుగా వెళ్ళి, తర్వాత ఎడమ వైపు తిరగండి.",
          roman: "nerugaa velli, tarvaata edama vaipu tiragandi.",
          meaning: "Go straight, then turn left.",
        },
        { speaker: "A", script: "దూరమా?", roman: "dooramaa?", meaning: "Is it far?" },
        {
          speaker: "B",
          script: "లేదు, దగ్గరే. నడిచి ఐదు నిమిషాలు.",
          roman: "ledu, daggare. nadichi aidu nimishaalu.",
          meaning: "No, it's near. About five minutes on foot.",
        },
        {
          speaker: "A",
          script: "చాలా ధన్యవాదాలు.",
          roman: "chaalaa dhanyavaadaalu.",
          meaning: "Thank you very much.",
        },
        {
          speaker: "B",
          script: "పర్వాలేదండి.",
          roman: "parvaaledandi.",
          meaning: "You're welcome.",
        },
      ],
    },
    college: {
      context: "A senior student talks to a newcomer on the first day of college.",
      lines: [
        {
          speaker: "A",
          script: "హాయ్, మీరు ఇక్కడ కొత్తా?",
          roman: "haay, meeru ikkada kottaa?",
          meaning: "Hi, are you new here?",
        },
        {
          speaker: "B",
          script: "అవును, ఈరోజు నా మొదటి రోజు.",
          roman: "avunu, eeroju naa modati roju.",
          meaning: "Yes, today is my first day.",
        },
        {
          speaker: "A",
          script: "ఏ సంవత్సరం చదువుతున్నారు?",
          roman: "e samvatsaram chaduvutunnaaru?",
          meaning: "Which year are you in?",
        },
        {
          speaker: "B",
          script: "మొదటి సంవత్సరం. లైబ్రరీ ఎక్కడ ఉంది?",
          roman: "modati samvatsaram. laibraree ekkada undi?",
          meaning: "First year. Where is the library?",
        },
        {
          speaker: "A",
          script: "ఆఫీసు వెనక ఉంది. రండి, నేను చూపిస్తాను.",
          roman: "aapheesu venaka undi. randi, nenu choopistaanu.",
          meaning: "It's behind the office. Come, I'll show you.",
        },
        {
          speaker: "B",
          script: "థాంక్స్! పరీక్ష ఎప్పుడు?",
          roman: "thaanks! pareeksha eppudu?",
          meaning: "Thanks! When is the exam?",
        },
        { speaker: "A", script: "వచ్చే నెల.", roman: "vachche nela.", meaning: "Next month." },
      ],
    },
    phoneCall: {
      context: "Ravi phones his friend (casual నువ్వు forms).",
      lines: [
        { speaker: "A", script: "హలో?", roman: "halo?", meaning: "Hello?" },
        {
          speaker: "B",
          script: "హలో, ఎవరు మాట్లాడుతున్నారు?",
          roman: "halo, evaru maatlaadutunnaaru?",
          meaning: "Hello, who is speaking?",
        },
        {
          speaker: "A",
          script: "నేనే, రవిని. ఎక్కడ ఉన్నావు?",
          roman: "nene, Ravini. ekkada unnaavu?",
          meaning: "It's me, Ravi. Where are you?",
        },
        {
          speaker: "B",
          script: "ఇంట్లో ఉన్నాను. ఏమైంది?",
          roman: "intlo unnaanu. emaindi?",
          meaning: "I'm at home. What happened?",
        },
        {
          speaker: "A",
          script: "రేపు ఖాళీగా ఉన్నావా?",
          roman: "repu khaaleegaa unnaavaa?",
          meaning: "Are you free tomorrow?",
        },
        {
          speaker: "B",
          script: "ఆ, ఖాళీగానే ఉన్నాను.",
          roman: "aa, khaaleegaane unnaanu.",
          meaning: "Yes, I'm free.",
        },
        {
          speaker: "A",
          script: "అయితే సాయంత్రం మా ఇంటికి రా.",
          roman: "ayite saayantram maa intiki raa.",
          meaning: "Then come to my house in the evening.",
        },
        {
          speaker: "B",
          script: "సరే, వస్తాను. తర్వాత ఫోన్ చేస్తాను.",
          roman: "sare, vastaanu. tarvaata phon chestaanu.",
          meaning: "Okay, I'll come. I'll call you later.",
        },
      ],
    },
    askingForHelp: {
      context: "A visitor in Vijayawada can't find an address and asks a shopkeeper.",
      lines: [
        {
          speaker: "A",
          script: "ఏమండీ, కొంచెం సహాయం చేస్తారా?",
          roman: "emandee, konchem sahaayam chestaaraa?",
          meaning: "Excuse me, can you help me?",
        },
        { speaker: "B", script: "ఆ, చెప్పండి.", roman: "aa, cheppandi.", meaning: "Yes, tell me." },
        {
          speaker: "A",
          script: "నేను దారి తప్పిపోయాను. ఈ అడ్రస్ నాకు అర్థం కావడం లేదు.",
          roman: "nenu daari tappipoyaanu. ee adras naaku artham kaavadam ledu.",
          meaning: "I'm lost. I don't understand this address.",
        },
        {
          speaker: "B",
          script: "చూపించండి. ఇది బజారు దగ్గర.",
          roman: "choopinchandi. idi bajaaru daggara.",
          meaning: "Show me. This is near the market.",
        },
        {
          speaker: "A",
          script: "కొంచెం నెమ్మదిగా చెప్పండి.",
          roman: "konchem nemmadigaa cheppandi.",
          meaning: "Please speak slowly.",
        },
        {
          speaker: "B",
          script: "బజారుకు వెళ్ళి అక్కడ అడగండి. దగ్గరే.",
          roman: "bajaaruku velli akkada adagandi. daggare.",
          meaning: "Go to the market and ask there. It's close.",
        },
        {
          speaker: "A",
          script: "చాలా థాంక్స్.",
          roman: "chaalaa thaanks.",
          meaning: "Thank you so much.",
        },
      ],
    },
    travel: {
      context: "A passenger boards a city bus in Hyderabad and talks to the conductor.",
      lines: [
        {
          speaker: "A",
          script: "ఈ బస్సు రైల్వే స్టేషన్‌కి వెళ్తుందా?",
          roman: "ee bassu railve steshanki veltundaa?",
          meaning: "Does this bus go to the railway station?",
        },
        {
          speaker: "B",
          script: "వెళ్తుంది. మీరు ఎక్కడ దిగాలి?",
          roman: "veltundi. meeru ekkada digaali?",
          meaning: "Yes. Where do you want to get off?",
        },
        {
          speaker: "A",
          script: "రైల్వే స్టేషన్ దగ్గర. టికెట్ ఎంత?",
          roman: "railve steshan daggara. tiket enta?",
          meaning: "At the railway station. How much is the ticket?",
        },
        {
          speaker: "B",
          script: "ఇరవై రూపాయలు.",
          roman: "iravai roopaayalu.",
          meaning: "Twenty rupees.",
        },
        {
          speaker: "A",
          script: "ఎంతసేపు పడుతుంది?",
          roman: "entasepu padutundi?",
          meaning: "How long will it take?",
        },
        {
          speaker: "B",
          script: "సుమారు అరగంట.",
          roman: "sumaaru araganta.",
          meaning: "About half an hour.",
        },
        {
          speaker: "A",
          script: "స్టేషన్ రాగానే చెప్పండి.",
          roman: "steshan raagaane cheppandi.",
          meaning: "Please tell me when we reach the station.",
        },
        {
          speaker: "B",
          script: "సరే, చెప్తాను.",
          roman: "sare, cheptaanu.",
          meaning: "Okay, I'll tell you.",
        },
      ],
    },
    dailyRoutine: {
      context: "Two classmates compare their daily routines.",
      lines: [
        {
          speaker: "A",
          script: "మీరు ఎన్ని గంటలకు లేస్తారు?",
          roman: "meeru enni gantalaku lestaaru?",
          meaning: "What time do you wake up?",
        },
        {
          speaker: "B",
          script: "నేను ఆరు గంటలకు లేస్తాను.",
          roman: "nenu aaru gantalaku lestaanu.",
          meaning: "I wake up at six o'clock.",
        },
        {
          speaker: "A",
          script: "ఆ తర్వాత ఏం చేస్తారు?",
          roman: "aa tarvaata em chestaaru?",
          meaning: "What do you do after that?",
        },
        {
          speaker: "B",
          script: "స్నానం చేసి, టిఫిన్ తిని, కాలేజీకి వెళ్తాను.",
          roman: "snaanam chesi, tiphin tini, kaalejeeki veltaanu.",
          meaning: "I bathe, eat breakfast and go to college.",
        },
        {
          speaker: "A",
          script: "ఇంటికి ఎప్పుడు వస్తారు?",
          roman: "intiki eppudu vastaaru?",
          meaning: "When do you come home?",
        },
        {
          speaker: "B",
          script: "సాయంత్రం ఇంటికి వచ్చి చదువుకుంటాను.",
          roman: "saayantram intiki vachchi chaduvukuntaanu.",
          meaning: "I come home in the evening and study.",
        },
        {
          speaker: "A",
          script: "రాత్రి ఎప్పుడు పడుకుంటారు?",
          roman: "raatri eppudu padukuntaaru?",
          meaning: "When do you sleep at night?",
        },
        {
          speaker: "B",
          script: "పది గంటలకు పడుకుంటాను.",
          roman: "padi gantalaku padukuntaanu.",
          meaning: "I sleep at ten o'clock.",
        },
      ],
    },
  },

  lessonNotes: {
    greetings:
      'Telugu has no everyday "good morning" or "goodbye": people greet with నమస్కారం at any time, and when leaving say వెళ్ళొస్తాను ("I\'ll go and come back") rather than a final "I\'m going".',
    "polite-words":
      "Telugu has three kinds of \"no\": కాదు (kaadu, it is not), లేదు (ledu, there isn't / didn't) and వద్దు (vaddu, don't want). Politeness comes mostly from the -ండి verb ending and the particle అండి.",
    "my-name":
      'Telugu needs no word for "is" in sentences like నా పేరు ఆశ ("my name Asha") or ఇది నీళ్ళు.',
    "how-are-you":
      "Verb endings show who you are talking to: ఉన్నారు? (unnaaru, polite/plural) vs ఉన్నావు? (unnaavu, casual). Use the polite form with anyone older or unfamiliar.",
    siblings:
      'Telugu has no single word for "brother" or "sister": always say elder or younger — అన్న/తమ్ముడు, అక్క/చెల్లి. అన్న and అక్క are also friendly ways to address any slightly older man or woman.',
    grandparents:
      "Grandmothers have different words — నానమ్మ (father's mother) and అమ్మమ్మ (mother's mother) — but both grandfathers are తాత. Uncles and aunts are named by side and age: మామయ్య, అత్తయ్య, బాబాయ్, పెదనాన్న, పిన్ని, పెద్దమ్మ.",
    "family-review":
      'Telugu has no verb "to have": నాకు ఒక తమ్ముడు ఉన్నాడు is literally "to me one younger brother is". People are counted with special words: ఇద్దరు (two people), ముగ్గురు (three people).',
    "hungry-thirsty":
      'Feelings and wants use the dative ("to me") construction: నాకు ఆకలిగా ఉంది ("to me it is hungry" = I am hungry), నాకు నీళ్ళు కావాలి ("to me water is needed" = I want water).',
    "numbers-1-10":
      "Before a noun ఒకటి (one) becomes ఒక: ఒక టీ (one tea). People are counted differently: ఒక్కరు, ఇద్దరు, ముగ్గురు. In cities, English numbers are common for prices and phone numbers.",
    time: "Clock times use గంట (hour): ఐదు గంటలు (five o'clock), ఐదు గంటలకు (at five). One o'clock is ఒంటి గంట.",
    "my-day":
      'Telugu uses the same verb form for habits and the future: లేస్తాను = "I wake up" or "I will wake up". Time words (రోజూ, ఆరు గంటలకు) come before the verb.',
    "where-are-you-going":
      "Place endings: -లో (-lo) = in/at (ఇంట్లో, at home), -కి/-కు (-ki/-ku) = to (ఇంటికి, to home; బజారుకు, to the market), నుండి (nundi) = from. Note ఇల్లు changes to ఇంటి- before endings.",
    pronouns:
      'నువ్వు (nuvvu) is casual and మీరు (meeru) polite or plural; he/she also have respectful forms (ఆయన, ఆవిడ). There are two "we": మనం (you and I) and మేము (us, not you).',
    "word-order":
      'Telugu is subject–object–verb: నేను అన్నం తింటాను = "I rice eat". The verb ending shows the person: తింటాను (I), తింటావు (you, casual), తింటారు (you polite / they), తింటాడు (he), తింటుంది (she/it), తింటాము (we).',
    "past-future":
      "Past endings: తిన్నాను (I ate), వచ్చాడు (he came), వచ్చింది (she came). The future form is the same as the habitual present (వెళ్తాను = I go / I will go), so time words like రేపు or తర్వాత make the meaning clear.",
    "questions-negatives":
      'Make a yes/no question by adding -ఆ (-aa) to the last word: తింటారు → తింటారా?, పుస్తకం → పుస్తకమా?. Use కాదు for "is not" (ఇది నా పుస్తకం కాదు) and లేదు for "there isn\'t / didn\'t".',
    possession:
      "Telugu uses endings where English uses prepositions: -లో (in), -కి/-కు (to), -తో (with), and the separate words నుండి (from) and మీద (on). Possessives come first: నా (my), మీ (your), అతని (his). For family and home people say మా (our): మా అమ్మ.",
    "polite-casual":
      "Commands to friends use the bare verb (రా, కూర్చో, తిను); add -ండి for politeness or to more than one person (రండి, కూర్చోండి, తినండి). The same split applies to questions: ఎలా ఉన్నావు? vs ఎలా ఉన్నారు?",
    feelings:
      "Many feelings use the dative pattern నాకు …గా ఉంది: నాకు బాధగా ఉంది (I am sad), నాకు భయంగా ఉంది (I am scared). నేను సంతోషంగా ఉన్నాను (I am happy) also works.",
    health:
      'Tablets are "put on" in Telugu: మందు వేసుకోండి (take the medicine). Pain is నొప్పి: తలనొప్పి (headache), కడుపు నొప్పి (stomach ache).',
    "love-friendship":
      'Telugu speakers rarely say "I love you" outright; నేను నిన్ను ప్రేమిస్తున్నాను sounds like a film line. Affection is usually expressed with ఇష్టం (liking): నువ్వంటే నాకు చాలా ఇష్టం, నాకు మా కుటుంబం అంటే చాలా ఇష్టం. "I miss you" is నువ్వు గుర్తొస్తున్నావు ("you come to my mind").',
    hobbies:
      'To say you like something: నాకు X అంటే ఇష్టం ("to me, as for X, there is liking"). For activities use the -డం form: సినిమాలు చూడడం ఇష్టం (I like watching movies).',
    plans:
      "The -దాం (-daam) ending means \"let's\": వెళ్దాం (let's go), కలుద్దాం (let's meet), తాగుదాం (let's drink).",
  },
};
