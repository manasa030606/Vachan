import type { LanguageContent } from "../types.ts";

// Malayalam (മലയാളം) — beginner course content.
// Romanization: long vowels doubled (aa, ee, oo), ത = th, ട = t, ഴ = zh, ഞ = nj, ച്ച = chch,
// final ് (samvruthokaram) = u. English loanwords keep a recognisable English spelling (bus, ticket).
export const content: LanguageContent = {
  code: "ml",
  entries: {
    // First words › Greetings (lesson "greetings")
    hello: {
      script: "നമസ്കാരം",
      roman: "namaskaaram",
      notes:
        'The respectful hello for any time of day, often said with palms together. Among friends people just say "hi" or ask എന്തൊക്കെയുണ്ട്? (enthokkeyundu?, how are things?).',
    },
    goodbye: {
      script: "പോയിട്ട് വരാം",
      roman: "poyittu varaam",
      accept: ["I'll go and come back", "Bye"],
      notes:
        'Literally "I\'ll go and come (back)" — Malayalis avoid a final-sounding goodbye. The host replies ശരി (shari, okay). Among friends "bye" in English is very common.',
    },
    seeYouLater: {
      words: [
        ["പിന്നെ", "pinne"],
        ["കാണാം", "kaanaam"],
      ],
      notes:
        'Literally "(we) can see (each other) later". കാണാം (kaanaam) = "let\'s meet / we will see".',
    },
    goodMorning: {
      words: [["സുപ്രഭാതം", "suprabhaatham"]],
      notes:
        'സുപ്രഭാതം (suprabhaatham) is the formal word, seen in writing and greetings cards. In speech most people say "good morning" in English or simply നമസ്കാരം (namaskaaram).',
    },
    goodNight: {
      words: [["ശുഭരാത്രി", "shubharaathri"]],
      notes:
        'ശുഭരാത്രി (shubharaathri) is formal and used in messages. In speech people say "good night" in English; to family, ഉറങ്ങിക്കോ (urangikko, go to sleep now) is warmer.',
    },
    thankYou: {
      script: "നന്ദി",
      roman: "nandi",
      accept: ["Thanks"],
      notes:
        'Stronger: വളരെ നന്ദി (valare nandi, thank you very much). In daily speech many say "thanks" in English, and close family often skip a spoken thank-you entirely.',
    },
    welcome: {
      script: "സ്വാഗതം",
      roman: "swaagatham",
      notes:
        'Used on signs and in speeches ("welcome to Kerala"). To welcome a guest at the door people actually say വരൂ, ഇരിക്കൂ (varoo, irikkoo, please come in, please sit). Not used as a reply to thank you.',
    },
    // First words › Yes, no & polite words (lesson "polite-words")
    yes: {
      script: "അതെ",
      roman: "athe",
      notes:
        'അതെ (athe) means "that\'s right". To say "yes, there is / yes, I have / yes, I did" people say ഉവ്വ് (uvvu) or ഉണ്ട് (undu). Casually just ആ (aa) or ശരി (shari, okay).',
    },
    no: {
      script: "ഇല്ല",
      roman: "illa",
      notes:
        "ഇല്ല (illa) = \"there isn't / didn't / won't\". To deny what something is, use അല്ല (alla): ഇത് ചായ അല്ല (ithu chaaya alla, this is not tea). To refuse an offer, say വേണ്ട (venda, I don't want it).",
    },
    please: {
      script: "ദയവായി",
      roman: "dayavaayi",
      notes:
        "ദയവായി (dayavaayi) is formal (signs, announcements). In speech politeness comes from the verb ending -ഊ (-oo): വരൂ (varoo, please come), or a soft question ending -ആമോ? (-aamo?): തരാമോ? (tharaamo?, could you give?).",
    },
    sorry: {
      script: "ക്ഷമിക്കണം",
      roman: "kshamikkanam",
      accept: ["I'm sorry", "Forgive me"],
      notes:
        'Literally "(you) must forgive (me)". "Sorry" in English is extremely common in everyday speech.',
    },
    excuseMe: {
      words: [
        ["ഒന്ന്", "onnu"],
        ["ക്ഷമിക്കണം", "kshamikkanam"],
      ],
      blank: 1,
      notes:
        'Used when interrupting or getting past someone (ഒന്ന് onnu softens it: "just a moment"). To catch a stranger\'s attention people call out ചേട്ടാ (chetta, brother) or ചേച്ചീ (chechee, sister), or say "excuse me" in English.',
    },
    okay: {
      script: "ശരി",
      roman: "shari",
      accept: ["Alright", "Right", "OK"],
      notes:
        'ശരി (shari) means "right / correct / okay"; it is also how phone calls and conversations are closed. "OK" in English is equally common.',
    },
    noProblem: {
      words: [["കുഴപ്പമില്ല", "kuzhappamilla"]],
      accept: ["No issue", "It's fine"],
      notes:
        'Literally "there is no trouble". Also പ്രശ്നമില്ല (prashnamilla, no problem). The same word answers "how are you?" — കുഴപ്പമില്ല, "not bad".',
    },
    youreWelcome: {
      words: [["അതിനെന്താ", "athinenthaa"]],
      accept: ["No mention", "Not at all"],
      notes:
        'Literally "what is there in that?" — the natural reply to thanks. Malayalam has no fixed "you\'re welcome"; സാരമില്ല (saaramilla, it\'s nothing) is also used. സ്വാഗതം (swaagatham) does not work here.',
    },
    // First words › Everyday things (lesson "things")
    water: {
      script: "വെള്ളം",
      roman: "vellam",
      notes:
        "Do not confuse with വെള്ള (vella, white). Drinking water is often കുടിവെള്ളം (kudivellam).",
    },
    food: {
      script: "ഭക്ഷണം",
      roman: "bhakshanam",
      notes:
        "General word for food / a meal. In everyday Kerala speech a meal is often just ചോറ് (choru, rice): ചോറുണ്ടോ? (chorundo?, have you had your meal?).",
    },
    house: {
      script: "വീട്",
      roman: "veedu",
      notes:
        "With endings it becomes വീട്ടിൽ (veettil, at home) and വീട്ടിലേക്ക് (veettilekku, to home).",
    },
    book: {
      script: "പുസ്തകം",
      roman: "pusthakam",
      notes:
        "Plural: പുസ്തകങ്ങൾ (pusthakangal). A notebook is നോട്ട്ബുക്ക് (notebook) or just ബുക്ക് (book).",
    },
    phone: {
      script: "ഫോൺ",
      roman: "phone",
      notes:
        'Everyone uses the English word; a mobile is also മൊബൈൽ (mobile). "To call" is വിളിക്കുക (vilikkuka).',
    },
    bag: {
      script: "ബാഗ്",
      roman: "bag",
      notes:
        'English loanword. A cloth or shopping bag is സഞ്ചി (sanchi); a plastic carrier bag in shops is called കവർ (kavar, from "cover").',
    },
    pen: {
      script: "പേന",
      roman: "pena",
      notes: 'Native-looking but borrowed long ago; "pen" in English is also understood.',
    },
    money: {
      script: "പണം",
      roman: "panam",
      notes:
        "പണം (panam) is the standard word. In everyday speech people say കാശ് (kaashu) or പൈസ (paisa): കാശില്ല (kaashilla, I have no money).",
    },
    // First words › Common actions (lesson "actions")
    come: {
      script: "വരുക",
      roman: "varuka",
      notes:
        "Dictionary forms end in -ഉക (-uka). Present വരുന്നു (varunnu), past വന്നു (vannu), future വരും (varum).",
    },
    go: {
      script: "പോകുക",
      roman: "pokuka",
      notes:
        "Present പോകുന്നു (pokunnu), past പോയി (poyi), future പോകും (pokum). Same form for every person.",
    },
    eat: {
      script: "കഴിക്കുക",
      roman: "kazhikkuka",
      notes:
        "The polite, everyday verb for eating (also used for taking medicine). തിന്നുക (thinnuka) also means eat but sounds blunt for people's meals; ഉണ്ണുക (unnuka) means to eat a rice meal.",
    },
    drink: {
      script: "കുടിക്കുക",
      roman: "kudikkuka",
      notes: 'Past കുടിച്ചു (kudichchu). Tea and coffee are "drunk" just like in English.',
    },
    see: {
      script: "കാണുക",
      roman: "kaanuka",
      notes:
        'Past കണ്ടു (kandu, saw). Also "to meet": നാളെ കാണാം (naale kaanaam, see you tomorrow). "To look" is നോക്കുക (nokkuka).',
    },
    give: {
      script: "കൊടുക്കുക",
      roman: "kodukkuka",
      notes:
        'Malayalam has two verbs for give: കൊടുക്കുക (kodukkuka) = give to someone else, തരുക (tharuka) = give to me/us. So "give me" is തരൂ (tharoo), never കൊടുക്കൂ.',
    },
    take: {
      script: "എടുക്കുക",
      roman: "edukkuka",
      notes:
        "To pick up / take. എടുക്കാം (edukkaam) = I'll take it. To receive or buy is വാങ്ങുക (vaanguka).",
    },
    doVerb: {
      script: "ചെയ്യുക",
      roman: "cheyyuka",
      notes:
        "Combines with nouns and English words to make verbs: ജോലി ചെയ്യുക (joli cheyyuka, to work), മിസ് ചെയ്യുക (miss cheyyuka, to miss).",
    },
    // First words › This, that & questions (lesson "this-and-that")
    this: {
      script: "ഇത്",
      roman: "ithu",
      notes:
        'ഇത് (ithu) is "this (thing)" standing alone. Before a noun use ഈ (ee): ഈ പുസ്തകം (ee pusthakam, this book).',
    },
    that: {
      script: "ആ",
      roman: "aa",
      notes:
        'ആ (aa) is "that" before a noun: ആ വീട് (aa veedu, that house). Standing alone, "that (thing)" is അത് (athu), which is also the word for "it": അത് എന്താണ്? (athu enthaanu?, what is that?).',
    },
    here: {
      script: "ഇവിടെ",
      roman: "ivide",
      notes: '"This way / to here" is ഇങ്ങോട്ട് (ingottu).',
    },
    there: {
      script: "അവിടെ",
      roman: "avide",
      notes: '"That way / to there" is അങ്ങോട്ട് (angottu).',
    },
    what: {
      script: "എന്ത്",
      roman: "enthu",
      notes:
        'With ആണ് it becomes എന്താണ് (enthaanu, what is it?); in casual speech എന്താ (enthaa). എന്താ? alone also means "pardon? / what happened?".',
    },
    who: {
      script: "ആര്",
      roman: "aaru",
      notes:
        "Same romanization as ആറ് (aaru, six) but spelt with a different r. ആരാണ്? (aaraanu?) = who is it?",
    },
    whatIsThis: {
      words: [
        ["ഇത്", "ithu"],
        ["എന്താണ്?", "enthaanu?"],
      ],
      notes: 'Literally "this what-is?". Casual: ഇതെന്താ? (ithenthaa?).',
    },
    whoIsThis: {
      words: [
        ["ഇത്", "ithu"],
        ["ആരാണ്?", "aaraanu?"],
      ],
      notes:
        "Casual: ഇതാരാ? (ithaaraa?). Used both pointing at a person and when looking at a photo.",
    },
    thisIsWater: {
      words: [
        ["ഇത്", "ithu"],
        ["വെള്ളമാണ്", "vellamaanu"],
      ],
      blank: 1,
      notes: "ആണ് (aanu, is) joins onto the noun: വെള്ളം + ആണ് → വെള്ളമാണ് (vellamaanu).",
    },
    // Introducing yourself › My name is… (lesson "my-name")
    name: {
      script: "പേര്",
      roman: "peru",
      notes: 'The ഏ is long but Vachan writes it simply "e".',
    },
    iPronoun: {
      script: "ഞാൻ",
      roman: "njaan",
      notes:
        'Starts with the nasal ഞ (nj), like the "ny" in canyon. With endings: എന്നെ (enne, me), എനിക്ക് (enikku, to me), എന്റെ (ente, my).',
    },
    youFormal: {
      script: "നിങ്ങൾ",
      roman: "ningal",
      notes:
        'Polite (and plural) "you", safe with strangers and elders. നീ (nee) is casual — for friends, younger people and children. താങ്കൾ (thaankal) is very formal (speeches, letters). With elders many people avoid pronouns altogether and use a title like ചേട്ടൻ (chettan) or സാർ (saar).',
    },
    my: {
      script: "എന്റെ",
      roman: "ente",
      notes: 'ന്റ is said "nt". Comes before the noun: എന്റെ വീട് (ente veedu, my house).',
    },
    yourFormal: {
      script: "നിങ്ങളുടെ",
      roman: "ningalude",
      notes: "Casual: നിന്റെ (ninte). Very formal: താങ്കളുടെ (thaankalude).",
    },
    myNameIs: {
      words: [
        ["എന്റെ", "ente"],
        ["പേര്", "peru"],
        ["ആശ", "Asha"],
      ],
      blank: 1,
      notes:
        'Literally "my name Asha" — "is" can be left out. Fuller forms: എന്റെ പേര് ആശ എന്നാണ് (ente peru Asha ennaanu, my name is (called) Asha). You can also simply say ഞാൻ ആശ (njaan Asha, I\'m Asha).',
    },
    whatIsYourName: {
      words: [
        ["നിങ്ങളുടെ", "ningalude"],
        ["പേര്", "peru"],
        ["എന്താണ്?", "enthaanu?"],
      ],
      notes:
        "Casual, to a child or friend: നിന്റെ പേര് എന്താ? (ninte peru enthaa?). Very polite: താങ്കളുടെ പേര് എന്താണ്? (thaankalude peru enthaanu?).",
    },
    // Introducing yourself › How are you? (lesson "how-are-you")
    howAreYou: {
      words: [
        ["നിങ്ങൾക്ക്", "ningalkku"],
        ["സുഖമാണോ?", "sukhamaano?"],
      ],
      blank: 1,
      notes:
        'Literally "to you, is it well-being?" — feelings and states take the "to" form (dative). Short: സുഖമാണോ? (sukhamaano?). Casual: നിനക്ക് സുഖമാണോ? (ninakku sukhamaano?) or സുഖമല്ലേ? (sukhamalle?, you\'re well, aren\'t you?).',
    },
    iAmFine: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["സുഖമാണ്", "sukhamaanu"],
      ],
      blank: 1,
      notes:
        'Literally "to me (there) is well-being". Short answer: സുഖം (sukham). Also common: കുഴപ്പമില്ല (kuzhappamilla, not bad / no problem).',
    },
    andYou: {
      words: [["നിങ്ങൾക്കോ?", "ningalkko?"]],
      notes: '-ഓ (-o) on the pronoun turns it into "and you?". Casual: നിനക്കോ? (ninakko?).',
    },
    veryGood: {
      words: [
        ["വളരെ", "valare"],
        ["നല്ലത്", "nallathu"],
      ],
      blank: 1,
      notes: "Casual praise: നല്ലതാ (nallathaa), or the slang അടിപൊളി (adipoli, awesome).",
    },
    iAmAlsoFine: {
      words: [
        ["എനിക്കും", "enikkum"],
        ["സുഖമാണ്", "sukhamaanu"],
      ],
      blank: 0,
      notes: '-ഉം (-um) means "also / too": എനിക്ക് (enikku) → എനിക്കും (enikkum, to me too).',
    },
    // Introducing yourself › Where are you from? (lesson "where-from")
    whereAreYouFrom: {
      words: [
        ["നിങ്ങൾ", "ningal"],
        ["എവിടെ", "evide"],
        ["നിന്നാണ്?", "ninnaanu?"],
      ],
      blank: 2,
      notes:
        "Very common Kerala alternative: നിങ്ങളുടെ നാട് എവിടെയാണ്? (ningalude naadu evideyaanu?, where is your native place?). നാട് (naadu) means hometown / homeland.",
    },
    iAmFromIndia: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഇന്ത്യയിൽ", "Inthyayil"],
        ["നിന്നാണ്", "ninnaanu"],
      ],
      blank: 1,
      notes:
        '-ഇൽ നിന്ന് (-il ninnu) = "from"; with ആണ് it becomes നിന്നാണ് (ninnaanu). Same pattern: ഞാൻ കൊച്ചിയിൽ നിന്നാണ് (njaan Kochiyil ninnaanu, I\'m from Kochi).',
    },
    india: {
      script: "ഇന്ത്യ",
      roman: "Inthya",
      notes:
        "The formal/Sanskrit name ഭാരതം (bhaaratham) is also used, especially in writing and songs.",
    },
    city: {
      script: "നഗരം",
      roman: "nagaram",
      notes:
        'In speech "town" ടൗൺ (town) is very common: ടൗണിൽ പോകുന്നു (townil pokunnu, going to town).',
    },
    village: {
      script: "ഗ്രാമം",
      roman: "graamam",
      notes:
        "Malayalis more often say നാട് (naadu, home place / countryside): നാട്ടിൽ പോകുന്നു (naattil pokunnu, going home to my native place).",
    },
    country: {
      script: "രാജ്യം",
      roman: "raajyam",
      notes: 'നാട് (naadu) can also mean "land / homeland".',
    },
    whereDoYouLive: {
      words: [
        ["നിങ്ങൾ", "ningal"],
        ["എവിടെയാണ്", "evideyaanu"],
        ["താമസിക്കുന്നത്?", "thaamasikkunnathu?"],
      ],
      blank: 2,
      notes:
        'Literally "where is it that you live?" — the ആണ് … -ത് pattern focuses on the question word. Casual: നീ എവിടെയാ താമസം? (nee evideyaa thaamasam?).',
    },
    iLiveInCity: {
      words: [
        ["ഞാൻ", "njaan"],
        ["കൊച്ചിയിലാണ്", "Kochiyilaanu"],
        ["താമസിക്കുന്നത്", "thaamasikkunnathu"],
      ],
      meaning: "I live in Kochi.",
      blank: 1,
      notes:
        'Literally "it is in Kochi that I live". Swap in other cities: തിരുവനന്തപുരത്താണ് (Thiruvananthapurathaanu), കോഴിക്കോട്ടാണ് (Kozhikkottaanu), തൃശ്ശൂരിലാണ് (Thrissurilaanu).',
    },
    // Introducing yourself › Nice to meet you (lesson "nice-to-meet-you")
    niceToMeetYou: {
      words: [
        ["നിങ്ങളെ", "ningale"],
        ["കണ്ടതിൽ", "kandathil"],
        ["സന്തോഷം", "santhosham"],
      ],
      blank: 2,
      notes:
        'Literally "happiness in having seen you". Reply: എനിക്കും സന്തോഷം (enikkum santhosham, me too). It is a little formal; casually people just smile and say "nice to meet you".',
    },
    iAmAStudent: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഒരു", "oru"],
        ["വിദ്യാർത്ഥിയാണ്", "vidyaarthiyaanu"],
      ],
      blank: 2,
      notes:
        'A woman can say വിദ്യാർത്ഥിനിയാണ് (vidyaarthiniyaanu), though വിദ്യാർത്ഥി is fine for anyone. In speech "student" is very common: ഞാൻ ഒരു സ്റ്റുഡന്റ് ആണ് (njaan oru student aanu).',
    },
    iAmLearningLanguage: {
      words: [
        ["ഞാൻ", "njaan"],
        ["മലയാളം", "malayaalam"],
        ["പഠിക്കുകയാണ്", "padikkukayaanu"],
      ],
      meaning: "I am learning Malayalam.",
      blank: 1,
      notes:
        '-ഉകയാണ് (-ukayaanu) = "am/is/are …ing" right now. മലയാളം is spelt with ള (retroflex l), not ഴ.',
    },
    iSpeakALittle: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["കുറച്ച്", "kurachchu"],
        ["മലയാളം", "malayaalam"],
        ["അറിയാം", "ariyaam"],
      ],
      meaning: "I speak a little Malayalam.",
      accept: ["I know a little Malayalam"],
      blank: 1,
      notes:
        'Literally "to me a little Malayalam is known" — the natural way to say you speak a language. Also: ഞാൻ കുറച്ച് മലയാളം സംസാരിക്കും (njaan kurachchu malayaalam samsaarikkum).',
    },
    student: {
      script: "വിദ്യാർത്ഥി",
      roman: "vidyaarthi",
      notes:
        'The English "student" is very common in speech. A schoolchild is often just കുട്ടി (kutti).',
    },
    teacher: {
      script: "അധ്യാപകൻ",
      roman: "adhyaapakan",
      notes:
        "Formal word (female: അധ്യാപിക, adhyaapika). In real life students say ടീച്ചർ (teacher), especially for women, and സാർ (saar) for men — also as a form of address.",
    },
    // Introducing yourself › I don't understand (lesson "understanding")
    iUnderstand: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["മനസ്സിലായി", "manassilaayi"],
      ],
      blank: 1,
      notes:
        'Literally "it has come into my mind" — Malayalam uses the past form here. Short: മനസ്സിലായി (manassilaayi).',
    },
    iDontUnderstand: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["മനസ്സിലായില്ല", "manassilaayilla"],
      ],
      blank: 1,
      notes:
        'Literally "it did not come into my mind". To ask "did you understand?": മനസ്സിലായോ? (manassilaayo?).',
    },
    pleaseRepeat: {
      words: [
        ["ഒന്നുകൂടി", "onnukoodi"],
        ["പറയാമോ?", "parayaamo?"],
      ],
      blank: 0,
      accept: ["Can you say it again?", "Could you say it once more?"],
      notes:
        'Literally "could you say (it) once more?". -ആമോ? (-aamo?) makes a soft request. A quick "pardon?" is എന്താ? (enthaa?).',
    },
    speakSlowly: {
      words: [
        ["കുറച്ച്", "kurachchu"],
        ["പതുക്കെ", "pathukke"],
        ["പറയാമോ?", "parayaamo?"],
      ],
      blank: 1,
      accept: ["Could you speak a little slowly?"],
      notes:
        'Literally "could you say it a little slowly?". More formal: ദയവായി പതുക്കെ സംസാരിക്കൂ (dayavaayi pathukke samsaarikkoo).',
    },
    whatDoesThisMean: {
      words: [
        ["ഇതിന്റെ", "ithinte"],
        ["അർത്ഥം", "arththam"],
        ["എന്താണ്?", "enthaanu?"],
      ],
      blank: 1,
      notes: 'Literally "what is the meaning of this?".',
    },
    doYouSpeakEnglish: {
      words: [
        ["നിങ്ങൾക്ക്", "ningalkku"],
        ["ഇംഗ്ലീഷ്", "ingleesh"],
        ["അറിയാമോ?", "ariyaamo?"],
      ],
      blank: 2,
      notes:
        'Literally "is English known to you?" — Malayalam asks whether you know a language rather than speak it.',
    },
    howDoYouSay: {
      words: [
        ["ഇത്", "ithu"],
        ["മലയാളത്തിൽ", "malayaalathil"],
        ["എങ്ങനെ", "engane"],
        ["പറയും?", "parayum?"],
      ],
      meaning: "How do you say this in Malayalam?",
      blank: 1,
      notes:
        'Literally "this in Malayalam how (does one) say?". For a word: ഇതിന് മലയാളത്തിൽ എന്താ പറയുക? (ithinu malayaalathil enthaa parayuka?).',
    },
    // Family & people › Parents & children (lesson "parents-children")
    mother: {
      script: "അമ്മ",
      roman: "amma",
      notes:
        "Used across Kerala. Christian families also say അമ്മച്ചി (ammachchi), Muslim families ഉമ്മ (umma).",
    },
    father: {
      script: "അച്ഛൻ",
      roman: "achchhan",
      notes:
        'Common in Hindu families. Christian families often say അപ്പൻ (appan) or അപ്പച്ചൻ (appachchan); Muslim families ഉപ്പ (uppa) or ബാപ്പ (baappa). Many children today say "pappa".',
    },
    parents: {
      script: "മാതാപിതാക്കൾ",
      roman: "maathaapithaakkal",
      notes:
        "Formal word. In speech people say അച്ഛനും അമ്മയും (achchhanum ammayum, father and mother).",
    },
    son: {
      script: "മകൻ",
      roman: "makan",
      notes: "Parents call a son മോനേ (mone), which is also used affectionately for any boy.",
    },
    daughter: {
      script: "മകൾ",
      roman: "makal",
      notes: "Parents call a daughter മോളേ (mole), also used affectionately for any girl.",
    },
    child: {
      script: "കുട്ടി",
      roman: "kutti",
      notes:
        'Also "kid" in general. A baby is കുഞ്ഞ് (kunju); one\'s own children are മക്കൾ (makkal).',
    },
    family: {
      script: "കുടുംബം",
      roman: "kudumbam",
      notes:
        '"Family" in English is also common: ഫാമിലി (family). Your household people are വീട്ടുകാർ (veettukaar).',
    },
    // Family & people › Brothers, sisters & partners (lesson "siblings")
    elderBrother: {
      script: "ചേട്ടൻ",
      roman: "chettan",
      notes:
        "Also used politely for any older man (a shopkeeper, an auto driver): ചേട്ടാ! (chetta!). North Kerala: ഏട്ടൻ (ettan); Muslim families: ഇക്ക (ikka); around Thiruvananthapuram also അണ്ണൻ (annan).",
    },
    youngerBrother: {
      script: "അനിയൻ",
      roman: "aniyan",
      notes:
        "Also അനുജൻ (anujan), slightly more formal. Younger siblings are called by name, not by the kinship word.",
    },
    elderSister: {
      script: "ചേച്ചി",
      roman: "chechi",
      notes:
        "Also the polite way to address any older woman: ചേച്ചീ! (chechee!). North Kerala: ഏച്ചി (echi); Muslim families: ഇത്ത (itha).",
    },
    youngerSister: {
      script: "അനിയത്തി",
      roman: "aniyathi",
      notes: "Also അനുജത്തി (anujathi). Called by name in person.",
    },
    husband: {
      script: "ഭർത്താവ്",
      roman: "bharthaavu",
      notes:
        'Formal-neutral. Women often say "husband" in English or എന്റെ കെട്ട്യോൻ (ente kettyon, colloquial, "the one who tied (the knot) with me").',
    },
    wife: {
      script: "ഭാര്യ",
      roman: "bhaarya",
      notes:
        'Neutral word. Colloquial: എന്റെ കെട്ട്യോൾ (ente kettyol); English "wife" is common too.',
    },
    // Family & people › Grandparents & relatives (lesson "grandparents")
    grandfatherPaternal: {
      script: "അച്ഛച്ഛൻ",
      roman: "achchhachchhan",
      notes:
        'Literally "father\'s father". Used in many (especially central and north Kerala Hindu) families. The general word for any grandfather is മുത്തച്ഛൻ (muthachchhan) or, in the south, അപ്പൂപ്പൻ (appooppan).',
    },
    grandmotherPaternal: {
      script: "അച്ഛമ്മ",
      roman: "achchhamma",
      notes:
        'Literally "father\'s mother". The general word for grandmother is മുത്തശ്ശി (muthashshi) or, in the south, അമ്മൂമ്മ (ammoomma). Christian families: വല്യമ്മച്ചി (valyammachchi).',
    },
    grandfatherMaternal: {
      script: "അമ്മച്ഛൻ",
      roman: "ammachchhan",
      notes:
        'Literally "mother\'s father". Many families simply use മുത്തച്ഛൻ (muthachchhan) or അപ്പൂപ്പൻ (appooppan) for both grandfathers; to be exact you can say അമ്മയുടെ അച്ഛൻ (ammayude achchhan).',
    },
    grandmotherMaternal: {
      script: "അമ്മമ്മ",
      roman: "ammamma",
      notes:
        'Literally "mother\'s mother" — very common. Elsewhere മുത്തശ്ശി (muthashshi) or അമ്മൂമ്മ (ammoomma) covers both grandmothers.',
    },
    uncleMaternal: {
      script: "അമ്മാവൻ",
      roman: "ammaavan",
      notes:
        "Mother's brother — traditionally an important figure in Kerala families. Father's elder brother is വല്യച്ഛൻ (valyachchhan), father's younger brother ചെറിയച്ഛൻ (cheriyachchhan) or കൊച്ചച്ഛൻ (kochchachchhan).",
    },
    auntPaternal: {
      script: "അമ്മായി",
      roman: "ammaayi",
      notes:
        "Father's sister; the same word is used for mother's brother's wife. Mother's sisters are വല്യമ്മ (valyamma, elder) and ചെറിയമ്മ (cheriyamma, younger).",
    },
    // Family & people › People (lesson "people")
    man: {
      script: "പുരുഷൻ",
      roman: "purushan",
      notes:
        "Rather formal. In speech: ആൾ (aal, person) or ആണുങ്ങൾ (aanungal, men). A man is politely addressed as ചേട്ടാ (chetta).",
    },
    woman: {
      script: "സ്ത്രീ",
      roman: "sthree",
      notes:
        "Neutral-formal. In speech: പെണ്ണുങ്ങൾ (pennungal, women, casual). A woman is politely addressed as ചേച്ചീ (chechee).",
    },
    boy: {
      script: "ആൺകുട്ടി",
      roman: "aankutti",
      notes: 'Literally "male child". Also പയ്യൻ (payyan, lad, casual).',
    },
    girl: {
      script: "പെൺകുട്ടി",
      roman: "penkutti",
      notes: 'Literally "female child". Used for young women too.',
    },
    friend: {
      script: "സുഹൃത്ത്",
      roman: "suhruthu",
      notes:
        'Standard word. In everyday speech: കൂട്ടുകാരൻ (koottukaaran, male friend), കൂട്ടുകാരി (koottukaari, female friend), or English "friend". Young people say ചങ്ക് (chanku, close buddy).',
    },
    neighbour: {
      script: "അയൽക്കാരൻ",
      roman: "ayalkkaaran",
      notes:
        "Male neighbour; a female neighbour is അയൽക്കാരി (ayalkkaari). Neighbours collectively: അയൽക്കാർ (ayalkkaar).",
    },
    person: {
      script: "ആൾ",
      roman: "aal",
      notes: "Everyday word. Formal: വ്യക്തി (vyakthi). ഒരാൾ (oraal) = one person / someone.",
    },
    doctor: {
      script: "ഡോക്ടർ",
      roman: "doctor",
      notes:
        "Everyone uses the English word. വൈദ്യൻ (vaidyan) is a traditional (Ayurvedic) physician.",
    },
    // Family & people › Describing people (lesson "describing-people")
    tall: {
      script: "ഉയരമുള്ള",
      roman: "uyaramulla",
      notes:
        'Literally "having height". Everyday: പൊക്കമുള്ള (pokkamulla). "He is tall": അവന് നല്ല പൊക്കമുണ്ട് (avanu nalla pokkamundu).',
    },
    short: {
      script: "ഉയരം കുറഞ്ഞ",
      roman: "uyaram kuranja",
      notes:
        'Literally "low in height". Everyday: പൊക്കം കുറഞ്ഞ (pokkam kuranja). Avoid കുള്ളൻ (kullan, dwarf) — rude.',
    },
    good: {
      script: "നല്ല",
      roman: "nalla",
      notes:
        'Before a noun: നല്ല കുട്ടി (nalla kutti, good child). Standing alone "(it is) good" is നല്ലത് (nallathu) or നല്ലതാണ് (nallathaanu).',
    },
    beautiful: {
      script: "ഭംഗിയുള്ള",
      roman: "bhangiyulla",
      notes:
        'Literally "having beauty" — for places and things. For people: സുന്ദരി (sundari, beautiful woman), സുന്ദരൻ (sundaran, handsome man). "How beautiful!" — എന്ത് ഭംഗി! (enthu bhangi!).',
    },
    young: {
      script: "ചെറുപ്പമായ",
      roman: "cheruppamaaya",
      notes: "From ചെറുപ്പം (cheruppam, youth). A young man is ചെറുപ്പക്കാരൻ (cheruppakkaaran).",
    },
    old: {
      script: "പ്രായമായ",
      roman: "praayamaaya",
      notes:
        'For people: literally "aged". For things use പഴയ (pazhaya, old): പഴയ വീട് (pazhaya veedu, old house).',
    },
    kind: {
      script: "ദയയുള്ള",
      roman: "dayayulla",
      notes:
        "Everyday praise for a kind person: നല്ല മനസ്സുള്ള ആൾ (nalla manassulla aal, a person with a good heart).",
    },
    thisIsMyMother: {
      words: [
        ["ഇത്", "ithu"],
        ["എന്റെ", "ente"],
        ["അമ്മയാണ്", "ammayaanu"],
      ],
      blank: 2,
      notes:
        "Introducing people with ഇത് (ithu, this) is normal and polite in Malayalam. അമ്മ + ആണ് → അമ്മയാണ് (ammayaanu).",
    },
    heIsMyFriend: {
      words: [
        ["അവൻ", "avan"],
        ["എന്റെ", "ente"],
        ["സുഹൃത്താണ്", "suhruthaanu"],
      ],
      blank: 2,
      notes:
        "അവൻ (avan) is for a man of your age or younger. For an older or respected man use അദ്ദേഹം (addeham) or അവർ (avar). Casual: അവൻ എന്റെ കൂട്ടുകാരനാണ് (avan ente koottukaaranaanu).",
    },
    sheIsMySister: {
      words: [
        ["അവൾ", "aval"],
        ["എന്റെ", "ente"],
        ["ചേച്ചിയാണ്", "chechiyaanu"],
      ],
      blank: 2,
      notes:
        'അവൾ (aval) is fine for your sister. For an older woman you are not close to, the respectful "she" is അവർ (avar).',
    },
    myFatherIsADoctor: {
      words: [
        ["എന്റെ", "ente"],
        ["അച്ഛൻ", "achchhan"],
        ["ഒരു", "oru"],
        ["ഡോക്ടറാണ്", "doctoraanu"],
      ],
      blank: 3,
      notes:
        'ഒരു (oru, one) works like English "a". The verb ആണ് (aanu) is the same for every person.',
    },
    // Family & people › Family review (lesson "family-review")
    howManyBrothers: {
      words: [
        ["നിങ്ങൾക്ക്", "ningalkku"],
        ["എത്ര", "ethra"],
        ["സഹോദരന്മാരുണ്ട്?", "sahodaranmaarundu?"],
      ],
      blank: 2,
      notes:
        'Literally "to you how many brothers are there?" — "to have" uses the dative (-ക്ക്) + ഉണ്ട് (undu). സഹോദരൻ (sahodaran) is the general word for brother; in answers people specify ചേട്ടൻ (chettan) or അനിയൻ (aniyan).',
    },
    iHaveOneBrother: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ഒരു", "oru"],
        ["അനിയനുണ്ട്", "aniyanundu"],
      ],
      blank: 2,
      notes:
        'Literally "to me one younger brother is there". "I have no brother": എനിക്ക് സഹോദരന്മാരില്ല (enikku sahodaranmaarilla).',
    },
    iHaveTwoSisters: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["രണ്ട്", "randu"],
        ["സഹോദരിമാരുണ്ട്", "sahodarimaarundu"],
      ],
      blank: 2,
      notes:
        "സഹോദരി (sahodari) = sister; plural with -മാർ (-maar). Natural specific answer: എനിക്ക് ഒരു ചേച്ചിയും ഒരു അനിയത്തിയും ഉണ്ട് (enikku oru chechiyum oru aniyathiyum undu).",
    },
    // Food & drinks › Everyday food (lesson "food-staples")
    rice: {
      script: "ചോറ്",
      roman: "choru",
      notes:
        "Cooked rice — the heart of every Kerala meal (often the fat red Kerala matta rice). Uncooked rice is അരി (ari).",
    },
    roti: {
      script: "ചപ്പാത്തി",
      roman: "chappaathi",
      notes:
        'Kerala calls wheat flatbread ചപ്പാത്തി (chappaathi); "roti" is not a Malayalam word. The flaky Kerala favourite is പൊറോട്ട (porotta).',
    },
    dal: {
      script: "പരിപ്പ്",
      roman: "parippu",
      notes:
        "Lentils; പരിപ്പുകറി (parippukari) is the dal curry served first at a sadya with ghee.",
    },
    vegetables: {
      script: "പച്ചക്കറി",
      roman: "pachchakkari",
      notes:
        'Literally "green curry-stuff". Also means "vegetarian": പച്ചക്കറി ഭക്ഷണം (pachchakkari bhakshanam, veg food).',
    },
    curd: {
      script: "തൈര്",
      roman: "thairu",
      notes: "Curd/yoghurt; തൈര് സാദം (thairu saadam) is curd rice.",
    },
    salt: {
      script: "ഉപ്പ്",
      roman: "uppu",
      notes:
        '"Not enough salt": ഉപ്പ് കുറവാണ് (uppu kuravaanu). Don\'t confuse with ഉപ്പ (uppa), "father" in some Muslim families.',
    },
    sugar: {
      script: "പഞ്ചസാര",
      roman: "panchasaara",
      notes: "Jaggery, used in many Kerala sweets, is ശർക്കര (sharkkara).",
    },
    sweets: {
      script: "മധുരപലഹാരം",
      roman: "madhurapalahaaram",
      notes:
        'Literally "sweet snack". People also just say മധുരം (madhuram, something sweet) or "sweets". Kerala\'s signature sweet dish is പായസം (paayasam).',
    },
    // Food & drinks › Drinks (lesson "drinks")
    tea: {
      script: "ചായ",
      roman: "chaaya",
      notes:
        "Kerala tea is milky and sweet; black tea is കട്ടൻ ചായ (kattan chaaya). A tea shop is ചായക്കട (chaayakkada).",
    },
    coffee: {
      script: "കാപ്പി",
      roman: "kaappi",
      notes:
        'Black coffee: കട്ടൻ കാപ്പി (kattan kaappi). "Coffee" in English is also used in cafés.',
    },
    milk: {
      script: "പാൽ",
      roman: "paal",
      notes: "Ends in the chillu letter ൽ. With endings: പാലിൽ (paalil, in milk).",
    },
    juice: {
      script: "ജ്യൂസ്",
      roman: "juice",
      notes:
        'English loanword (said "jyoos"). Lime juice is നാരങ്ങാവെള്ളം (naarangaavellam, "lime water") — the classic Kerala cooler.',
    },
    buttermilk: {
      script: "മോര്",
      roman: "moru",
      notes:
        "Spiced buttermilk with ginger, chilli and curry leaves is സംഭാരം (sambhaaram), served at weddings and in summer.",
    },
    coconutWater: {
      script: "ഇളനീർ",
      roman: "ilaneer",
      notes:
        'Literally "tender water". In everyday Kerala speech people ask for കരിക്ക് (karikku, tender coconut) and drink it straight from the shell.',
    },
    // Food & drinks › Fruits, vegetables & more (lesson "fruits-vegetables")
    fruit: {
      script: "പഴം",
      roman: "pazham",
      notes:
        'ഴ is "zh". In Kerala പഴം (pazham) on its own usually means a banana; fruits in general are പഴങ്ങൾ (pazhangal).',
    },
    banana: {
      script: "വാഴപ്പഴം",
      roman: "vaazhappazham",
      notes:
        'Literally "plantain fruit"; in speech just പഴം (pazham). Kerala\'s famous long banana is ഏത്തപ്പഴം (ethappazham, nendran); unripe banana for cooking is ഏത്തക്കായ (ethakkaaya).',
    },
    mango: {
      script: "മാമ്പഴം",
      roman: "maampazham",
      notes:
        "Ripe mango. The fruit in general (and raw mango) is മാങ്ങ (maanga) — at the market people ask for മാങ്ങ.",
    },
    apple: {
      script: "ആപ്പിൾ",
      roman: "apple",
      notes: 'English loanword, said with a long "aa" (aappil).',
    },
    onion: {
      script: "ഉള്ളി",
      roman: "ulli",
      notes:
        "Large onions are സവാള (savaala); small red shallots, used in most Kerala curries, are ചെറിയ ഉള്ളി (cheriya ulli).",
    },
    tomato: {
      script: "തക്കാളി",
      roman: "thakkaali",
      notes: 'The everyday word; "tomato" in English is also understood.',
    },
    potato: {
      script: "ഉരുളക്കിഴങ്ങ്",
      roman: "urulakkizhangu",
      notes:
        'Literally "round tuber". Many people simply say "potato". Kerala\'s favourite tuber is കപ്പ (kappa, tapioca).',
    },
    egg: {
      script: "മുട്ട",
      roman: "mutta",
      notes: "Egg curry: മുട്ടക്കറി (muttakkari) — a classic with appam.",
    },
    fish: {
      script: "മീൻ",
      roman: "meen",
      notes:
        "Everyday word (formal: മത്സ്യം, malsyam). Fish curry, മീൻകറി (meenkari), is central to Kerala food.",
    },
    chicken: {
      script: "ചിക്കൻ",
      roman: "chicken",
      notes:
        "As food, everyone says ചിക്കൻ (chicken). The bird is കോഴി (kozhi); chicken meat in standard Malayalam is കോഴിയിറച്ചി (kozhiyirachchi).",
    },
    // Food & drinks › Hungry & thirsty (lesson "hungry-thirsty")
    hungry: {
      script: "വിശപ്പ്",
      roman: "vishappu",
      notes:
        'This is the noun "hunger". To say "I am hungry" Malayalam uses the dative: എനിക്ക് വിശക്കുന്നു (enikku vishakkunnu) or എനിക്ക് വിശപ്പുണ്ട് (enikku vishappundu).',
    },
    thirsty: {
      script: "ദാഹം",
      roman: "daaham",
      notes:
        'The noun "thirst". "I am thirsty": എനിക്ക് ദാഹിക്കുന്നു (enikku daahikkunnu) or എനിക്ക് ദാഹമുണ്ട് (enikku daahamundu).',
    },
    tasty: {
      script: "രുചിയുള്ള",
      roman: "ruchiyulla",
      notes:
        'From രുചി (ruchi, taste). "It\'s tasty": നല്ല രുചിയുണ്ട് (nalla ruchiyundu). Casual praise: അടിപൊളി (adipoli) or കിടിലൻ (kidilan).',
    },
    spicy: {
      script: "എരിവ്",
      roman: "erivu",
      notes:
        'Chilli heat (noun). "Spicy food": എരിവുള്ള ഭക്ഷണം (erivulla bhakshanam). "Less spicy, please": എരിവ് കുറച്ച് (erivu kurachchu).',
    },
    sweetTaste: {
      script: "മധുരം",
      roman: "madhuram",
      notes: 'Also means "something sweet": മധുരം കഴിക്കൂ (madhuram kazhikkoo, have a sweet).',
    },
    iAmHungry: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["വിശക്കുന്നു", "vishakkunnu"],
      ],
      blank: 1,
      notes:
        'Literally "to me (it) hungers" — a dative construction: the person feeling it takes -ക്ക് (-kku). Never ഞാൻ വിശക്കുന്നു. Casual: എനിക്ക് വിശക്കുന്നുണ്ട് (enikku vishakkunnundu).',
    },
    iAmThirsty: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ദാഹിക്കുന്നു", "daahikkunnu"],
      ],
      blank: 1,
      notes:
        'Dative again: "to me (it) thirsts". Also എനിക്ക് ദാഹമുണ്ട് (enikku daahamundu, to me there is thirst).',
    },
    iWantWater: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["വെള്ളം", "vellam"],
        ["വേണം", "venam"],
      ],
      blank: 1,
      notes:
        'Literally "to me water is needed". "I don\'t want": വേണ്ട (venda) — എനിക്ക് വെള്ളം വേണ്ട (enikku vellam venda).',
    },
    iWantTea: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ചായ", "chaaya"],
        ["വേണം", "venam"],
      ],
      blank: 1,
      notes:
        "At a tea shop you'd just say ഒരു ചായ (oru chaaya, one tea), often with ചേട്ടാ (chetta) in front.",
    },
    iWantFood: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ഭക്ഷണം", "bhakshanam"],
        ["വേണം", "venam"],
      ],
      blank: 1,
      notes:
        "At home you'd more naturally say എനിക്ക് ചോറ് വേണം (enikku choru venam, I want rice/my meal).",
    },
    iDontEatMeat: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഇറച്ചി", "irachchi"],
        ["കഴിക്കില്ല", "kazhikkilla"],
      ],
      blank: 1,
      notes:
        'Literally "I will not eat meat" — the negative future describes habits. ഇറച്ചി (irachchi) is the everyday word (formal മാംസം, maamsam). Also: ഞാൻ വെജിറ്റേറിയൻ ആണ് (njaan vegetarian aanu). Note that in Kerala "non-veg" often includes fish.',
    },
    // Food & drinks › Ordering food (lesson "ordering-food")
    breakfast: {
      script: "പ്രാതൽ",
      roman: "praathal",
      notes:
        'Also രാവിലത്തെ ഭക്ഷണം (raavilathe bhakshanam). Most people just say "breakfast". Typical: puttu, appam, idiyappam, dosa.',
    },
    lunch: {
      script: "ഉച്ചഭക്ഷണം",
      roman: "uchchabhakshanam",
      notes:
        'Literally "noon food". The traditional rice lunch is ഊണ് (oonu); restaurants advertise ഊണ് റെഡി (oonu ready, meals ready). People say ഊണ് കഴിച്ചോ? (oonu kazhichcho?, had lunch?).',
    },
    dinner: {
      script: "അത്താഴം",
      roman: "athaazham",
      notes: 'Also രാത്രി ഭക്ഷണം (raathri bhakshanam, night food). "Dinner" in English is common.',
    },
    giveMeOneTea: {
      words: [
        ["ഒരു", "oru"],
        ["ചായ", "chaaya"],
        ["തരൂ", "tharoo"],
      ],
      blank: 1,
      notes:
        "തരൂ (tharoo) = please give (to me). At a tea shop: ചേട്ടാ, ഒരു ചായ (chetta, oru chaaya). Casual to a friend: ഒരു ചായ താ (oru chaaya thaa).",
    },
    whatWouldYouLike: {
      words: [
        ["നിങ്ങൾക്ക്", "ningalkku"],
        ["എന്താണ്", "enthaanu"],
        ["വേണ്ടത്?", "vendathu?"],
      ],
      blank: 2,
      notes:
        'Literally "what is it that is needed to you?". Waiters often say just എന്താ വേണ്ടേ? (enthaa vende?) or എന്താ കഴിക്കാൻ? (enthaa kazhikkaan?, what to eat?).',
    },
    billPlease: {
      words: [
        ["ബിൽ", "bill"],
        ["തരൂ", "tharoo"],
      ],
      notes:
        'Literally "give the bill". Softer: ബിൽ തരാമോ? (bill tharaamo?). Also ബിൽ എടുക്കൂ (bill edukkoo, make the bill).',
    },
    withoutSugar: {
      words: [
        ["പഞ്ചസാര", "panchasaara"],
        ["ഇടാതെ", "idaathe"],
        ["തരൂ", "tharoo"],
      ],
      blank: 1,
      notes:
        'Literally "give without putting sugar". At a tea shop people also say "വിതൗട്ട്" (vithout, from English "without"): ഒരു ചായ വിതൗട്ട് (oru chaaya vithout).',
    },
    isItSpicy: {
      words: [
        ["ഇതിന്", "ithinu"],
        ["എരിവുണ്ടോ?", "erivundo?"],
      ],
      blank: 1,
      notes:
        'Literally "to this is there spiciness?". Answer: കുറച്ച് എരിവുണ്ട് (kurachchu erivundu, a little spicy) or എരിവില്ല (erivilla, not spicy).',
    },
    itIsVeryTasty: {
      words: [
        ["ഇതിന്", "ithinu"],
        ["നല്ല", "nalla"],
        ["രുചിയുണ്ട്", "ruchiyundu"],
      ],
      blank: 2,
      notes:
        'Literally "this has good taste". Enthusiastic casual: അടിപൊളി ടേസ്റ്റ്! (adipoli taste!). Complimenting the cook matters at a Kerala home.',
    },
    giveMeWater: {
      words: [
        ["കുറച്ച്", "kurachchu"],
        ["വെള്ളം", "vellam"],
        ["തരൂ", "tharoo"],
      ],
      blank: 1,
      notes:
        "കുറച്ച് (kurachchu) = a little / some. Softer: കുറച്ച് വെള്ളം തരാമോ? (kurachchu vellam tharaamo?).",
    },
    oneMorePlease: {
      words: [
        ["ഒന്നുകൂടി", "onnukoodi"],
        ["തരൂ", "tharoo"],
      ],
      blank: 0,
      notes:
        'Literally "give one more". To refuse more food, say മതി (mathi, enough) — hosts in Kerala keep serving until you say it.',
    },
    // Numbers, time & dates › Numbers 1–10 (lesson "numbers-1-10")
    one: {
      script: "ഒന്ന്",
      roman: "onnu",
      notes: "Before a noun it becomes ഒരു (oru): ഒരു ചായ (oru chaaya, one tea / a tea).",
    },
    two: {
      script: "രണ്ട്",
      roman: "randu",
      notes: "Before a noun it stays രണ്ട്: രണ്ട് ചായ (randu chaaya, two teas).",
    },
    three: { script: "മൂന്ന്", roman: "moonnu", notes: "The doubled ന്ന is held: moon-nu." },
    four: { script: "നാല്", roman: "naalu" },
    five: { script: "അഞ്ച്", roman: "anchu", notes: 'ഞ്ച is said "nch".' },
    six: {
      script: "ആറ്",
      roman: "aaru",
      notes: "Spelt with റ; ആര് (aaru, who) is spelt with ര — they sound almost alike.",
    },
    seven: {
      script: "ഏഴ്",
      roman: "ezhu",
      notes: "Uses the special ഴ (zh) sound — tongue curled back, no buzz.",
    },
    eight: { script: "എട്ട്", roman: "ettu" },
    nine: {
      script: "ഒൻപത്",
      roman: "onpathu",
      notes: "Also written ഒമ്പത് (ombathu); both are correct and said similarly.",
    },
    ten: {
      script: "പത്ത്",
      roman: "pathu",
      notes:
        "Phone numbers, prices and times are often said in English digits too, especially by younger people.",
    },
    // Numbers, time & dates › Numbers 11–20 (lesson "numbers-11-20")
    eleven: {
      script: "പതിനൊന്ന്",
      roman: "pathinonnu",
      notes: "11–19 are പതി- (pathi-, ten-) + the unit: പതി + ഒന്ന് = പതിനൊന്ന്.",
    },
    twelve: {
      script: "പന്ത്രണ്ട്",
      roman: "panthrandu",
      notes: "Irregular — learn it separately.",
    },
    thirteen: { script: "പതിമൂന്ന്", roman: "pathimoonnu" },
    fourteen: { script: "പതിനാല്", roman: "pathinaalu" },
    fifteen: { script: "പതിനഞ്ച്", roman: "pathinanchu" },
    sixteen: { script: "പതിനാറ്", roman: "pathinaaru" },
    seventeen: { script: "പതിനേഴ്", roman: "pathinezhu" },
    eighteen: { script: "പതിനെട്ട്", roman: "pathinettu" },
    nineteen: {
      script: "പത്തൊൻപത്",
      roman: "pathonpathu",
      notes: "Also written പത്തൊമ്പത് (pathombathu).",
    },
    twenty: {
      script: "ഇരുപത്",
      roman: "irupathu",
      notes: "21 is ഇരുപത്തിയൊന്ന് (irupathiyonnu): tens + -ഇ- + unit.",
    },
    // Numbers, time & dates › Tens & big numbers (lesson "big-numbers")
    thirty: { script: "മുപ്പത്", roman: "muppathu" },
    forty: { script: "നാൽപത്", roman: "naalpathu", notes: "Also written നാല്പത് (naalpathu)." },
    fifty: { script: "അമ്പത്", roman: "ambathu", notes: "Also written അൻപത് (anpathu)." },
    hundred: {
      script: "നൂറ്",
      roman: "nooru",
      notes:
        'Two hundred is ഇരുനൂറ് (irunooru). Prices are often said in English: "two hundred rupees".',
    },
    thousand: {
      script: "ആയിരം",
      roman: "aayiram",
      notes: "A lakh (100,000) is ലക്ഷം (laksham); a crore (10 million) is കോടി (kodi).",
    },
    howMany: {
      words: [
        ["എത്ര", "ethra"],
        ["എണ്ണം?", "ennam?"],
      ],
      blank: 0,
      notes:
        'Literally "how many pieces?" — used when counting items. എത്ര (ethra) alone means both "how many" and "how much".',
    },
    // Numbers, time & dates › Age & phone numbers (lesson "age-phone")
    age: {
      script: "വയസ്സ്",
      roman: "vayassu",
      notes: "Also പ്രായം (praayam). Asking an older person's age directly can be impolite.",
    },
    year: {
      script: "വർഷം",
      roman: "varsham",
      notes: "Also കൊല്ലം (kollam) in everyday speech: അടുത്ത കൊല്ലം (adutha kollam, next year).",
    },
    howOldAreYou: {
      words: [
        ["നിങ്ങൾക്ക്", "ningalkku"],
        ["എത്ര", "ethra"],
        ["വയസ്സായി?", "vayassaayi?"],
      ],
      blank: 2,
      notes:
        'Literally "to you how many years have become?". To a child: മോന്/മോൾക്ക് എത്ര വയസ്സായി? (monu/molkku ethra vayassaayi?).',
    },
    iAmTwentyYearsOld: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ഇരുപത്", "irupathu"],
        ["വയസ്സായി", "vayassaayi"],
      ],
      blank: 1,
      notes:
        'Dative again: "to me twenty years have become". Also എനിക്ക് ഇരുപത് വയസ്സുണ്ട് (enikku irupathu vayassundu).',
    },
    phoneNumber: {
      script: "ഫോൺ നമ്പർ",
      roman: "phone number",
      notes:
        "Both words are English. Numbers are usually read out digit by digit, often in English.",
    },
    whatIsYourPhoneNumber: {
      words: [
        ["നിങ്ങളുടെ", "ningalude"],
        ["ഫോൺ", "phone"],
        ["നമ്പർ", "number"],
        ["എന്താണ്?", "enthaanu?"],
      ],
      blank: 2,
      notes:
        "Casual: നിന്റെ നമ്പർ എന്താ? (ninte number enthaa?). Also: നമ്പർ ഒന്ന് തരാമോ? (number onnu tharaamo?, could you give me your number?).",
    },
    // Numbers, time & dates › Time of day (lesson "time")
    time: {
      script: "സമയം",
      roman: "samayam",
      notes:
        '"Some time / a while" is നേരം (neram): കുറച്ച് നേരം (kurachchu neram, a little while).',
    },
    now: {
      script: "ഇപ്പോൾ",
      roman: "ippol",
      notes: 'Casual: ഇപ്പോ (ippo). "Right now": ഇപ്പോൾ തന്നെ (ippol thanne).',
    },
    today: { script: "ഇന്ന്", roman: "innu" },
    tomorrow: {
      script: "നാളെ",
      roman: "naale",
      notes: "The day after tomorrow is മറ്റന്നാൾ (mattannaal).",
    },
    yesterday: {
      script: "ഇന്നലെ",
      roman: "innale",
      notes: "The day before yesterday is മിനിഞ്ഞാന്ന് (mininjaannu).",
    },
    morning: {
      script: "രാവിലെ",
      roman: "raavile",
      notes:
        'Means both "morning" and "in the morning": രാവിലെ വരൂ (raavile varoo, come in the morning).',
    },
    afternoon: {
      script: "ഉച്ച",
      roman: "uchcha",
      notes:
        'ഉച്ച (uchcha) is noon / midday; "at noon" is ഉച്ചയ്ക്ക് (uchchaykku). Later afternoon is ഉച്ചകഴിഞ്ഞ് (uchchakazhinju, after noon).',
    },
    evening: {
      script: "വൈകുന്നേരം",
      roman: "vaikunneram",
      notes: "Also വൈകിട്ട് (vaikittu), very common in speech.",
    },
    night: {
      script: "രാത്രി",
      roman: "raathri",
      notes:
        '"At night" is also രാത്രി: രാത്രി വിളിക്കാം (raathri vilikkaam, I\'ll call at night).',
    },
    whatTimeIsIt: {
      words: [
        ["സമയം", "samayam"],
        ["എത്രയായി?", "ethrayaayi?"],
      ],
      blank: 0,
      notes:
        'Literally "how much has the time become?". Also: ഇപ്പോൾ മണി എത്രയായി? (ippol mani ethrayaayi?).',
    },
    itIsFiveOClock: {
      words: [
        ["അഞ്ച്", "anchu"],
        ["മണിയായി", "maniyaayi"],
      ],
      blank: 0,
      notes:
        'മണി (mani, literally "bell") = o\'clock. "At five" is അഞ്ച് മണിക്ക് (anchu manikku). Half past five: അഞ്ചര (anchara).',
    },
    // Numbers, time & dates › Days of the week (lesson "days")
    monday: {
      script: "തിങ്കളാഴ്ച",
      roman: "thinkalaazhcha",
      notes:
        'All days end in -ആഴ്ച (-aazhcha, "week-day"); തിങ്കൾ (thinkal) is the moon. English day names are also widely used, especially by students.',
    },
    tuesday: { script: "ചൊവ്വാഴ്ച", roman: "chovvaazhcha", notes: "ചൊവ്വ (chovva) = Mars." },
    wednesday: { script: "ബുധനാഴ്ച", roman: "budhanaazhcha", notes: "ബുധൻ (budhan) = Mercury." },
    thursday: {
      script: "വ്യാഴാഴ്ച",
      roman: "vyaazhaazhcha",
      notes: "വ്യാഴം (vyaazham) = Jupiter. Two ഴ sounds — good practice.",
    },
    friday: {
      script: "വെള്ളിയാഴ്ച",
      roman: "velliyaazhcha",
      notes: 'വെള്ളി (velli) = Venus (also "silver").',
    },
    saturday: { script: "ശനിയാഴ്ച", roman: "shaniyaazhcha", notes: "ശനി (shani) = Saturn." },
    sunday: { script: "ഞായറാഴ്ച", roman: "njaayaraazhcha", notes: "ഞായർ (njaayar) = the sun." },
    day: {
      script: "ദിവസം",
      roman: "divasam",
      notes: "Also നാൾ (naal) in phrases: കുറെ നാളായി (kure naalaayi, it's been many days).",
    },
    week: { script: "ആഴ്ച", roman: "aazhcha", notes: "അടുത്ത ആഴ്ച (adutha aazhcha) = next week." },
    month: {
      script: "മാസം",
      roman: "maasam",
      notes:
        "Kerala also has its own Malayalam-calendar months (e.g. ചിങ്ങം, chingam, the month of Onam).",
    },
    whatDayIsToday: {
      words: [
        ["ഇന്ന്", "innu"],
        ["ഏത്", "ethu"],
        ["ദിവസമാണ്?", "divasamaanu?"],
      ],
      blank: 2,
      notes:
        'Literally "today which day is it?". Very natural in speech: ഇന്ന് എന്ത് ആഴ്ചയാ? (innu enthu aazhchayaa?).',
    },
    todayIsMonday: {
      words: [
        ["ഇന്ന്", "innu"],
        ["തിങ്കളാഴ്ചയാണ്", "thinkalaazhchayaanu"],
      ],
      blank: 1,
      notes: "ആഴ്ച + ആണ് → ആഴ്ചയാണ് (aazhchayaanu): a -യ- glide joins two vowels.",
    },
    // Daily life › Morning & evening (lesson "routine-verbs")
    wakeUp: {
      script: "എഴുന്നേൽക്കുക",
      roman: "ezhunnelkkuka",
      notes:
        'Literally "to get up". Waking from sleep is also ഉണരുക (unaruka). Parents\' morning call: എഴുന്നേൽക്ക്! (ezhunnelkku!, get up!).',
    },
    sleep: {
      script: "ഉറങ്ങുക",
      roman: "uranguka",
      notes: 'Past ഉറങ്ങി (urangi). "Go to sleep" to a child: ഉറങ്ങിക്കോ (urangikko).',
    },
    bathe: {
      script: "കുളിക്കുക",
      roman: "kulikkuka",
      notes: "Many Malayalis bathe twice a day. Past കുളിച്ചു (kulichchu).",
    },
    cook: {
      script: "പാചകം ചെയ്യുക",
      roman: "paachakam cheyyuka",
      notes:
        'Literally "do cooking" — a bit formal. In daily speech people say ഉണ്ടാക്കുക (undaakkuka, to make): ചോറ് ഉണ്ടാക്കുക (choru undaakkuka), or വെക്കുക (vekkuka): ചോറ് വെക്കുക (choru vekkuka, to cook rice).',
    },
    wash: {
      script: "കഴുകുക",
      roman: "kazhukuka",
      notes: "For hands, dishes and fruit. Washing clothes is അലക്കുക (alakkuka).",
    },
    wear: {
      script: "ഇടുക",
      roman: "iduka",
      notes:
        'Everyday verb for putting on shirts, shoes, etc. (also means "to put"). For a saree or mundu: ഉടുക്കുക (udukkuka). Formal: ധരിക്കുക (dharikkuka).',
    },
    // Daily life › Study, work & play (lesson "activity-verbs")
    study: {
      script: "പഠിക്കുക",
      roman: "padikkuka",
      notes: 'Means both "to study" and "to learn". ഠ is an aspirated retroflex sound.',
    },
    work: {
      script: "ജോലി ചെയ്യുക",
      roman: "joli cheyyuka",
      notes: 'Literally "do work". ജോലി (joli) alone means job/work.',
    },
    read: {
      script: "വായിക്കുക",
      roman: "vaayikkuka",
      notes:
        "Past വായിച്ചു (vaayichchu). Kerala is proud of its reading culture and libraries (വായനശാല, vaayanashaala).",
    },
    write: { script: "എഴുതുക", roman: "ezhuthuka", notes: "Past എഴുതി (ezhuthi)." },
    play: {
      script: "കളിക്കുക",
      roman: "kalikkuka",
      notes:
        "For games and sports. Playing an instrument is വായിക്കുക (vaayikkuka): വീണ വായിക്കുക (veena vaayikkuka, to play the veena).",
    },
    listen: {
      script: "കേൾക്കുക",
      roman: "kelkkuka",
      notes: 'Means both "to hear" and "to listen". Past കേട്ടു (kettu).',
    },
    speak: {
      script: "സംസാരിക്കുക",
      roman: "samsaarikkuka",
      notes:
        'To talk / converse. "To say / tell" is പറയുക (parayuka), used far more often in daily speech.',
    },
    // Daily life › Sit, stand & wait (lesson "movement-verbs")
    sit: {
      script: "ഇരിക്കുക",
      roman: "irikkuka",
      notes: 'Also means "to stay / be": അവിടെ ഇരിക്ക് (avide irikku, stay there).',
    },
    stand: {
      script: "നിൽക്കുക",
      roman: "nilkkuka",
      notes: 'Also "to stop / wait": ഒന്ന് നിൽക്കൂ (onnu nilkkoo, wait a moment).',
    },
    walk: {
      script: "നടക്കുക",
      roman: "nadakkuka",
      notes: 'Also "to happen": എന്ത് നടന്നു? (enthu nadannu?, what happened?).',
    },
    run: {
      script: "ഓടുക",
      roman: "oduka",
      notes:
        "Also used for vehicles running: ബസ് ഓടുന്നില്ല (bus odunnilla, the bus isn't running).",
    },
    wait: {
      script: "കാത്തിരിക്കുക",
      roman: "kaathirikkuka",
      notes:
        "To wait (for a while / for someone). For a short wait, people say ഒന്ന് നിൽക്കൂ (onnu nilkkoo).",
    },
    open: {
      script: "തുറക്കുക",
      roman: "thurakkuka",
      notes: '"Is the shop open?" കട തുറന്നോ? (kada thuranno?).',
    },
    close: {
      script: "അടയ്ക്കുക",
      roman: "adaykkuka",
      notes: 'Also spelt അടക്കുക. "The shop is closed": കട അടച്ചു (kada adachchu).',
    },
    // Daily life › What are you doing? (lesson "what-are-you-doing")
    whatAreYouDoing: {
      words: [
        ["നിങ്ങൾ", "ningal"],
        ["എന്ത്", "enthu"],
        ["ചെയ്യുകയാണ്?", "cheyyukayaanu?"],
      ],
      blank: 2,
      notes:
        "Casual, to a friend: നീ എന്താ ചെയ്യുന്നേ? (nee enthaa cheyyunne?). Over the phone: എന്താ പരിപാടി? (enthaa paripaadi?, what's the plan / what are you up to?).",
    },
    iAmStudying: {
      words: [
        ["ഞാൻ", "njaan"],
        ["പഠിക്കുകയാണ്", "padikkukayaanu"],
      ],
      blank: 1,
      notes:
        "-ഉകയാണ് (-ukayaanu) = happening right now. The same form works for every person: അവൾ പഠിക്കുകയാണ് (aval padikkukayaanu, she is studying).",
    },
    iAmEating: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഭക്ഷണം", "bhakshanam"],
        ["കഴിക്കുകയാണ്", "kazhikkukayaanu"],
      ],
      blank: 2,
      notes:
        "Malayalam usually names what you are eating; ഭക്ഷണം (bhakshanam, food) fills that slot. Casual: ഞാൻ കഴിക്കുവാ (njaan kazhikkuvaa).",
    },
    iAmDrinkingWater: {
      words: [
        ["ഞാൻ", "njaan"],
        ["വെള്ളം", "vellam"],
        ["കുടിക്കുകയാണ്", "kudikkukayaanu"],
      ],
      blank: 2,
    },
    iAmSleeping: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഉറങ്ങുകയാണ്", "urangukayaanu"],
      ],
      blank: 1,
      notes: "Casual speech shortens -ഉകയാണ് to -ഉവാ (-uvaa): ഞാൻ ഉറങ്ങുവാ (njaan uranguvaa).",
    },
    iAmWorking: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ജോലി", "joli"],
        ["ചെയ്യുകയാണ്", "cheyyukayaanu"],
      ],
      blank: 1,
      notes: '"I am working (in a job)" in general: ഞാൻ ജോലി ചെയ്യുന്നു (njaan joli cheyyunnu).',
    },
    iAmComing: {
      words: [
        ["ഞാൻ", "njaan"],
        ["വരുകയാണ്", "varukayaanu"],
      ],
      blank: 1,
      notes:
        "When someone calls you, the natural reply is ദാ വരുന്നു! (daa varunnu!, coming right now!).",
    },
    iAmGoing: {
      words: [
        ["ഞാൻ", "njaan"],
        ["പോകുകയാണ്", "pokukayaanu"],
      ],
      blank: 1,
      notes:
        "When leaving a house, say പോയിട്ട് വരാം (poyittu varaam, I'll go and come back) rather than just \"I'm going\".",
    },
    // Daily life › My day (lesson "my-day")
    everyDay: {
      script: "എല്ലാ ദിവസവും",
      roman: "ellaa divasavum",
      notes: 'Literally "all days too". Shorter: ദിവസവും (divasavum) or എന്നും (ennum).',
    },
    iAmGoingHome: {
      words: [
        ["ഞാൻ", "njaan"],
        ["വീട്ടിലേക്ക്", "veettilekku"],
        ["പോകുകയാണ്", "pokukayaanu"],
      ],
      blank: 1,
      notes:
        '-ലേക്ക് (-lekku) = "to / towards". വീട് becomes വീട്ടിൽ (veettil) with endings, so വീട്ടിലേക്ക് (veettilekku).',
    },
    iAmGoingToCollege: {
      words: [
        ["ഞാൻ", "njaan"],
        ["കോളേജിലേക്ക്", "collegilekku"],
        ["പോകുകയാണ്", "pokukayaanu"],
      ],
      blank: 1,
      notes:
        "Also natural: ഞാൻ കോളേജിൽ പോകുകയാണ് (njaan collegil pokukayaanu) — -ഇൽ (in) is often used with പോകുക for destinations.",
    },
    iWakeUpAtSix: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ആറ്", "aaru"],
        ["മണിക്ക്", "manikku"],
        ["എഴുന്നേൽക്കും", "ezhunnelkkum"],
      ],
      blank: 3,
      notes:
        "Habits are said with the -ഉം (-um) future form: എഴുന്നേൽക്കും (ezhunnelkkum, (I) get up). മണിക്ക് (manikku) = at … o'clock.",
    },
    iGoToCollegeEveryDay: {
      words: [
        ["ഞാൻ", "njaan"],
        ["എല്ലാ", "ellaa"],
        ["ദിവസവും", "divasavum"],
        ["കോളേജിൽ", "collegil"],
        ["പോകും", "pokum"],
      ],
      blank: 3,
      notes:
        "Time words come early, the place before the verb, the verb last. പോകും (pokum) here is habitual, not future.",
    },
    iEatLunchAtOne: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഒരു", "oru"],
        ["മണിക്ക്", "manikku"],
        ["ഊണ്", "oonu"],
        ["കഴിക്കും", "kazhikkum"],
      ],
      blank: 3,
      notes:
        "ഊണ് (oonu) is the everyday word for the rice lunch; ഉച്ചഭക്ഷണം (uchchabhakshanam) is the formal word. ഒരു മണി (oru mani) = one o'clock.",
    },
    iSleepAtTen: {
      words: [
        ["ഞാൻ", "njaan"],
        ["രാത്രി", "raathri"],
        ["പത്ത്", "pathu"],
        ["മണിക്ക്", "manikku"],
        ["ഉറങ്ങും", "urangum"],
      ],
      blank: 4,
      notes: "Bigger time word first: രാത്രി (night), then പത്ത് മണിക്ക് (at ten o'clock).",
    },
    // Places & directions › Places in town (lesson "places-1")
    school: {
      script: "സ്കൂൾ",
      roman: "school",
      notes: "English loanword used by everyone. The formal word is വിദ്യാലയം (vidyaalayam).",
    },
    college: {
      script: "കോളേജ്",
      roman: "college",
      notes: "English loanword. With endings: കോളേജിൽ (collegil, at college).",
    },
    office: {
      script: "ഓഫീസ്",
      roman: "office",
      notes: "English loanword. Government office: സർക്കാർ ഓഫീസ് (sarkkaar office).",
    },
    shop: {
      script: "കട",
      roman: "kada",
      notes: "A small tea shop is ചായക്കട (chaayakkada); a shopkeeper is കടക്കാരൻ (kadakkaaran).",
    },
    market: {
      script: "ചന്ത",
      roman: "chantha",
      notes:
        "Traditional open market. People also say മാർക്കറ്റ് (market); a supermarket is സൂപ്പർമാർക്കറ്റ് (supermarket).",
    },
    restaurant: {
      script: "ഹോട്ടൽ",
      roman: "hotel",
      notes:
        'In Kerala "hotel" means a restaurant/eating place! A place to stay is a ലോഡ്ജ് (lodge) or "hotel room". റെസ്റ്റോറന്റ് (restaurant) is used for fancier places.',
    },
    // Places & directions › More places (lesson "places-2")
    hospital: {
      script: "ആശുപത്രി",
      roman: "aashupathri",
      notes: '"Hospital" in English is just as common.',
    },
    station: {
      script: "റെയിൽവേ സ്റ്റേഷൻ",
      roman: "railway station",
      notes:
        'Usually just സ്റ്റേഷൻ (station). Note: "station" alone can also mean the police station.',
    },
    bank: {
      script: "ബാങ്ക്",
      roman: "bank",
      notes: "English loanword. ATM is also said in English.",
    },
    temple: {
      script: "അമ്പലം",
      roman: "ambalam",
      notes:
        "The everyday word. The formal word is ക്ഷേത്രം (kshethram). A church or mosque is പള്ളി (palli) — Kerala has all three side by side.",
    },
    bathroom: {
      script: "ബാത്ത്റൂം",
      roman: "bathroom",
      notes:
        'The polite everyday word for both bathroom and toilet. "Toilet" is also used; കക്കൂസ് (kakkoos) is blunt. Formal: ശുചിമുറി (shuchimuri).',
    },
    road: {
      script: "റോഡ്",
      roman: "road",
      notes: "Native words: വഴി (vazhi, way / path / road) and പാത (paatha, highway, formal).",
    },
    // Places & directions › Near, far, left & right (lesson "position-words")
    near: {
      script: "അടുത്ത്",
      roman: "aduthu",
      notes:
        '"Near the market": ചന്തയുടെ അടുത്ത് (chanthayude aduthu). അടുത്ത (adutha) also means "next".',
    },
    far: {
      script: "ദൂരെ",
      roman: "doore",
      notes: '"Distance" is ദൂരം (dooram): എത്ര ദൂരമുണ്ട്? (ethra dooramundu?, how far is it?).',
    },
    left: {
      script: "ഇടത്",
      roman: "idathu",
      notes: '"To the left": ഇടത്തോട്ട് (idathottu). Also ഇടത്തുവശം (idathuvasham, left side).',
    },
    right: { script: "വലത്", roman: "valathu", notes: '"To the right": വലത്തോട്ട് (valathottu).' },
    straight: {
      script: "നേരെ",
      roman: "nere",
      notes: 'Also means "directly": നേരെ വീട്ടിൽ പോകൂ (nere veettil pokoo, go straight home).',
    },
    inFront: {
      script: "മുന്നിൽ",
      roman: "munnil",
      notes: '"In front of the shop": കടയുടെ മുന്നിൽ (kadayude munnil).',
    },
    behind: {
      script: "പിന്നിൽ",
      roman: "pinnil",
      notes: "Also പുറകിൽ (purakil), very common in speech.",
    },
    inside: {
      script: "അകത്ത്",
      roman: "akathu",
      notes: '"Come inside": അകത്തേക്ക് വരൂ (akathekku varoo).',
    },
    outside: {
      script: "പുറത്ത്",
      roman: "purathu",
      notes: '"Go outside": പുറത്ത് പോകൂ (purathu pokoo).',
    },
    // Places & directions › Asking for directions (lesson "asking-directions")
    where: {
      script: "എവിടെ",
      roman: "evide",
      notes: "With ആണ്: എവിടെയാണ്? (evideyaanu?, where is it?); casual എവിടെയാ? (evideyaa?).",
    },
    whereIsTheBathroom: {
      words: [
        ["ബാത്ത്റൂം", "bathroom"],
        ["എവിടെയാണ്?", "evideyaanu?"],
      ],
      blank: 1,
      notes:
        "Pattern: place + എവിടെയാണ്? Polite opener: ക്ഷമിക്കണം (kshamikkanam) or ചേട്ടാ/ചേച്ചീ.",
    },
    whereIsTheStation: {
      words: [
        ["റെയിൽവേ", "railway"],
        ["സ്റ്റേഷൻ", "station"],
        ["എവിടെയാണ്?", "evideyaanu?"],
      ],
      blank: 2,
      notes:
        "Shorter: സ്റ്റേഷൻ എവിടെയാ? (station evideyaa?). For the bus terminus: ബസ് സ്റ്റാൻഡ് എവിടെയാണ്? (bus stand evideyaanu?).",
    },
    goStraight: {
      words: [
        ["നേരെ", "nere"],
        ["പോകൂ", "pokoo"],
      ],
      blank: 0,
      notes: "Polite -ഊ (-oo) ending. Casual: നേരെ പോ (nere po).",
    },
    turnLeft: {
      words: [
        ["ഇടത്തോട്ട്", "idathottu"],
        ["തിരിയൂ", "thiriyoo"],
      ],
      blank: 0,
      notes:
        'Literally "leftwards turn". In speech people often say ഇടത്തോട്ട് പോകണം (idathottu pokanam, you have to go left).',
    },
    turnRight: {
      words: [
        ["വലത്തോട്ട്", "valathottu"],
        ["തിരിയൂ", "thiriyoo"],
      ],
      blank: 0,
      notes: "To an auto driver: വലത്തോട്ട് എടുക്കൂ (valathottu edukkoo, take a right).",
    },
    itIsNear: {
      words: [
        ["ഇവിടെ", "ivide"],
        ["അടുത്താണ്", "aduthaanu"],
      ],
      blank: 1,
      notes:
        'Literally "it\'s near here". Just അടുത്താണ് (aduthaanu) also works. "Very near": തൊട്ടടുത്താണ് (thottaduthaanu).',
    },
    itIsFar: {
      words: [
        ["അത്", "athu"],
        ["ദൂരെയാണ്", "dooreyaanu"],
      ],
      blank: 1,
      notes: '"Quite far": കുറച്ച് ദൂരമുണ്ട് (kurachchu dooramundu, there is some distance).',
    },
    howFarIsIt: {
      words: [
        ["എത്ര", "ethra"],
        ["ദൂരമുണ്ട്?", "dooramundu?"],
      ],
      blank: 1,
      notes:
        'Literally "how much distance is there?". Answers are usually in kilometres (കിലോമീറ്റർ) or minutes of walking.',
    },
    // Places & directions › Where are you going? (lesson "where-are-you-going")
    whereAreYouGoing: {
      words: [
        ["നിങ്ങൾ", "ningal"],
        ["എവിടെ", "evide"],
        ["പോകുകയാണ്?", "pokukayaanu?"],
      ],
      blank: 1,
      notes:
        "Casual, very common greeting in Kerala lanes: എവിടെ പോകുന്നു? (evide pokunnu?) or എങ്ങോട്ടാ? (engottaa?, which way?). It is friendly, not nosy.",
    },
    iAmGoingToTheMarket: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ചന്തയിലേക്ക്", "chanthayilekku"],
        ["പോകുകയാണ്", "pokukayaanu"],
      ],
      blank: 1,
      notes: "Also: ഞാൻ മാർക്കറ്റിൽ പോകുകയാണ് (njaan marketil pokukayaanu).",
    },
    whereAreYou: {
      words: [
        ["നിങ്ങൾ", "ningal"],
        ["എവിടെയാണ്?", "evideyaanu?"],
      ],
      blank: 1,
      notes: "Casual on the phone: നീ എവിടെയാ? (nee evideyaa?).",
    },
    iAmAtHome: {
      words: [
        ["ഞാൻ", "njaan"],
        ["വീട്ടിലാണ്", "veettilaanu"],
      ],
      blank: 1,
      notes:
        "വീട്ടിൽ (veettil, at home) + ആണ് → വീട്ടിലാണ്. Also ഞാൻ വീട്ടിൽ ഉണ്ട് (njaan veettil undu, I'm (there) at home).",
    },
    comeHere: {
      words: [
        ["ഇവിടെ", "ivide"],
        ["വരൂ", "varoo"],
      ],
      blank: 1,
      notes: "Polite. Casual, to a friend or child: ഇങ്ങോട്ട് വാ (ingottu vaa, come this way).",
    },
    waitHere: {
      words: [
        ["ഇവിടെ", "ivide"],
        ["കാത്തുനിൽക്കൂ", "kaathunilkkoo"],
      ],
      blank: 1,
      notes:
        'Literally "stand waiting here". Shorter: ഇവിടെ നിൽക്കൂ (ivide nilkkoo). Casual: ഇവിടെ നിൽക്ക് (ivide nilkku).',
    },
    // Shopping & money › Money & prices (lesson "money-words")
    rupee: {
      script: "രൂപ",
      roman: "roopa",
      notes: '"Ten rupees": പത്ത് രൂപ (pathu roopa). Small change is ചില്ലറ (chillara).',
    },
    price: {
      script: "വില",
      roman: "vila",
      notes: 'Also "value". "What\'s the price?": എന്താ വില? (enthaa vila?).',
    },
    buy: {
      script: "വാങ്ങുക",
      roman: "vaanguka",
      notes: 'Also "to receive / take". Past വാങ്ങി (vaangi).',
    },
    sell: { script: "വിൽക്കുക", roman: "vilkkuka", notes: "Past വിറ്റു (vittu, sold)." },
    expensive: {
      script: "വില കൂടിയ",
      roman: "vila koodiya",
      notes:
        'Literally "high-priced". "It\'s expensive": വില കൂടുതലാണ് (vila kooduthalaanu). "Costly" in English is common.',
    },
    cheap: {
      script: "വില കുറഞ്ഞ",
      roman: "vila kuranja",
      notes: 'Literally "low-priced". "It\'s cheap": വില കുറവാണ് (vila kuravaanu).',
    },
    howMuch: {
      script: "എത്ര",
      roman: "ethra",
      notes:
        'Both "how much" and "how many". For prices: എത്രയാണ്? (ethrayaanu?, how much is it?) or എത്രയായി? (ethrayaayi?, how much does it come to?).',
    },
    // Shopping & money › Colours (lesson "colours")
    colour: {
      script: "നിറം",
      roman: "niram",
      notes: '"What colour?": എന്ത് നിറം? (enthu niram?).',
    },
    red: {
      script: "ചുവപ്പ്",
      roman: "chuvappu",
      notes:
        "Noun form. Before a noun: ചുവന്ന (chuvanna) — ചുവന്ന സാരി (chuvanna saari, red saree).",
    },
    blue: {
      script: "നീല",
      roman: "neela",
      notes: "Same form before a noun: നീല ഷർട്ട് (neela shirt).",
    },
    green: {
      script: "പച്ച",
      roman: "pachcha",
      notes: 'Also means "raw / fresh": പച്ചവെള്ളം (pachchavellam, unboiled water).',
    },
    yellow: { script: "മഞ്ഞ", roman: "manja", notes: "Turmeric is മഞ്ഞൾ (manjal)." },
    white: {
      script: "വെള്ള",
      roman: "vella",
      notes:
        "Before a noun: വെളുത്ത (velutha) — വെളുത്ത മുണ്ട് (velutha mundu). Don't confuse with വെള്ളം (vellam, water).",
    },
    black: {
      script: "കറുപ്പ്",
      roman: "karuppu",
      notes: "Before a noun: കറുത്ത (karutha) — കറുത്ത ബാഗ് (karutha bag).",
    },
    // Shopping & money › Clothes (lesson "clothes")
    clothes: {
      script: "വസ്ത്രം",
      roman: "vasthram",
      notes:
        "Formal. In speech: ഡ്രസ്സ് (dress) for an outfit, തുണി (thuni) for cloth / clothes to wash.",
    },
    shirt: { script: "ഷർട്ട്", roman: "shirt", notes: "English loanword." },
    trousers: {
      script: "പാന്റ്സ്",
      roman: "pants",
      notes: "Also പാന്റ് (pant). Traditional menswear in Kerala is the മുണ്ട് (mundu).",
    },
    saree: {
      script: "സാരി",
      roman: "saari",
      notes:
        "Kerala's traditional cream-and-gold saree is the കസവ് സാരി (kasavu saari) or സെറ്റ് സാരി (set saari).",
    },
    shoes: {
      script: "ഷൂസ്",
      roman: "shoes",
      notes:
        "Footwear in general is ചെരുപ്പ് (cheruppu). Shoes come off before entering homes and temples.",
    },
    slippers: {
      script: "ചെരുപ്പ്",
      roman: "cheruppu",
      notes:
        "Covers slippers, sandals and chappals. Flip-flops are often called വള്ളിച്ചെരുപ്പ് (vallichcheruppu).",
    },
    // Shopping & money › At the shop (lesson "at-the-shop")
    howMuchIsThis: {
      words: [
        ["ഇതിന്", "ithinu"],
        ["എത്രയാണ്?", "ethrayaanu?"],
      ],
      blank: 1,
      accept: ["How much is this?"],
      notes:
        'Literally "for this, how much is it?". Also: ഇതിന് എന്താ വില? (ithinu enthaa vila?, what\'s the price of this?).',
    },
    thisIsTooExpensive: {
      words: [
        ["ഇതിന്", "ithinu"],
        ["വില", "vila"],
        ["വളരെ", "valare"],
        ["കൂടുതലാണ്", "kooduthalaanu"],
      ],
      blank: 3,
      notes:
        'Literally "for this the price is very high". Casual: ഭയങ്കര വിലയാണല്ലോ! (bhayankara vilayaanallo!, that\'s terribly expensive!).',
    },
    reduceThePrice: {
      words: [
        ["കുറച്ച്", "kurachchu"],
        ["വില", "vila"],
        ["കുറയ്ക്കാമോ?", "kuraykkaamo?"],
      ],
      blank: 2,
      notes:
        'Literally "could you reduce the price a little?". Bargaining is normal at markets, not in supermarkets. Casual: കുറച്ച് കുറയ്ക്ക് ചേട്ടാ (kurachchu kuraykku chetta).',
    },
    doYouHaveMangoes: {
      words: [
        ["മാങ്ങ", "maanga"],
        ["ഉണ്ടോ?", "undo?"],
      ],
      blank: 0,
      notes:
        'Literally "mango, is there?" — ഉണ്ടോ? (undo?) asks if something is available. Answer: ഉണ്ട് (undu, yes, we have) / ഇല്ല (illa, no).',
    },
    iNeedABag: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ഒരു", "oru"],
        ["ബാഗ്", "bag"],
        ["വേണം", "venam"],
      ],
      blank: 2,
      notes:
        'At a shop, ask for a carrier bag with ഒരു കവർ തരാമോ? (oru kavar tharaamo?) — കവർ (kavar, from "cover") is what Malayalis call a plastic or paper bag.',
    },
    giveMeThisOne: {
      words: [
        ["ഇത്", "ithu"],
        ["തരൂ", "tharoo"],
      ],
      blank: 0,
      notes: "Casual: ഇത് താ (ithu thaa). Softer: ഇത് തരാമോ? (ithu tharaamo?).",
    },
    iWillTakeIt: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഇത്", "ithu"],
        ["എടുക്കാം", "edukkaam"],
      ],
      blank: 2,
      notes:
        '-ആം (-aam) expresses willingness: "I\'ll take this". Also: ഇത് മതി (ithu mathi, this will do).',
    },
    showMeThatOne: {
      words: [
        ["അത്", "athu"],
        ["ഒന്ന്", "onnu"],
        ["കാണിക്കാമോ?", "kaanikkaamo?"],
      ],
      blank: 2,
      notes:
        'Literally "could you show that once?" — ഒന്ന് (onnu) softens requests. Casual: അതൊന്ന് കാണിച്ചേ (athonnu kaanichche).',
    },
    doYouHaveARedOne: {
      words: [
        ["ചുവന്നത്", "chuvannathu"],
        ["ഉണ്ടോ?", "undo?"],
      ],
      blank: 0,
      notes:
        'ചുവന്നത് (chuvannathu) = "a red one" (the colour word + -ത്, "the … thing"). Same pattern: നീല നിറത്തിലുള്ളത് (neela nirathilullathu, a blue one), വലുത് (valuthu, a big one).',
    },
    // Travel & transport › Getting around (lesson "vehicles")
    bus: {
      script: "ബസ്",
      roman: "bus",
      notes:
        'Kerala\'s state buses (KSRTC) are fondly nicknamed ആനവണ്ടി (aanavandi, "elephant vehicle") after their elephant logo. A vehicle in general is വണ്ടി (vandi).',
    },
    train: {
      script: "ട്രെയിൻ",
      roman: "train",
      notes:
        'The native word തീവണ്ടി (theevandi, "fire vehicle") is understood but older-sounding.',
    },
    autoRickshaw: {
      script: "ഓട്ടോ",
      roman: "auto",
      notes:
        'Short for ഓട്ടോറിക്ഷ (autoriksha); said "otto". Address the driver as ചേട്ടാ (chetta) and agree on the fare or ask for the meter: മീറ്റർ ഇടാമോ? (meter idaamo?).',
    },
    taxi: {
      script: "ടാക്സി",
      roman: "taxi",
      notes: 'Ride-hailing cabs are just called "cab" or by the app name.',
    },
    car: { script: "കാർ", roman: "car", notes: "English loanword ending in the chillu ർ." },
    bike: {
      script: "ബൈക്ക്",
      roman: "bike",
      notes: "Used for motorbikes. A scooter is സ്കൂട്ടർ (scooter); a bicycle is സൈക്കിൾ (cycle).",
    },
    // Travel & transport › Tickets & stations (lesson "travel-words")
    ticket: {
      script: "ടിക്കറ്റ്",
      roman: "ticket",
      notes: "English loanword. On Kerala buses the conductor comes to you to sell tickets.",
    },
    platform: {
      script: "പ്ലാറ്റ്ഫോം",
      roman: "platform",
      notes: 'English loanword. "Platform number two": രണ്ടാം പ്ലാറ്റ്ഫോം (randaam platform).',
    },
    busStop: {
      script: "ബസ് സ്റ്റോപ്പ്",
      roman: "bus stop",
      notes: "A roadside stop. The main bus terminus of a town is the ബസ് സ്റ്റാൻഡ് (bus stand).",
    },
    airport: {
      script: "വിമാനത്താവളം",
      roman: "vimaanathaavalam",
      notes: 'Literally "aeroplane station". In speech almost everyone says എയർപോർട്ട് (airport).',
    },
    luggage: {
      script: "ലഗേജ്",
      roman: "luggage",
      notes: "Also സാധനങ്ങൾ (saadhanangal, things / stuff) and പെട്ടി (petti, box / suitcase).",
    },
    journey: {
      script: "യാത്ര",
      roman: "yaathra",
      notes: '"Have a good journey": ശുഭയാത്ര (shubhayaathra).',
    },
    // Travel & transport › When & how long? (lesson "when-how-long")
    when: {
      script: "എപ്പോൾ",
      roman: "eppol",
      notes: "With ആണ്: എപ്പോഴാണ്? (eppozhaanu?, when is it?). Casual: എപ്പോ? (eppo?).",
    },
    howLong: {
      script: "എത്ര നേരം",
      roman: "ethra neram",
      notes: 'Literally "how much time". Also എത്ര സമയം (ethra samayam).',
    },
    late: {
      script: "വൈകി",
      roman: "vaiki",
      notes:
        'Literally "(it) got late". "Late" in English is very common: ഞാൻ ലേറ്റ് ആയി (njaan late aayi, I got late).',
    },
    early: {
      script: "നേരത്തെ",
      roman: "nerathe",
      notes: '"Come early": നേരത്തെ വരൂ (nerathe varoo).',
    },
    quickly: {
      script: "വേഗം",
      roman: "vegam",
      notes: '"Come quickly!": വേഗം വാ! (vegam vaa!). "Hurry up": വേഗമാകട്ടെ (vegamaakatte).',
    },
    slowly: {
      script: "പതുക്കെ",
      roman: "pathukke",
      notes:
        'Also means "softly / gently": പതുക്കെ പറയൂ (pathukke parayoo, say it softly / slowly).',
    },
    whenDoesTheBusCome: {
      words: [
        ["ബസ്", "bus"],
        ["എപ്പോൾ", "eppol"],
        ["വരും?", "varum?"],
      ],
      blank: 1,
      notes:
        "Future -ഉം (-um): വരും (varum, will come). Asking about a specific route: കോഴിക്കോട് ബസ് എപ്പോൾ വരും? (Kozhikkodu bus eppol varum?).",
    },
    howLongDoesItTake: {
      words: [
        ["എത്ര", "ethra"],
        ["സമയം", "samayam"],
        ["എടുക്കും?", "edukkum?"],
      ],
      blank: 1,
      notes: 'Literally "how much time will it take?" — same idea as English.',
    },
    theTrainIsLate: {
      words: [
        ["ട്രെയിൻ", "train"],
        ["വൈകിയാണ്", "vaikiyaanu"],
        ["ഓടുന്നത്", "odunnathu"],
      ],
      blank: 1,
      notes: 'Literally "the train is running late". Casual: ട്രെയിൻ ലേറ്റാണ് (train lateaanu).',
    },
    // Travel & transport › Travel phrases (lesson "travel-phrases")
    oneTicketPlease: {
      words: [
        ["തൃശ്ശൂരിലേക്ക്", "Thrissurilekku"],
        ["ഒരു", "oru"],
        ["ടിക്കറ്റ്", "ticket"],
        ["തരൂ", "tharoo"],
      ],
      meaning: "One ticket to Thrissur, please.",
      blank: 0,
      notes:
        '-ലേക്ക് (-lekku) = "to". On a bus people simply say ഒരു തൃശ്ശൂർ (oru Thrissur, "one Thrissur"). Other cities: കോഴിക്കോട്ടേക്ക് (Kozhikkottekku), തിരുവനന്തപുരത്തേക്ക് (Thiruvananthapurathekku).',
    },
    whichPlatform: {
      words: [
        ["ഏത്", "ethu"],
        ["പ്ലാറ്റ്ഫോമിലാണ്?", "platformilaanu?"],
      ],
      blank: 0,
      notes:
        'Literally "on which platform is it?". Full question: ട്രെയിൻ ഏത് പ്ലാറ്റ്ഫോമിലാണ് വരുന്നത്? (train ethu platformilaanu varunnathu?).',
    },
    stopHerePlease: {
      words: [
        ["ഇവിടെ", "ivide"],
        ["നിർത്തൂ", "nirthoo"],
      ],
      blank: 1,
      notes:
        "Softer and most natural to an auto or bus: ഇവിടെ ഒന്ന് നിർത്തണേ (ivide onnu nirthane). On a bus you can also call out സ്റ്റോപ്പ്! (stop!).",
    },
    goSlowlyPlease: {
      words: [
        ["പതുക്കെ", "pathukke"],
        ["പോകൂ", "pokoo"],
      ],
      blank: 0,
      notes: "Softer: ചേട്ടാ, ഒന്ന് പതുക്കെ പോണേ (chetta, onnu pathukke pone).",
    },
    howMuchToStation: {
      words: [
        ["റെയിൽവേ", "railway"],
        ["സ്റ്റേഷനിലേക്ക്", "stationilekku"],
        ["എത്രയാകും?", "ethrayaakum?"],
      ],
      blank: 2,
      notes:
        'Literally "to the railway station, how much will it become?" — what you ask an auto driver before getting in.',
    },
    iAmLost: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["വഴി", "vazhi"],
        ["തെറ്റി", "thetti"],
      ],
      blank: 1,
      notes:
        'Literally "to me the way went wrong". Also: എനിക്ക് വഴി അറിയില്ല (enikku vazhi ariyilla, I don\'t know the way).',
    },
    doesThisBusGoToStation: {
      words: [
        ["ഈ", "ee"],
        ["ബസ്", "bus"],
        ["റെയിൽവേ", "railway"],
        ["സ്റ്റേഷനിലേക്ക്", "stationilekku"],
        ["പോകുമോ?", "pokumo?"],
      ],
      blank: 4,
      notes:
        "-ഓ (-o) on the verb makes a yes/no question: പോകും (will go) → പോകുമോ? (will it go?). Answer: പോകും (pokum, yes) / ഇല്ല (illa, no).",
    },
    // Everyday conversations › Meeting a friend (lesson "conv-friend")
    whatsNew: {
      words: [
        ["എന്താ", "enthaa"],
        ["വിശേഷം?", "vishesham?"],
      ],
      blank: 1,
      notes:
        'Literally "what\'s the news?" — the classic friendly greeting. Also എന്തൊക്കെയുണ്ട്? (enthokkeyundu?, how are things?). Reply: സുഖം (sukham) or ഒന്നുമില്ല (onnumilla, nothing much).',
    },
    longTimeNoSee: {
      words: [
        ["കണ്ടിട്ട്", "kandittu"],
        ["കുറെ", "kure"],
        ["നാളായല്ലോ", "naalaayallo"],
      ],
      blank: 2,
      notes:
        'Literally "many days have passed since (I) saw (you), haven\'t they!" — -അല്ലോ (-allo) adds friendly surprise.',
    },
    haveYouEaten: {
      words: [
        ["ഭക്ഷണം", "bhakshanam"],
        ["കഴിച്ചോ?", "kazhichcho?"],
      ],
      blank: 1,
      notes:
        "A caring everyday greeting, not just a question. Very Kerala: ചോറുണ്ടോ? (chorundo?, have you had your rice?) or ഊണ് കഴിച്ചോ? (oonu kazhichcho?).",
    },
    yesIAte: {
      words: [
        ["ഉവ്വ്,", "uvvu,"],
        ["ഞാൻ", "njaan"],
        ["കഴിച്ചു", "kazhichchu"],
      ],
      blank: 2,
      notes:
        'ഉവ്വ് (uvvu) is "yes" for things that happened or exist. Short reply: കഴിച്ചു (kazhichchu). "Not yet": ഇല്ല, ഇതുവരെ കഴിച്ചില്ല (illa, ithuvare kazhichchilla).',
    },
    // Everyday conversations › At college (lesson "conv-college")
    whereIsTheClass: {
      words: [
        ["ക്ലാസ്", "class"],
        ["എവിടെയാണ്?", "evideyaanu?"],
      ],
      blank: 0,
      accept: ["Where is the class?"],
      notes:
        "Students say ക്ലാസ് (class) for both the lesson and the room. Formal: ക്ലാസ്മുറി (classmuri, classroom).",
    },
    whenIsTheExam: {
      words: [
        ["പരീക്ഷ", "pareeksha"],
        ["എപ്പോഴാണ്?", "eppozhaanu?"],
      ],
      blank: 0,
      notes: '"Exam" in English is equally common: എക്സാം എപ്പോഴാ? (exam eppozhaa?).',
    },
    canIComeIn: {
      words: [
        ["അകത്തേക്ക്", "akathekku"],
        ["വരട്ടെ?", "varatte?"],
      ],
      blank: 0,
      notes:
        'Literally "shall I come inside?" — -അട്ടെ (-atte) asks permission. In Kerala classrooms students usually say "May I come in, sir/teacher?" in English.',
    },
    isThisSeatFree: {
      words: [
        ["ഈ", "ee"],
        ["സീറ്റിൽ", "seatil"],
        ["ആരെങ്കിലും", "aarenkilum"],
        ["ഉണ്ടോ?", "undo?"],
      ],
      blank: 1,
      notes:
        'Literally "is anyone on this seat?" — the natural way to ask. Answer: ഇല്ല, ഇരുന്നോളൂ (illa, irunnoloo, no, go ahead and sit).',
    },
    // Everyday conversations › On the phone (lesson "conv-phone")
    hello_onPhone: {
      words: [["ഹലോ?", "hello?"]],
      notes:
        "Everyone answers the phone with ഹലോ (hello). നമസ്കാരം (namaskaaram) is used only on formal calls.",
    },
    whoIsSpeaking: {
      words: [
        ["ആരാണ്", "aaraanu"],
        ["സംസാരിക്കുന്നത്?", "samsaarikkunnathu?"],
      ],
      blank: 1,
      notes: 'Literally "who is it that is speaking?". Casual: ആരാ? (aaraa?, who is it?).',
    },
    callYouLater: {
      words: [
        ["ഞാൻ", "njaan"],
        ["പിന്നെ", "pinne"],
        ["വിളിക്കാം", "vilikkaam"],
      ],
      blank: 2,
      notes:
        '-ആം (-aam) = "I\'ll (be happy to)". വിളിക്കുക (vilikkuka) means both "to call (by phone)" and "to call out / invite".',
    },
    canYouHearMe: {
      words: [["കേൾക്കുന്നുണ്ടോ?", "kelkkunnundo?"]],
      notes:
        'Literally "are you hearing?" — the usual phone check. Answer: കേൾക്കുന്നുണ്ട് (kelkkunnundu, I can hear) or ശരിക്ക് കേൾക്കുന്നില്ല (sharikku kelkkunnilla, I can\'t hear properly).',
    },
    justAMinute: {
      words: [
        ["ഒരു", "oru"],
        ["മിനിറ്റ്", "minute"],
      ],
      blank: 1,
      notes:
        "Also ഒരു നിമിഷം (oru nimisham, one moment) or simply ഒന്ന് നിൽക്കൂ (onnu nilkkoo, wait a moment).",
    },
    // Everyday conversations › Asking for help (lesson "conv-help")
    whatIsTheNameOfThisPlace: {
      words: [
        ["ഈ", "ee"],
        ["സ്ഥലത്തിന്റെ", "sthalathinte"],
        ["പേര്", "peru"],
        ["എന്താണ്?", "enthaanu?"],
      ],
      blank: 1,
      notes:
        'Literally "what is the name of this place?". Casual: ഇത് ഏതാ സ്ഥലം? (ithu ethaa sthalam?, which place is this?).',
    },
    ofCourse: {
      words: [["തീർച്ചയായും", "theerchchayaayum"]],
      notes:
        'Literally "certainly". Casual equivalents: പിന്നെന്താ! (pinnenthaa!, why not!) and പിന്നല്ലാതെ! (pinnallaathe!, of course!).',
    },
    // Grammar & sentence building › I, you, he, she… (lesson "pronouns")
    youCasual: {
      script: "നീ",
      roman: "nee",
      notes:
        "For close friends, younger siblings and children. Using നീ with an elder or stranger is rude — use നിങ്ങൾ (ningal), or a title like ചേട്ടൻ / ചേച്ചി.",
    },
    he: {
      script: "അവൻ",
      roman: "avan",
      notes:
        'For a boy or a man your age or younger. For an elder or respected man: അദ്ദേഹം (addeham) or അവർ (avar). "This man (here)": ഇവൻ (ivan).',
    },
    she: {
      script: "അവൾ",
      roman: "aval",
      notes:
        'For a girl or a woman your age or younger. For an elder or respected woman: അവർ (avar). "This woman (here)": ഇവൾ (ival).',
    },
    we: {
      script: "നമ്മൾ",
      roman: "nammal",
      notes:
        'നമ്മൾ (nammal) is "we including you" (you and I). ഞങ്ങൾ (njangal) is "we not including you" (my group). "Let\'s go" uses നമുക്ക് (namukku): നമുക്ക് പോകാം.',
    },
    they: {
      script: "അവർ",
      roman: "avar",
      notes:
        'Also the respectful "he / she" for one elder person. For things: അവ (ava, they / those things).',
    },
    itPronoun: {
      script: "അത്",
      roman: "athu",
      notes:
        'The same word means "it" and "that (thing)". "This (thing)" is ഇത് (ithu). Animals are usually അത് too.',
    },
    // Grammar & sentence building › Word order & the present (lesson "word-order")
    iEatRice: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ചോറ്", "choru"],
        ["കഴിക്കുന്നു", "kazhikkunnu"],
      ],
      blank: 1,
      notes:
        'Subject – object – verb: literally "I rice eat". For habits people often use the -ഉം form: ഞാൻ ചോറ് കഴിക്കും (njaan choru kazhikkum, I (usually) eat rice).',
    },
    sheDrinksTea: {
      words: [
        ["അവൾ", "aval"],
        ["ചായ", "chaaya"],
        ["കുടിക്കുന്നു", "kudikkunnu"],
      ],
      blank: 2,
      notes:
        "The verb കുടിക്കുന്നു (kudikkunnu) is exactly the same as for ഞാൻ (I) — Malayalam verbs never change for person, number or gender.",
    },
    weGoToCollege: {
      words: [
        ["ഞങ്ങൾ", "njangal"],
        ["കോളേജിൽ", "collegil"],
        ["പോകുന്നു", "pokunnu"],
      ],
      blank: 1,
      notes:
        "ഞങ്ങൾ (njangal) = we (not including the listener). Speaking to a classmate who also goes, you'd say നമ്മൾ (nammal).",
    },
    heReadsABook: {
      words: [
        ["അവൻ", "avan"],
        ["ഒരു", "oru"],
        ["പുസ്തകം", "pusthakam"],
        ["വായിക്കുന്നു", "vaayikkunnu"],
      ],
      blank: 3,
      notes:
        "Things that are objects stay in their plain form (പുസ്തകം), but people as objects take -എ: അവൻ അവളെ കണ്ടു (avan avale kandu, he saw her).",
    },
    theyLiveInIndia: {
      words: [
        ["അവർ", "avar"],
        ["ഇന്ത്യയിൽ", "Inthyayil"],
        ["താമസിക്കുന്നു", "thaamasikkunnu"],
      ],
      blank: 2,
      notes: "-ഇൽ (-il) = in; ഇന്ത്യ + ഇൽ → ഇന്ത്യയിൽ with a -യ- glide.",
    },
    myMotherCooksFood: {
      words: [
        ["എന്റെ", "ente"],
        ["അമ്മ", "amma"],
        ["ഭക്ഷണം", "bhakshanam"],
        ["ഉണ്ടാക്കുന്നു", "undaakkunnu"],
      ],
      blank: 3,
      notes:
        'Literally "my mother food makes" — ഉണ്ടാക്കുക (undaakkuka, to make) is the everyday verb for cooking. Formal: പാചകം ചെയ്യുന്നു (paachakam cheyyunnu).',
    },
    iSpeakEnglish: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഇംഗ്ലീഷ്", "ingleesh"],
        ["സംസാരിക്കുന്നു", "samsaarikkunnu"],
      ],
      blank: 2,
      notes:
        "Grammatical, but to say you can speak a language Malayalis usually say എനിക്ക് ഇംഗ്ലീഷ് അറിയാം (enikku ingleesh ariyaam, I know English).",
    },
    // Grammar & sentence building › Past & future (lesson "past-future")
    iAteRice: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ചോറ്", "choru"],
        ["കഴിച്ചു", "kazhichchu"],
      ],
      blank: 2,
      notes:
        "Past of കഴിക്കുക is കഴിച്ചു (kazhichchu). Negative: ഞാൻ ചോറ് കഴിച്ചില്ല (njaan choru kazhichchilla, I didn't eat rice).",
    },
    iWillEatRice: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ചോറ്", "choru"],
        ["കഴിക്കും", "kazhikkum"],
      ],
      blank: 2,
      notes:
        'Future -ഉം (-um). "I\'ll eat (gladly / let me)" is കഴിക്കാം (kazhikkaam). Negative: കഴിക്കില്ല (kazhikkilla).',
    },
    iWentToTheMarketYesterday: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഇന്നലെ", "innale"],
        ["ചന്തയിൽ", "chanthayil"],
        ["പോയി", "poyi"],
      ],
      blank: 3,
      notes:
        "Time words usually come right after the subject. പോയി (poyi) = went. Negative: പോയില്ല (poyilla).",
    },
    iWillGoTomorrow: {
      words: [
        ["ഞാൻ", "njaan"],
        ["നാളെ", "naale"],
        ["പോകും", "pokum"],
      ],
      blank: 2,
      notes:
        'Also ഞാൻ നാളെ പോകാം (njaan naale pokaam) — "I\'ll go tomorrow (agreeing / offering)".',
    },
    sheCameYesterday: {
      words: [
        ["അവൾ", "aval"],
        ["ഇന്നലെ", "innale"],
        ["വന്നു", "vannu"],
      ],
      blank: 2,
      notes: "വന്നു (vannu) = came — same for every person: ഞാൻ വന്നു, അവൻ വന്നു, അവർ വന്നു.",
    },
    weWillComeTomorrow: {
      words: [
        ["ഞങ്ങൾ", "njangal"],
        ["നാളെ", "naale"],
        ["വരും", "varum"],
      ],
      blank: 2,
      notes:
        "As a promise to a host, ഞങ്ങൾ നാളെ വരാം (njangal naale varaam, we'll come tomorrow) sounds warmer.",
    },
    // Grammar & sentence building › Questions & negatives (lesson "questions-negatives")
    why: {
      script: "എന്തിന്",
      roman: "enthinu",
      notes:
        'Literally "for what". Also എന്തുകൊണ്ട് (enthukondu, why / for what reason), and in speech just എന്താ? (enthaa?): എന്താ വരാത്തത്? (enthaa varaathathu?, why didn\'t you come?).',
    },
    how: {
      script: "എങ്ങനെ",
      roman: "engane",
      notes: '"How is it?": എങ്ങനെയുണ്ട്? (enganeyundu?) — e.g. about food or a film.',
    },
    which: {
      script: "ഏത്",
      roman: "ethu",
      notes: "Before a noun: ഏത് ബസ്? (ethu bus?, which bus?). Casual: ഏതാ? (ethaa?, which one?).",
    },
    doYouEatMeat: {
      words: [
        ["നിങ്ങൾ", "ningal"],
        ["ഇറച്ചി", "irachchi"],
        ["കഴിക്കുമോ?", "kazhikkumo?"],
      ],
      blank: 1,
      notes:
        "Yes/no questions add -ഓ (-o): കഴിക്കും → കഴിക്കുമോ? (do you (usually) eat?). Answer: കഴിക്കും (kazhikkum, yes) / കഴിക്കില്ല (kazhikkilla, no).",
    },
    iDontKnow: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["അറിയില്ല", "ariyilla"],
      ],
      blank: 1,
      notes:
        'Literally "to me (it) is not known" — dative construction. Positive: എനിക്ക് അറിയാം (enikku ariyaam, I know).',
    },
    isThisYourBook: {
      words: [
        ["ഇത്", "ithu"],
        ["നിങ്ങളുടെ", "ningalude"],
        ["പുസ്തകമാണോ?", "pusthakamaano?"],
      ],
      blank: 1,
      notes: "ആണ് + ഓ → ആണോ? (aano?, is it?). Casual: ഇത് നിന്റെ ബുക്കാണോ? (ithu ninte bookaano?).",
    },
    thisIsNotMyBook: {
      words: [
        ["ഇത്", "ithu"],
        ["എന്റെ", "ente"],
        ["പുസ്തകമല്ല", "pusthakamalla"],
      ],
      blank: 2,
      notes:
        'അല്ല (alla) denies identity ("is not"), so പുസ്തകം + അല്ല → പുസ്തകമല്ല. ഇല്ല (illa) would mean "there is no book".',
    },
    whyAreYouLate: {
      words: [
        ["നിങ്ങൾ", "ningal"],
        ["എന്താണ്", "enthaanu"],
        ["വൈകിയത്?", "vaikiyathu?"],
      ],
      blank: 2,
      notes:
        'Literally "what is it that you got late (for)?". Casual: എന്താ ലേറ്റ് ആയത്? (enthaa late aayathu?).',
    },
    howDoYouGoToCollege: {
      words: [
        ["നിങ്ങൾ", "ningal"],
        ["എങ്ങനെയാണ്", "enganeyaanu"],
        ["കോളേജിൽ", "collegil"],
        ["പോകുന്നത്?", "pokunnathu?"],
      ],
      blank: 1,
      notes:
        'The question word takes ആണ് and the verb ends in -ത് (-thu): "how is it that you go…?". Answer: ബസിലാണ് (busilaanu, by bus).',
    },
    // Grammar & sentence building › My, your & small words (lesson "possession")
    inPostposition: {
      script: "-ഇൽ",
      roman: "-il",
      notes:
        "An ending, not a separate word: വീട് → വീട്ടിൽ (veettil, in the house), കൊച്ചി → കൊച്ചിയിൽ (Kochiyil, in Kochi). After some vowels it is just -ൽ: കടയിൽ (kadayil, in the shop).",
    },
    onPostposition: {
      script: "മുകളിൽ",
      roman: "mukalil",
      notes:
        'Literally "at the top". Used after the possessive: മേശയുടെ മുകളിൽ (meshayude mukalil, on the table). Also -ഇൽ alone: മേശയിൽ (meshayil).',
    },
    withPostposition: {
      script: "കൂടെ",
      roman: "koode",
      notes:
        '"Together with" a person, after the possessive: അമ്മയുടെ കൂടെ (ammayude koode, with mother). Also ഒപ്പം (oppam). "With (using) a pen" is പേന കൊണ്ട് (pena kondu).',
    },
    fromPostposition: {
      script: "നിന്ന്",
      roman: "ninnu",
      notes:
        "Used after -ഇൽ: വീട്ടിൽ നിന്ന് (veettil ninnu, from home). From a person: അമ്മയുടെ അടുത്ത് നിന്ന് (ammayude aduthu ninnu) or -ഇൽ നിന്ന്.",
    },
    table: {
      script: "മേശ",
      roman: "mesha",
      notes: '"On the table" in speech: മേശപ്പുറത്ത് (meshappurathu).',
    },
    thisIsMyBook: {
      words: [
        ["ഇത്", "ithu"],
        ["എന്റെ", "ente"],
        ["പുസ്തകമാണ്", "pusthakamaanu"],
      ],
      blank: 1,
      notes:
        "Possessives come before the noun and never change: എന്റെ (my), നിങ്ങളുടെ (your), അവന്റെ (his), അവളുടെ (her).",
    },
    hisNameIsRavi: {
      words: [
        ["അവന്റെ", "avante"],
        ["പേര്", "peru"],
        ["രവി", "Ravi"],
        ["എന്നാണ്", "ennaanu"],
      ],
      blank: 0,
      notes:
        'എന്നാണ് (ennaanu) = "is (called)". For an older man: അദ്ദേഹത്തിന്റെ പേര് രവി എന്നാണ് (addehathinte peru Ravi ennaanu).',
    },
    theBookIsOnTheTable: {
      words: [
        ["പുസ്തകം", "pusthakam"],
        ["മേശയുടെ", "meshayude"],
        ["മുകളിലാണ്", "mukalilaanu"],
      ],
      blank: 2,
      notes:
        'Literally "the book is at the top of the table". Everyday: പുസ്തകം മേശപ്പുറത്തുണ്ട് (pusthakam meshappurathundu).',
    },
    iGoWithMyFriend: {
      words: [
        ["ഞാൻ", "njaan"],
        ["എന്റെ", "ente"],
        ["സുഹൃത്തിന്റെ", "suhruthinte"],
        ["കൂടെ", "koode"],
        ["പോകുന്നു", "pokunnu"],
      ],
      blank: 3,
      notes:
        "Pattern: person + -ന്റെ / -ഉടെ + കൂടെ. Casual: ഞാൻ എന്റെ കൂട്ടുകാരന്റെ കൂടെ പോകും (njaan ente koottukaarante koode pokum).",
    },
    sheIsComingFromHome: {
      words: [
        ["അവൾ", "aval"],
        ["വീട്ടിൽ", "veettil"],
        ["നിന്ന്", "ninnu"],
        ["വരുകയാണ്", "varukayaanu"],
      ],
      blank: 2,
      notes: '"From" = -ഇൽ നിന്ന് (-il ninnu): വീട്ടിൽ നിന്ന് (veettil ninnu, from home).',
    },
    // Grammar & sentence building › Polite & casual (lesson "polite-casual")
    comeCasual: {
      words: [["വാ!", "vaa!"]],
      notes:
        "Casual command to a friend, sibling or child. Polite: വരൂ (varoo). Saying വാ to an elder is rude.",
    },
    comePolite: {
      words: [["വരൂ", "varoo"]],
      accept: ["Come", "Welcome"],
      notes:
        "Polite -ഊ (-oo) ending. In invitations: വരണം (varanam, please do come); very formal: വന്നാലും (vannaalum). Hosts greet guests with വരൂ, വരൂ (varoo, varoo).",
    },
    sitCasual: {
      words: [["ഇരിക്ക്!", "irikku!"]],
      notes:
        "Casual. Between very close friends you may hear ഇരിക്കെടാ / ഇരിക്കെടീ (irikkedaa / irikkedee) — very familiar, never with elders.",
    },
    sitPolite: {
      words: [["ഇരിക്കൂ", "irikkoo"]],
      accept: ["Please sit", "Have a seat"],
      notes:
        "Polite. To a respected guest: ഇരിക്കണം (irikkanam). The host usually says വരൂ, ഇരിക്കൂ (varoo, irikkoo) together.",
    },
    eatPolite: {
      words: [
        ["ഭക്ഷണം", "bhakshanam"],
        ["കഴിക്കൂ", "kazhikkoo"],
      ],
      blank: 1,
      notes:
        "Hosts insist warmly: കഴിക്കൂ, കഴിക്കൂ (kazhikkoo, kazhikkoo). Casual to a friend: കഴിക്ക് (kazhikku). A guest may say മതി (mathi, enough) to stop more servings.",
    },
    howAreYouCasual: {
      words: [
        ["നിനക്ക്", "ninakku"],
        ["സുഖമാണോ?", "sukhamaano?"],
      ],
      blank: 0,
      notes:
        "Casual നിനക്ക് (ninakku, to you) replaces polite നിങ്ങൾക്ക് (ningalkku). Friends more often say സുഖമല്ലേ? (sukhamalle?) or എന്തൊക്കെയുണ്ട്? (enthokkeyundu?).",
    },
    // Feelings, health & relationships › How do you feel? (lesson "feelings")
    happy: {
      script: "സന്തോഷം",
      roman: "santhosham",
      notes:
        'A noun ("happiness"). Feelings are said with the dative: എനിക്ക് സന്തോഷമുണ്ട് (enikku santhoshamundu, I am happy).',
    },
    sad: {
      script: "സങ്കടം",
      roman: "sankadam",
      notes:
        "Also വിഷമം (vishamam, distress / feeling bad), very common: എനിക്ക് വിഷമമായി (enikku vishamamaayi, I felt bad).",
    },
    angry: {
      script: "ദേഷ്യം",
      roman: "deshyam",
      notes: 'A noun. "Don\'t get angry": ദേഷ്യപ്പെടരുത് (deshyappedaruthu).',
    },
    tired: {
      script: "ക്ഷീണം",
      roman: "ksheenam",
      notes: 'A noun ("tiredness"). Also ഞാൻ ക്ഷീണിച്ചു (njaan ksheenichchu, I am worn out).',
    },
    scared: {
      script: "പേടി",
      roman: "pedi",
      notes: 'A noun ("fear"). "Don\'t be afraid": പേടിക്കേണ്ട (pedikkenda).',
    },
    worried: {
      script: "ആശങ്ക",
      roman: "aashanka",
      notes:
        "Formal word for worry / anxiety. In speech people say ടെൻഷൻ (tension): എനിക്ക് ടെൻഷൻ ഉണ്ട് (enikku tension undu), or വിഷമം (vishamam).",
    },
    iAmHappy: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["സന്തോഷമുണ്ട്", "santhoshamundu"],
      ],
      blank: 1,
      notes:
        'Literally "to me there is happiness". "I\'m very happy": എനിക്ക് വളരെ സന്തോഷമായി (enikku valare santhoshamaayi).',
    },
    iAmSad: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["സങ്കടമുണ്ട്", "sankadamundu"],
      ],
      blank: 1,
      notes: 'Literally "to me there is sadness". Also എനിക്ക് വിഷമമുണ്ട് (enikku vishamamundu).',
    },
    iAmTired: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ക്ഷീണമുണ്ട്", "ksheenamundu"],
      ],
      blank: 1,
      notes:
        'Literally "to me there is tiredness". Casual: ഭയങ്കര ക്ഷീണം (bhayankara ksheenam, terribly tired).',
    },
    // Feelings, health & relationships › I'm okay, don't worry (lesson "feelings-2")
    iAmAngry: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ദേഷ്യം", "deshyam"],
        ["വരുന്നു", "varunnu"],
      ],
      blank: 1,
      notes:
        'Literally "anger is coming to me" — the natural way to say it. "I\'m angry with you": എനിക്ക് നിന്നോട് ദേഷ്യമുണ്ട് (enikku ninnodu deshyamundu).',
    },
    iAmOkay: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["കുഴപ്പമില്ല", "kuzhappamilla"],
      ],
      blank: 1,
      notes:
        'Literally "to me there is no trouble". Also the usual modest reply to "how are you?".',
    },
    iAmNotFeelingWell: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["സുഖമില്ല", "sukhamilla"],
      ],
      blank: 1,
      notes:
        'Literally "to me there is no well-being" — means "I\'m unwell". Also: എനിക്ക് വയ്യ (enikku vayya, I can\'t manage / I\'m not well), very common.',
    },
    dontWorry: {
      words: [["വിഷമിക്കേണ്ട", "vishamikkenda"]],
      accept: ["Don't feel bad", "Don't be sad"],
      notes:
        "-ഏണ്ട (-enda) = \"no need to\". Also പേടിക്കേണ്ട (pedikkenda, don't be scared), and youth slang ടെൻഷൻ അടിക്കേണ്ട (tension adikkenda, don't stress).",
    },
    iAmScared: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["പേടിയാണ്", "pediyaanu"],
      ],
      blank: 1,
      notes:
        'Literally "to me it is fear". "I\'m scared of dogs": എനിക്ക് പട്ടിയെ പേടിയാണ് (enikku pattiye pediyaanu).',
    },
    // Feelings, health & relationships › The body (lesson "body")
    head: { script: "തല", roman: "thala", notes: "Dental ത. Headache: തലവേദന (thalavedana)." },
    hand: {
      script: "കൈ",
      roman: "kai",
      notes: "Means hand and arm. With endings: കയ്യിൽ (kayyil, in the hand).",
    },
    leg: {
      script: "കാൽ",
      roman: "kaal",
      notes:
        "Means leg and foot. Touching someone with your foot by accident calls for an apology.",
    },
    eye: { script: "കണ്ണ്", roman: "kannu", notes: "Plural: കണ്ണുകൾ (kannukal)." },
    ear: { script: "ചെവി", roman: "chevi", notes: "Earache: ചെവിവേദന (chevivedana)." },
    mouth: {
      script: "വായ",
      roman: "vaaya",
      notes: "Long aa. Don't confuse with വായിക്കുക (vaayikkuka, to read).",
    },
    stomach: {
      script: "വയറ്",
      roman: "vayaru",
      notes: 'Stomach ache: വയറുവേദന (vayaruvedana). "I\'m full": വയറ് നിറഞ്ഞു (vayaru niranju).',
    },
    tooth: {
      script: "പല്ല്",
      roman: "pallu",
      notes: "Toothache: പല്ലുവേദന (palluvedana). To brush teeth: പല്ല് തേക്കുക (pallu thekkuka).",
    },
    // Feelings, health & relationships › At the doctor (lesson "health")
    fever: {
      script: "പനി",
      roman: "pani",
      notes:
        'Fevers are common in the monsoon; മഴക്കാലപ്പനി (mazhakkaalappani) is "monsoon fever".',
    },
    medicine: {
      script: "മരുന്ന്",
      roman: "marunnu",
      notes:
        'A pharmacy is മെഡിക്കൽ ഷോപ്പ് (medical shop). Medicine is "eaten": മരുന്ന് കഴിക്കുക (marunnu kazhikkuka).',
    },
    iHaveAFever: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["പനിയുണ്ട്", "paniyundu"],
      ],
      blank: 1,
      notes: 'Literally "to me there is fever". Illnesses use the dative + ഉണ്ട് (undu).',
    },
    iHaveAHeadache: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["തലവേദനയുണ്ട്", "thalavedanayundu"],
      ],
      blank: 1,
      notes:
        "തല (head) + വേദന (pain). Same pattern for other aches: പല്ലുവേദന (palluvedana, toothache).",
    },
    myStomachHurts: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["വയറുവേദനയുണ്ട്", "vayaruvedanayundu"],
      ],
      blank: 1,
      accept: ["I have a stomach ache"],
      notes:
        'Literally "to me there is stomach-pain". Also എന്റെ വയറ് വേദനിക്കുന്നു (ente vayaru vedanikkunnu, my stomach is hurting).',
    },
    iNeedADoctor: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ഒരു", "oru"],
        ["ഡോക്ടറെ", "doctore"],
        ["കാണണം", "kaananam"],
      ],
      blank: 3,
      accept: ["I need to see a doctor"],
      notes:
        'Literally "I need to see a doctor" — the natural way to say it. ഡോക്ടറെ (doctore) has the -എ object ending used for people.',
    },
    callADoctor: {
      words: [
        ["ഒരു", "oru"],
        ["ഡോക്ടറെ", "doctore"],
        ["വിളിക്കൂ", "vilikkoo"],
      ],
      blank: 2,
      notes: "In an emergency, add വേഗം (vegam, quickly): വേഗം ഒരു ഡോക്ടറെ വിളിക്കൂ!",
    },
    takeThisMedicine: {
      words: [
        ["ഈ", "ee"],
        ["മരുന്ന്", "marunnu"],
        ["കഴിക്കൂ", "kazhikkoo"],
      ],
      blank: 1,
      notes:
        'Medicine is "eaten" (കഴിക്കുക) in Malayalam, whether tablet or syrup. Doctors say: ഭക്ഷണത്തിന് ശേഷം (bhakshanathinu shesham, after food).',
    },
    // Feelings, health & relationships › Love & friendship (lesson "love-friendship")
    iLoveYou: {
      words: [
        ["ഞാൻ", "njaan"],
        ["നിന്നെ", "ninne"],
        ["സ്നേഹിക്കുന്നു", "snehikkunnu"],
      ],
      blank: 2,
      notes:
        'Correct, but sounds bookish or film-like. Couples more often say "I love you" in English, or എനിക്ക് നിന്നെ ഒരുപാട് ഇഷ്ടമാണ് (enikku ninne orupaadu ishtamaanu, I like you so much). Said to a partner, so the casual നിന്നെ (ninne) is natural.',
    },
    iLikeYou: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["നിന്നെ", "ninne"],
        ["ഇഷ്ടമാണ്", "ishtamaanu"],
      ],
      blank: 2,
      notes:
        'Literally "to me you are liked" — this is also how people actually confess love. Polite (to someone you don\'t know well): എനിക്ക് നിങ്ങളെ ഇഷ്ടമാണ് (enikku ningale ishtamaanu).',
    },
    iMissYou: {
      words: [
        ["ഞാൻ", "njaan"],
        ["നിന്നെ", "ninne"],
        ["മിസ്", "miss"],
        ["ചെയ്യുന്നു", "cheyyunnu"],
      ],
      blank: 2,
      notes:
        'Malayalam has no single native verb for "miss", so people mix English: "miss ചെയ്യുന്നു". Also common with the dative: എനിക്ക് നിന്നെ മിസ് ചെയ്യുന്നു (enikku ninne miss cheyyunnu). A warmer native way: നിന്നെ ഒരുപാട് ഓർക്കുന്നു (ninne orupaadu orkkunnu, I think of you a lot). To family: നിങ്ങളെയൊക്കെ കാണാൻ തോന്നുന്നു (ningaleyokke kaanaan thonnunnu, I feel like seeing you all).',
    },
    iLoveMyFamily: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["എന്റെ", "ente"],
        ["കുടുംബത്തെ", "kudumbathe"],
        ["ഒരുപാട്", "orupaadu"],
        ["ഇഷ്ടമാണ്", "ishtamaanu"],
      ],
      blank: 2,
      notes:
        'Literally "I like my family a lot" — natural and warm. ഞാൻ എന്റെ കുടുംബത്തെ സ്നേഹിക്കുന്നു (njaan ente kudumbathe snehikkunnu) is correct but sounds like an essay. Families show love more through care ("have you eaten?") than words.',
    },
    youAreMyFriend: {
      words: [
        ["നീ", "nee"],
        ["എന്റെ", "ente"],
        ["സുഹൃത്താണ്", "suhruthaanu"],
      ],
      blank: 2,
      notes:
        "Friends use the casual നീ (nee). Polite: നിങ്ങൾ എന്റെ സുഹൃത്താണ് (ningal ente suhruthaanu). Everyday: നീ എന്റെ കൂട്ടുകാരനാണ് / കൂട്ടുകാരിയാണ് (koottukaaranaanu / koottukaariyaanu).",
    },
    youAreMyBestFriend: {
      words: [
        ["നീ", "nee"],
        ["എന്റെ", "ente"],
        ["ഏറ്റവും", "ettavum"],
        ["അടുത്ത", "adutha"],
        ["സുഹൃത്താണ്", "suhruthaanu"],
      ],
      blank: 3,
      notes:
        'Literally "you are my closest friend". Young people say "best friend" in English or നീ എന്റെ ചങ്കാണ് (nee ente chankaanu, you\'re my heart / buddy).',
    },
    iLikeThis: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ഇത്", "ithu"],
        ["ഇഷ്ടമാണ്", "ishtamaanu"],
      ],
      blank: 2,
      notes:
        'Dative construction: "to me this is liked". Past: എനിക്ക് ഇത് ഇഷ്ടപ്പെട്ടു (enikku ithu ishtappettu, I liked it) — common after tasting food or seeing a film.',
    },
    iDontLikeThis: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["ഇത്", "ithu"],
        ["ഇഷ്ടമല്ല", "ishtamalla"],
      ],
      blank: 2,
      notes:
        "ഇഷ്ടം + അല്ല → ഇഷ്ടമല്ല (ishtamalla). Softer: എനിക്ക് ഇത് അത്ര ഇഷ്ടമല്ല (enikku ithu athra ishtamalla, I don't like it that much).",
    },
    takeCare: {
      words: [["ശ്രദ്ധിക്കണേ", "shraddhikkane"]],
      notes:
        'Literally "do be careful" — the -ഏ (-e) adds warmth. Also സൂക്ഷിക്കണം (sookshikkanam, be careful). "Take care" in English is common at the end of calls.',
    },
    // Practical communication › Weather (lesson "weather")
    weather: {
      script: "കാലാവസ്ഥ",
      roman: "kaalaavastha",
      notes: "Kerala talk about weather is mostly about rain: മഴ (mazha).",
    },
    hot: {
      script: "ചൂട്",
      roman: "choodu",
      notes:
        'A noun ("heat"); also "hot" for food and water: ചൂടുവെള്ളം (chooduvellam, hot water).',
    },
    cold: {
      script: "തണുപ്പ്",
      roman: "thanuppu",
      notes:
        'A noun ("coldness"). "Cold water": തണുത്ത വെള്ളം (thanutha vellam). A cold (illness) is ജലദോഷം (jaladosham).',
    },
    rain: {
      script: "മഴ",
      roman: "mazha",
      notes:
        "ഴ = zh. The monsoon is മഴക്കാലം (mazhakkaalam); the June monsoon is കാലവർഷം (kaalavarsham).",
    },
    sun: {
      script: "സൂര്യൻ",
      roman: "sooryan",
      notes:
        "Sunshine / hot sun is വെയിൽ (veyil): നല്ല വെയിലുണ്ട് (nalla veyilundu, it's very sunny).",
    },
    wind: {
      script: "കാറ്റ്",
      roman: "kaattu",
      notes: 'റ്റ is said "tt". A breeze: ഇളംകാറ്റ് (ilamkaattu).',
    },
    itIsHotToday: {
      words: [
        ["ഇന്ന്", "innu"],
        ["നല്ല", "nalla"],
        ["ചൂടുണ്ട്", "choodundu"],
      ],
      blank: 2,
      notes:
        'നല്ല (nalla, literally "good") here means "a lot of": "today there is good heat". Casual: ഇന്ന് ഭയങ്കര ചൂടാ (innu bhayankara choodaa).',
    },
    itIsRaining: {
      words: [
        ["മഴ", "mazha"],
        ["പെയ്യുന്നു", "peyyunnu"],
      ],
      blank: 0,
      notes:
        "പെയ്യുക (peyyuka) is used only for rain falling. Also: മഴ പെയ്യുന്നുണ്ട് (mazha peyyunnundu, it is raining (now)).",
    },
    itIsColdToday: {
      words: [
        ["ഇന്ന്", "innu"],
        ["നല്ല", "nalla"],
        ["തണുപ്പുണ്ട്", "thanuppundu"],
      ],
      blank: 2,
      notes:
        'Same pattern as "it is hot today". Kerala is rarely cold except in hill stations like Munnar (മൂന്നാർ).',
    },
    // Practical communication › College & work (lesson "college-work")
    classroom: {
      script: "ക്ലാസ്",
      roman: "class",
      notes:
        "Used for the lesson, the room and your year group: ഏത് ക്ലാസിലാണ്? (ethu classilaanu?, which class are you in?).",
    },
    exam: {
      script: "പരീക്ഷ",
      roman: "pareeksha",
      notes: '"Exam" in English is also very common among students.',
    },
    homework: {
      script: "ഹോംവർക്ക്",
      roman: "homework",
      notes: "The formal word is ഗൃഹപാഠം (grihapaadam), seen in textbooks.",
    },
    job: {
      script: "ജോലി",
      roman: "joli",
      notes:
        '"What job do you do?": എന്താണ് ജോലി? (enthaanu joli?) — a very common question in Kerala.',
    },
    holiday: {
      script: "അവധി",
      roman: "avadhi",
      notes:
        'Also "leave" from work: ഇന്ന് ഞാൻ ലീവാണ് (innu njaan leaveaanu, I\'m on leave today). Schools close for heavy rain on മഴ അവധി (mazha avadhi).',
    },
    iHaveAnExamTomorrow: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["നാളെ", "naale"],
        ["പരീക്ഷയുണ്ട്", "pareekshayundu"],
      ],
      blank: 2,
      notes: 'Literally "to me tomorrow there is an exam" — "to have" is dative + ഉണ്ട്.',
    },
    todayIsAHoliday: {
      words: [
        ["ഇന്ന്", "innu"],
        ["അവധിയാണ്", "avadhiyaanu"],
      ],
      blank: 1,
      notes: "Casual: ഇന്ന് ലീവാണ് (innu leaveaanu) or ഇന്ന് ഹോളിഡേ ആണ് (innu holiday aanu).",
    },
    iWorkInAnOffice: {
      words: [
        ["ഞാൻ", "njaan"],
        ["ഒരു", "oru"],
        ["ഓഫീസിൽ", "officil"],
        ["ജോലി", "joli"],
        ["ചെയ്യുന്നു", "cheyyunnu"],
      ],
      blank: 2,
      notes:
        "Also: എനിക്ക് ഒരു ഓഫീസിലാണ് ജോലി (enikku oru officilaanu joli, my job is in an office).",
    },
    // Practical communication › Hobbies & likes (lesson "hobbies")
    music: {
      script: "സംഗീതം",
      roman: "sangeetham",
      notes:
        'Formal. In speech people say "music" or പാട്ട് (paattu, songs): എനിക്ക് പാട്ട് കേൾക്കാൻ ഇഷ്ടമാണ് (I like listening to songs).',
    },
    movie: {
      script: "സിനിമ",
      roman: "cinema",
      notes:
        "Kerala calls a film a സിനിമ (cinema) or പടം (padam, picture). Malayalam cinema is called Mollywood.",
    },
    song: { script: "പാട്ട്", roman: "paattu", notes: '"To sing" is പാടുക (paaduka).' },
    cricket: {
      script: "ക്രിക്കറ്റ്",
      roman: "cricket",
      notes: "Football (ഫുട്ബോൾ) is at least as popular in Kerala, especially in Malabar.",
    },
    dance: {
      script: "നൃത്തം",
      roman: "nritham",
      notes: "Formal and used for classical dance (e.g. Mohiniyattam). Everyday: ഡാൻസ് (dance).",
    },
    iLikeMusic: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["സംഗീതം", "sangeetham"],
        ["ഇഷ്ടമാണ്", "ishtamaanu"],
      ],
      blank: 1,
      notes: "Dative construction. Everyday: എനിക്ക് പാട്ട് ഇഷ്ടമാണ് (enikku paattu ishtamaanu).",
    },
    doYouLikeCricket: {
      words: [
        ["നിങ്ങൾക്ക്", "ningalkku"],
        ["ക്രിക്കറ്റ്", "cricket"],
        ["ഇഷ്ടമാണോ?", "ishtamaano?"],
      ],
      blank: 1,
      notes: "Casual: നിനക്ക് ക്രിക്കറ്റ് ഇഷ്ടമാണോ? (ninakku cricket ishtamaano?).",
    },
    iLikeWatchingMovies: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["സിനിമ", "cinema"],
        ["കാണാൻ", "kaanaan"],
        ["ഇഷ്ടമാണ്", "ishtamaanu"],
      ],
      blank: 2,
      notes:
        '-ആൻ (-aan) = "to (do)": കാണാൻ (kaanaan, to watch). "Shall we see a film?": നമുക്ക് ഒരു സിനിമയ്ക്ക് പോകാം (namukku oru cinemaykku pokaam).',
    },
    whatIsYourHobby: {
      words: [
        ["നിങ്ങളുടെ", "ningalude"],
        ["ഹോബി", "hobby"],
        ["എന്താണ്?", "enthaanu?"],
      ],
      blank: 1,
      notes:
        '"Hobby" is used as is. A more natural native question: ഒഴിവുസമയത്ത് എന്ത് ചെയ്യും? (ozhivusamayathu enthu cheyyum?, what do you do in your free time?).',
    },
    // Practical communication › Plans & invitations (lesson "plans")
    letsGo: {
      words: [
        ["നമുക്ക്", "namukku"],
        ["പോകാം", "pokaam"],
      ],
      blank: 1,
      notes:
        'Literally "for us, (we) can go". Casual: വാ, പോകാം (vaa, pokaam) or just പോകാം (pokaam).',
    },
    comeToMyHouse: {
      words: [
        ["എന്റെ", "ente"],
        ["വീട്ടിലേക്ക്", "veettilekku"],
        ["വരൂ", "varoo"],
      ],
      blank: 1,
      notes:
        "A warm invitation: ഒരു ദിവസം വീട്ടിലേക്ക് വരണം (oru divasam veettilekku varanam, you must come home one day). Casual to a friend: വീട്ടിലേക്ക് വാ (veettilekku vaa).",
    },
    areYouFreeTomorrow: {
      words: [
        ["നിങ്ങൾക്ക്", "ningalkku"],
        ["നാളെ", "naale"],
        ["ഒഴിവുണ്ടോ?", "ozhivundo?"],
      ],
      blank: 2,
      notes:
        'Literally "do you have free time tomorrow?". Many people say ഫ്രീ (free): നാളെ ഫ്രീയാണോ? (naale freeyaano?).',
    },
    yesIWillCome: {
      words: [
        ["ശരി,", "shari,"],
        ["ഞാൻ", "njaan"],
        ["വരാം", "varaam"],
      ],
      blank: 2,
      notes:
        'വരാം (varaam) = "I\'ll come (gladly)" — the -ആം form sounds like a promise. വരും (varum) would be a plain prediction.',
    },
    sorryICantCome: {
      words: [
        ["ക്ഷമിക്കണം,", "kshamikkanam,"],
        ["എനിക്ക്", "enikku"],
        ["വരാൻ", "varaan"],
        ["പറ്റില്ല", "pattilla"],
      ],
      blank: 3,
      notes:
        'പറ്റില്ല (pattilla) = "not possible". Casual: സോറി, എനിക്ക് വരാൻ പറ്റില്ല (sorry, enikku varaan pattilla).',
    },
    seeYouTomorrow: {
      words: [
        ["നാളെ", "naale"],
        ["കാണാം", "kaanaam"],
      ],
      blank: 0,
      notes:
        'Literally "tomorrow (we) can see (each other)". Same pattern: പിന്നെ കാണാം (pinne kaanaam, see you later).',
    },
    // Practical communication › Requests & help (lesson "requests-help")
    canYouHelpMe: {
      words: [
        ["എന്നെ", "enne"],
        ["ഒന്ന്", "onnu"],
        ["സഹായിക്കാമോ?", "sahaayikkaamo?"],
      ],
      blank: 2,
      notes:
        'Literally "could you help me once?" — ഒന്ന് (onnu) makes it a small, polite favour. Casual: ഒന്ന് ഹെൽപ് ചെയ്യാമോ? (onnu help cheyyaamo?).',
    },
    iNeedHelp: {
      words: [
        ["എനിക്ക്", "enikku"],
        ["സഹായം", "sahaayam"],
        ["വേണം", "venam"],
      ],
      blank: 1,
      notes: 'Literally "to me help is needed" — same pattern as എനിക്ക് വെള്ളം വേണം.',
    },
    pleaseHelpMe: {
      words: [
        ["ദയവായി", "dayavaayi"],
        ["എന്നെ", "enne"],
        ["സഹായിക്കൂ", "sahaayikkoo"],
      ],
      blank: 2,
      notes:
        "A serious, earnest request. In everyday situations people prefer എന്നെ ഒന്ന് സഹായിക്കാമോ? (enne onnu sahaayikkaamo?).",
    },
    pleaseWait: {
      words: [
        ["ഒന്ന്", "onnu"],
        ["നിൽക്കൂ", "nilkkoo"],
      ],
      blank: 1,
      notes:
        'Literally "stand (still) a moment". For a longer wait: കുറച്ച് നേരം കാത്തിരിക്കൂ (kurachchu neram kaathirikkoo, please wait a while).',
    },
    pleaseTellMe: {
      words: [
        ["എന്നോട്", "ennodu"],
        ["പറയൂ", "parayoo"],
      ],
      blank: 1,
      notes:
        "-ഓട് (-odu) marks the person spoken to: എന്നോട് (ennodu, to me). Inviting someone to speak: പറഞ്ഞോളൂ (paranjoloo, go ahead, tell me).",
    },
    pleaseShowMe: {
      words: [
        ["ഒന്ന്", "onnu"],
        ["കാണിച്ചുതരൂ", "kaanichchutharoo"],
      ],
      blank: 1,
      notes:
        'കാണിച്ചുതരുക (kaanichchutharuka) = "show (to me)" — തരുക adds "for me". Softer: ഒന്ന് കാണിച്ചുതരാമോ? (onnu kaanichchutharaamo?).',
    },
    callMe: {
      words: [
        ["എന്നെ", "enne"],
        ["വിളിക്കൂ", "vilikkoo"],
      ],
      blank: 1,
      notes:
        "Works for phoning and for calling someone over. Friendly: എന്നെ ഒന്ന് വിളിക്കണേ (enne onnu vilikkane, do give me a call).",
    },
    help: {
      words: [["രക്ഷിക്കണേ!", "rakshikkane!"]],
      notes:
        'Literally "save (me)!" — the cry for help in an emergency. The police emergency number is 112.',
    },
    itsOkay: {
      words: [["സാരമില്ല", "saaramilla"]],
      accept: ["Never mind", "It doesn't matter"],
      notes:
        'Literally "it\'s of no importance" — used to reassure someone who apologises. Also കുഴപ്പമില്ല (kuzhappamilla, no problem).',
    },
  },
  extras: [
    // Greetings & polite words
    {
      key: "enthokkeyundu",
      lesson: "greetings",
      topic: "Greetings",
      words: [["എന്തൊക്കെയുണ്ട്?", "enthokkeyundu?"]],
      meaning: "How are things? / What's up?",
      notes:
        "The most common casual greeting between friends. Reply: സുഖം (sukham, fine) or ഇങ്ങനെ പോകുന്നു (ingane pokunnu, going on like this).",
    },
    {
      key: "uvvu",
      lesson: "polite-words",
      topic: "Polite words",
      script: "ഉവ്വ്",
      roman: "uvvu",
      meaning: "Yes (there is / it happened)",
      notes:
        '"Yes" for questions about existence or past events: ഭക്ഷണം കഴിച്ചോ? — ഉവ്വ് (did you eat? — yes). "Really?" is ഉവ്വോ? (uvvo?).',
    },
    {
      key: "venda",
      lesson: "polite-words",
      topic: "Polite words",
      script: "വേണ്ട",
      roman: "venda",
      meaning: "Don't want / no need",
      notes:
        "The polite way to refuse an offer: ചായ വേണോ? — വേണ്ട, നന്ദി (chaaya veno? — venda, nandi). Opposite of വേണം (venam, want).",
    },
    // Actions
    {
      key: "ariyuka",
      lesson: "actions",
      topic: "Actions",
      script: "അറിയുക",
      roman: "ariyuka",
      meaning: "To know",
      notes:
        "Used with the dative: എനിക്ക് അറിയാം (enikku ariyaam, I know), എനിക്ക് അറിയില്ല (enikku ariyilla, I don't know).",
    },
    {
      key: "parayuka",
      lesson: "actions",
      topic: "Actions",
      script: "പറയുക",
      roman: "parayuka",
      meaning: "To say / to tell",
      notes:
        'One of the most used verbs. Past പറഞ്ഞു (paranju). "Tell me": പറയൂ (parayoo); casual പറ (para).',
    },
    {
      key: "tharuka",
      lesson: "actions",
      topic: "Actions",
      script: "തരുക",
      roman: "tharuka",
      meaning: "To give (to me / us)",
      notes:
        "Used when the receiver is the speaker: തരൂ (tharoo, please give me), casual താ (thaa). Giving to others is കൊടുക്കുക (kodukkuka).",
    },
    // Where from
    {
      key: "naadu",
      lesson: "where-from",
      topic: "Introductions",
      script: "നാട്",
      roman: "naadu",
      meaning: "Native place / hometown",
      notes:
        "Malayalis often ask നാട് എവിടെയാ? (naadu evideyaa?, where's your native place?) — even people living in a city name their home village.",
    },
    {
      key: "keralam",
      lesson: "where-from",
      topic: "Introductions",
      script: "കേരളം",
      roman: "keralam",
      meaning: "Kerala",
      notes: 'The Malayalam name of the state. "In Kerala": കേരളത്തിൽ (keralathil).',
    },
    {
      key: "malayali",
      lesson: "where-from",
      topic: "Introductions",
      script: "മലയാളി",
      roman: "malayaali",
      meaning: "A Malayali (a Malayalam speaker / person from Kerala)",
      notes:
        "ഞാൻ ഒരു മലയാളിയാണ് (njaan oru malayaaliyaanu, I am a Malayali). Malayalis abroad are a huge community, especially in the Gulf.",
    },
    // Family
    {
      key: "appachan",
      lesson: "parents-children",
      topic: "Family",
      script: "അപ്പച്ചൻ",
      roman: "appachchan",
      meaning: "Father / dad (common in Christian families)",
      notes:
        "Also അപ്പൻ (appan) and പപ്പ (pappa). Mother in the same families is അമ്മച്ചി (ammachchi).",
    },
    {
      key: "ammachi",
      lesson: "parents-children",
      topic: "Family",
      script: "അമ്മച്ചി",
      roman: "ammachchi",
      meaning: "Mother / mom (common in Christian families)",
      notes:
        "Also used for grandmother in some families, and affectionately for any elderly woman.",
    },
    {
      key: "umma",
      lesson: "parents-children",
      topic: "Family",
      script: "ഉമ്മ",
      roman: "umma",
      meaning: "Mother (common in Muslim families)",
      notes: 'Not to be confused with ഉമ്മ meaning "a kiss" — context makes it clear.',
    },
    {
      key: "baappa",
      lesson: "parents-children",
      topic: "Family",
      script: "ബാപ്പ",
      roman: "baappa",
      meaning: "Father (common in Muslim families)",
      notes: "Also ഉപ്പ (uppa) and വാപ്പ (vaappa), depending on the region.",
    },
    {
      key: "ettan",
      lesson: "siblings",
      topic: "Family",
      script: "ഏട്ടൻ",
      roman: "ettan",
      meaning: "Elder brother (north and central Kerala)",
      notes:
        "Same meaning as ചേട്ടൻ (chettan), used especially in Malabar and Thrissur. Elder sister there is ഏച്ചി (echi) or ചേച്ചി.",
    },
    {
      key: "ikka",
      lesson: "siblings",
      topic: "Family",
      script: "ഇക്ക",
      roman: "ikka",
      meaning: "Elder brother (Muslim families, Malabar)",
      notes:
        'Also used respectfully for any older man, and widely known through film stars ("Mammukka").',
    },
    {
      key: "itha",
      lesson: "siblings",
      topic: "Family",
      script: "ഇത്ത",
      roman: "itha",
      meaning: "Elder sister (Muslim families, Malabar)",
      notes: "The counterpart of ഇക്ക (ikka); also used for an older woman.",
    },
    {
      key: "aliyan",
      lesson: "siblings",
      topic: "Family",
      script: "അളിയൻ",
      roman: "aliyan",
      meaning: "Brother-in-law",
      notes:
        "Also a joking, friendly way men address each other: എന്താ അളിയാ? (enthaa aliyaa?, what's up, mate?).",
    },
    {
      key: "muthachchhan",
      lesson: "grandparents",
      topic: "Family",
      script: "മുത്തച്ഛൻ",
      roman: "muthachchhan",
      meaning: "Grandfather (general)",
      notes:
        "Standard word for either grandfather. In the south, അപ്പൂപ്പൻ (appooppan) is more common.",
    },
    {
      key: "muthashshi",
      lesson: "grandparents",
      topic: "Family",
      script: "മുത്തശ്ശി",
      roman: "muthashshi",
      meaning: "Grandmother (general)",
      notes:
        "Standard word for either grandmother; famous from bedtime stories (മുത്തശ്ശിക്കഥ, muthashshikkatha, grandma's tale).",
    },
    {
      key: "appooppan",
      lesson: "grandparents",
      topic: "Family",
      script: "അപ്പൂപ്പൻ",
      roman: "appooppan",
      meaning: "Grandfather (south Kerala)",
      notes: "Common around Thiruvananthapuram and Kollam; also used for any old man.",
    },
    {
      key: "ammoomma",
      lesson: "grandparents",
      topic: "Family",
      script: "അമ്മൂമ്മ",
      roman: "ammoomma",
      meaning: "Grandmother (south Kerala)",
      notes: "Common in southern Kerala; also used kindly for any elderly woman.",
    },
    // People
    {
      key: "chetta",
      lesson: "people",
      topic: "People",
      script: "ചേട്ടാ",
      roman: "chetta",
      meaning: "Brother! (calling an older man)",
      notes:
        "The polite way to call a shopkeeper, conductor, auto driver or any man a bit older than you. It is the vocative of ചേട്ടൻ (chettan).",
    },
    {
      key: "chechee",
      lesson: "people",
      topic: "People",
      script: "ചേച്ചീ",
      roman: "chechee",
      meaning: "Sister! (calling an older woman)",
      notes: "The polite way to address a woman a bit older than you. Vocative of ചേച്ചി (chechi).",
    },
    {
      key: "mone",
      lesson: "people",
      topic: "People",
      script: "മോനേ",
      roman: "mone",
      meaning: "Son! / dear (to a boy or younger man)",
      notes: "Elders use it affectionately for any boy or young man, not only their own son.",
    },
    {
      key: "mole",
      lesson: "people",
      topic: "People",
      script: "മോളേ",
      roman: "mole",
      meaning: "Daughter! / dear (to a girl or younger woman)",
      notes: "Elders use it affectionately for any girl or young woman.",
    },
    // Food
    {
      key: "puttu",
      lesson: "food-staples",
      topic: "Food",
      script: "പുട്ട്",
      roman: "puttu",
      meaning: "Puttu (steamed rice-flour and coconut cylinders)",
      notes:
        "A classic Kerala breakfast, often eaten with കടല (kadala, black chickpea curry) or banana: പുട്ടും കടലയും (puttum kadalayum).",
    },
    {
      key: "appam",
      lesson: "food-staples",
      topic: "Food",
      script: "അപ്പം",
      roman: "appam",
      meaning: "Appam (lacy fermented rice pancake)",
      notes:
        "Soft in the middle and crisp at the edges; eaten with stew or egg curry. Also called പാലപ്പം (paalappam).",
    },
    {
      key: "sambar",
      lesson: "food-staples",
      topic: "Food",
      script: "സാമ്പാർ",
      roman: "saambaar",
      meaning: "Sambar (lentil and vegetable curry)",
      notes: "Served with rice, dosa and idli; a must at the sadya feast.",
    },
    {
      key: "aviyal",
      lesson: "food-staples",
      topic: "Food",
      script: "അവിയൽ",
      roman: "aviyal",
      meaning: "Aviyal (mixed vegetables in coconut and curd)",
      notes:
        'A thick mixed-vegetable dish; a sadya favourite. Also used jokingly for any "mixture" of things.',
    },
    {
      key: "kattan-chaaya",
      lesson: "drinks",
      topic: "Drinks",
      script: "കട്ടൻ ചായ",
      roman: "kattan chaaya",
      meaning: "Black tea (no milk)",
      notes: "Often just കട്ടൻ (kattan). Popular in the evening and in the rain.",
    },
    {
      key: "sambharam",
      lesson: "drinks",
      topic: "Drinks",
      script: "സംഭാരം",
      roman: "sambhaaram",
      meaning: "Spiced buttermilk",
      notes:
        "Buttermilk with ginger, green chilli, shallots and curry leaves — Kerala's summer cooler.",
    },
    {
      key: "karikku",
      lesson: "drinks",
      topic: "Drinks",
      script: "കരിക്ക്",
      roman: "karikku",
      meaning: "Tender coconut",
      notes:
        "Sold at roadside stalls; the vendor cuts it open and you drink the water, then scoop the soft flesh.",
    },
    {
      key: "naaranga-vellam",
      lesson: "drinks",
      topic: "Drinks",
      script: "നാരങ്ങാവെള്ളം",
      roman: "naarangaavellam",
      meaning: "Lime juice (fresh lime water)",
      notes: 'Literally "lime water". Order it sweet or salted: ഉപ്പിട്ട് (uppittu, with salt).',
    },
    {
      key: "thenga",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      script: "തേങ്ങ",
      roman: "thenga",
      meaning: "Coconut",
      notes:
        "The basis of Kerala cooking; കേരളം itself is often linked to കേരം (keram, coconut palm). The tree is തെങ്ങ് (thengu).",
    },
    {
      key: "chakka",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      script: "ചക്ക",
      roman: "chakka",
      meaning: "Jackfruit",
      notes: "Kerala's state fruit, eaten ripe or cooked as a curry when raw.",
    },
    {
      key: "kappa",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      script: "കപ്പ",
      roman: "kappa",
      meaning: "Tapioca (cassava)",
      notes:
        "Boiled or mashed kappa with fish curry, കപ്പയും മീൻകറിയും (kappayum meenkariyum), is a beloved Kerala meal.",
    },
    {
      key: "pazhampori",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      script: "പഴംപൊരി",
      roman: "pazhampori",
      meaning: "Banana fritters",
      notes: "Ripe nendran banana slices dipped in batter and fried — the classic tea-time snack.",
    },
    {
      key: "meenkari",
      lesson: "hungry-thirsty",
      topic: "Food",
      script: "മീൻകറി",
      roman: "meenkari",
      meaning: "Fish curry",
      notes:
        'Usually red and tangy with കുടംപുളി (kudampuli, Malabar tamarind). "Is there fish curry?" — മീൻകറി ഉണ്ടോ? (meenkari undo?).',
    },
    {
      key: "porotta",
      lesson: "ordering-food",
      topic: "Restaurant",
      script: "പൊറോട്ട",
      roman: "porotta",
      meaning: "Porotta (flaky layered flatbread)",
      notes: "Hugely popular in Kerala restaurants, typically with beef or chicken curry.",
    },
    {
      key: "sadya",
      lesson: "ordering-food",
      topic: "Restaurant",
      script: "സദ്യ",
      roman: "sadya",
      meaning: "Sadya (traditional vegetarian feast on a banana leaf)",
      notes:
        "Served at weddings and Onam with rice, many curries, pappadam and payasam. Eaten with the right hand.",
    },
    {
      key: "mathi",
      lesson: "ordering-food",
      topic: "Restaurant",
      script: "മതി",
      roman: "mathi",
      meaning: "Enough / that's enough",
      notes:
        'Say this to stop more servings: മതി, മതി! (mathi, mathi!). Also "that will do": ഇത് മതി (ithu mathi). Don\'t confuse with മത്തി (mathi, sardine), spelled with ത്ത.',
    },
    {
      key: "payasam",
      lesson: "food-review",
      topic: "Food",
      script: "പായസം",
      roman: "paayasam",
      meaning: "Payasam (sweet milk or jaggery pudding)",
      notes:
        "The dessert of every sadya; അടപ്രഥമൻ (adapradhaman) and പാൽപ്പായസം (paalppaayasam) are famous kinds.",
    },
    {
      key: "pappadam",
      lesson: "food-review",
      topic: "Food",
      script: "പപ്പടം",
      roman: "pappadam",
      meaning: "Pappadam (crisp lentil wafer)",
      notes: "Crushed over rice with payasam at a sadya, or eaten on the side.",
    },
    // Numbers & time
    {
      key: "laksham",
      lesson: "big-numbers",
      topic: "Numbers",
      script: "ലക്ഷം",
      roman: "laksham",
      meaning: "One lakh (100,000)",
      notes:
        "Indian counting groups big numbers in lakhs and crores: ഒരു ലക്ഷം രൂപ (oru laksham roopa). Ten lakh = one million.",
    },
    {
      key: "mani",
      lesson: "time",
      topic: "Time",
      script: "മണി",
      roman: "mani",
      meaning: 'O\'clock / hour (literally "bell")',
      notes: "അഞ്ച് മണി (anchu mani, five o'clock); മണിക്കൂർ (manikkoor) = an hour (duration).",
    },
    {
      key: "neram",
      lesson: "time",
      topic: "Time",
      script: "നേരം",
      roman: "neram",
      meaning: "Time / a while",
      notes:
        "കുറച്ച് നേരം (kurachchu neram, a little while); നേരം വൈകി (neram vaiki, it got late).",
    },
    {
      key: "onam",
      lesson: "days",
      topic: "Days",
      script: "ഓണം",
      roman: "onam",
      meaning: "Onam (Kerala's harvest festival)",
      notes:
        "Celebrated in Chingam (Aug–Sep) by everyone, with pookkalam, sadya and boat races. Greeting: ഓണാശംസകൾ (onaashamsakal, Happy Onam).",
    },
    {
      key: "vishu",
      lesson: "days",
      topic: "Days",
      script: "വിഷു",
      roman: "vishu",
      meaning: "Vishu (Malayalam new year, in April)",
      notes:
        "The day starts with വിഷുക്കണി (vishukkani, an auspicious first sight) and elders give വിഷുക്കൈനീട്ടം (vishukkaineettam, gift money).",
    },
    {
      key: "perunnaal",
      lesson: "days",
      topic: "Days",
      script: "പെരുന്നാൾ",
      roman: "perunnaal",
      meaning: "Eid / a feast day",
      notes:
        "Muslims celebrate ചെറിയ പെരുന്നാൾ (cheriya perunnaal, Eid al-Fitr) and വലിയ പെരുന്നാൾ (valiya perunnaal, Eid al-Adha); churches also hold perunnaal feasts.",
    },
    // Daily life
    {
      key: "pallu-thekkuka",
      lesson: "routine-verbs",
      topic: "Daily routine",
      script: "പല്ല് തേക്കുക",
      roman: "pallu thekkuka",
      meaning: "To brush one's teeth",
      notes: '"Did you brush your teeth?": പല്ല് തേച്ചോ? (pallu thechcho?).',
    },
    {
      key: "unnuka",
      lesson: "routine-verbs",
      topic: "Daily routine",
      script: "ഉണ്ണുക",
      roman: "unnuka",
      meaning: "To eat a (rice) meal",
      notes:
        "From ഊണ് (oonu, rice meal). Heard in the classic question ചോറുണ്ടോ? (chorundo?, have you had your rice?) — a homely, traditional word.",
    },
    // Places
    {
      key: "chaayakkada",
      lesson: "places-1",
      topic: "Places",
      script: "ചായക്കട",
      roman: "chaayakkada",
      meaning: "Tea shop",
      notes:
        "The small roadside tea shop is the social heart of every Kerala village — tea, snacks and newspaper talk.",
    },
    {
      key: "kaayal",
      lesson: "places-2",
      topic: "Places",
      script: "കായൽ",
      roman: "kaayal",
      meaning: "Backwater / lagoon",
      notes:
        "Kerala's famous backwaters, e.g. around Alappuzha and Kumarakom, explored by houseboat.",
    },
    {
      key: "kadappuram",
      lesson: "places-2",
      topic: "Places",
      script: "കടപ്പുറം",
      roman: "kadappuram",
      meaning: "Beach / seashore",
      notes: "Also ബീച്ച് (beach). The sea is കടൽ (kadal).",
    },
    {
      key: "palli",
      lesson: "places-2",
      topic: "Places",
      script: "പള്ളി",
      roman: "palli",
      meaning: "Church / mosque",
      notes:
        "The same word is used for both; context (or പള്ളി + name) makes it clear. A school was once called പള്ളിക്കൂടം (pallikkoodam).",
    },
    {
      key: "vazhi",
      lesson: "asking-directions",
      topic: "Directions",
      script: "വഴി",
      roman: "vazhi",
      meaning: "Way / road / route",
      notes: '"Which way?": ഏത് വഴി? (ethu vazhi?). "Via Thrissur": തൃശ്ശൂർ വഴി (Thrissur vazhi).',
    },
    {
      key: "ingottu",
      lesson: "asking-directions",
      topic: "Directions",
      script: "ഇങ്ങോട്ട്",
      roman: "ingottu",
      meaning: "This way / towards here",
      notes: "ഇങ്ങോട്ട് വരൂ (ingottu varoo, come this way).",
    },
    {
      key: "angottu",
      lesson: "asking-directions",
      topic: "Directions",
      script: "അങ്ങോട്ട്",
      roman: "angottu",
      meaning: "That way / towards there",
      notes: "അങ്ങോട്ട് പോകൂ (angottu pokoo, go that way).",
    },
    // Shopping
    {
      key: "chillara",
      lesson: "money-words",
      topic: "Shopping",
      script: "ചില്ലറ",
      roman: "chillara",
      meaning: "Small change (coins / small notes)",
      notes:
        "Bus conductors and shopkeepers often ask ചില്ലറ ഉണ്ടോ? (chillara undo?, do you have change?).",
    },
    {
      key: "pookkalam",
      lesson: "colours",
      topic: "Colours",
      script: "പൂക്കളം",
      roman: "pookkalam",
      meaning: "Pookkalam (flower carpet made for Onam)",
      notes: "Colourful flower designs laid in front of homes during the ten days of Onam.",
    },
    {
      key: "mundu",
      lesson: "clothes",
      topic: "Clothes",
      script: "മുണ്ട്",
      roman: "mundu",
      meaning: "Mundu (white wrap-around cloth worn by men)",
      notes:
        "Often folded up to the knee when walking. Festive versions have a gold border (കസവ്, kasavu).",
    },
    {
      key: "kaili",
      lesson: "clothes",
      topic: "Clothes",
      script: "കൈലി",
      roman: "kaili",
      meaning: "Kaili / lungi (coloured casual wrap)",
      notes:
        "The everyday, coloured version of the mundu, worn at home. Also called ലുങ്കി (lungi).",
    },
    {
      key: "churidar",
      lesson: "clothes",
      topic: "Clothes",
      script: "ചുരിദാർ",
      roman: "churidaar",
      meaning: "Churidar (tunic with fitted trousers)",
      notes: "The everyday outfit of many women and college girls in Kerala.",
    },
    {
      key: "settu-mundu",
      lesson: "clothes",
      topic: "Clothes",
      script: "സെറ്റുമുണ്ട്",
      roman: "settumundu",
      meaning: "Set-mundu (women's traditional two-piece Kerala dress)",
      notes: "Cream with a gold border, worn for Onam, Vishu and temple visits.",
    },
    // Travel
    {
      key: "vallam",
      lesson: "vehicles",
      topic: "Transport",
      script: "വള്ളം",
      roman: "vallam",
      meaning: "Country boat",
      notes:
        "A motor boat or ferry is ബോട്ട് (boat). Water transport is common in Kochi and Alappuzha.",
    },
    {
      key: "aanavandi",
      lesson: "vehicles",
      topic: "Transport",
      script: "ആനവണ്ടി",
      roman: "aanavandi",
      meaning: 'KSRTC bus (nickname, "elephant vehicle")',
      notes: "Affectionate nickname for Kerala's state-run buses, from the elephant logo.",
    },
    {
      key: "bus-stand",
      lesson: "travel-words",
      topic: "Travel",
      script: "ബസ് സ്റ്റാൻഡ്",
      roman: "bus stand",
      meaning: "Bus station / bus terminus",
      notes:
        "Different from a roadside ബസ് സ്റ്റോപ്പ് (bus stop). Towns often have a KSRTC stand and a private bus stand.",
    },
    // Conversation
    {
      key: "alle",
      lesson: "conv-friend",
      topic: "Conversation",
      words: [["അല്ലേ?", "alle?"]],
      meaning: "Isn't it? / Right?",
      notes:
        "Tag question added to sentences: നല്ല ചൂട്, അല്ലേ? (nalla choodu, alle?, it's hot, isn't it?).",
    },
    {
      key: "pinne",
      lesson: "conv-friend",
      topic: "Conversation",
      script: "പിന്നെ",
      roman: "pinne",
      meaning: "Then / and so / later",
      notes:
        "A very common filler that starts a new topic: പിന്നെ, എന്താ വിശേഷം? (pinne, enthaa vishesham?, so, what's new?).",
    },
    // Body & health
    {
      key: "mudi",
      lesson: "body",
      topic: "Body",
      script: "മുടി",
      roman: "mudi",
      meaning: "Hair",
      notes: "Long hair, often oiled with coconut oil, is traditional in Kerala.",
    },
    {
      key: "jaladosham",
      lesson: "health",
      topic: "Health",
      script: "ജലദോഷം",
      roman: "jaladosham",
      meaning: "A cold (illness)",
      notes:
        '"I have a cold": എനിക്ക് ജലദോഷമുണ്ട് (enikku jaladoshamundu). In speech, people also say "cold" in English.',
    },
    // Relationships
    {
      key: "chanku",
      lesson: "love-friendship",
      topic: "Relationships",
      script: "ചങ്ക്",
      roman: "chanku",
      meaning: 'Best buddy (slang, literally "heart / chest")',
      notes:
        "Youth slang for a very close friend: അവൻ എന്റെ ചങ്കാണ് (avan ente chankaanu, he's my best buddy).",
    },
    {
      key: "koottukaaran",
      lesson: "love-friendship",
      topic: "Relationships",
      script: "കൂട്ടുകാരൻ",
      roman: "koottukaaran",
      meaning: "Friend (male)",
      notes: "The everyday word for a male friend; plural കൂട്ടുകാർ (koottukaar, friends).",
    },
    {
      key: "koottukaari",
      lesson: "love-friendship",
      topic: "Relationships",
      script: "കൂട്ടുകാരി",
      roman: "koottukaari",
      meaning: "Friend (female)",
      notes: "The everyday word for a female friend.",
    },
    // Weather
    {
      key: "mazhakkaalam",
      lesson: "weather",
      topic: "Weather",
      script: "മഴക്കാലം",
      roman: "mazhakkaalam",
      meaning: "Rainy season / monsoon",
      notes: "Kerala's monsoon starts in early June; schools often reopen in the first rains.",
    },
    {
      key: "veyil",
      lesson: "weather",
      topic: "Weather",
      script: "വെയിൽ",
      roman: "veyil",
      meaning: "Sunshine / hot sun",
      notes: '"Don\'t stand in the sun": വെയിലത്ത് നിൽക്കരുത് (veyilathu nilkkaruthu).',
    },
    // College & hobbies
    {
      key: "saar",
      lesson: "college-work",
      topic: "College & work",
      script: "സാർ",
      roman: "saar",
      meaning: "Sir (teacher / officer)",
      notes:
        "Students call male teachers സാർ and female teachers ടീച്ചർ (teacher) — both as titles and as nouns.",
    },
    {
      key: "adipoli",
      lesson: "hobbies",
      topic: "Hobbies",
      script: "അടിപൊളി",
      roman: "adipoli",
      meaning: "Awesome! / Super!",
      notes:
        "The most famous Malayalam slang word, for food, films, parties — anything great. Also കിടിലൻ (kidilan, fantastic).",
    },
    {
      key: "kathakali",
      lesson: "hobbies",
      topic: "Hobbies",
      script: "കഥകളി",
      roman: "kathakali",
      meaning: "Kathakali (Kerala's classical dance-drama)",
      notes: 'Literally "story-play"; known for elaborate green face make-up and huge costumes.',
    },
    {
      key: "vallamkali",
      lesson: "hobbies",
      topic: "Hobbies",
      script: "വള്ളംകളി",
      roman: "vallamkali",
      meaning: "Snake boat race",
      notes:
        "Races of long ചുണ്ടൻ വള്ളം (chundan vallam, snake boats) held around Onam, e.g. the Nehru Trophy at Alappuzha.",
    },
  ],
  dialogues: {
    meetingSomeone: {
      context: "Ravi meets Asha at a friend's house in Thiruvananthapuram.",
      lines: [
        { speaker: "A", script: "നമസ്കാരം.", roman: "namaskaaram.", meaning: "Hello." },
        { speaker: "B", script: "നമസ്കാരം.", roman: "namaskaaram.", meaning: "Hello." },
        {
          speaker: "A",
          script: "നിങ്ങളുടെ പേര് എന്താണ്?",
          roman: "ningalude peru enthaanu?",
          meaning: "What is your name?",
        },
        {
          speaker: "B",
          script: "എന്റെ പേര് ആശ. നിങ്ങളുടെ പേരോ?",
          roman: "ente peru Asha. ningalude pero?",
          meaning: "My name is Asha. And your name?",
        },
        {
          speaker: "A",
          script: "എന്റെ പേര് രവി. നിങ്ങൾ എവിടെ നിന്നാണ്?",
          roman: "ente peru Ravi. ningal evide ninnaanu?",
          meaning: "My name is Ravi. Where are you from?",
        },
        {
          speaker: "B",
          script: "ഞാൻ കൊച്ചിയിൽ നിന്നാണ്. നിങ്ങളെ കണ്ടതിൽ സന്തോഷം.",
          roman: "njaan Kochiyil ninnaanu. ningale kandathil santhosham.",
          meaning: "I am from Kochi. Nice to meet you.",
        },
        {
          speaker: "A",
          script: "എനിക്കും സന്തോഷം.",
          roman: "enikkum santhosham.",
          meaning: "Nice to meet you too.",
        },
      ],
    },
    meetingFriend: {
      context: "Two old friends run into each other in Thrissur town.",
      lines: [
        {
          speaker: "A",
          script: "ഹായ്! സുഖമാണോ?",
          roman: "haay! sukhamaano?",
          meaning: "Hi! How are you?",
        },
        {
          speaker: "B",
          script: "സുഖം. നിനക്കോ?",
          roman: "sukham. ninakko?",
          meaning: "I'm fine. And you?",
        },
        {
          speaker: "A",
          script: "എനിക്കും സുഖം. കണ്ടിട്ട് കുറെ നാളായല്ലോ!",
          roman: "enikkum sukham. kandittu kure naalaayallo!",
          meaning: "I'm fine too. Long time no see!",
        },
        {
          speaker: "B",
          script: "അതെ. ഇപ്പോൾ എന്താ പരിപാടി?",
          roman: "athe. ippol enthaa paripaadi?",
          meaning: "Yes. What are you doing these days?",
        },
        {
          speaker: "A",
          script: "ഞാൻ പഠിക്കുകയാണ്. നീ ഭക്ഷണം കഴിച്ചോ?",
          roman: "njaan padikkukayaanu. nee bhakshanam kazhichcho?",
          meaning: "I'm studying. Have you eaten?",
        },
        {
          speaker: "B",
          script: "ഉവ്വ്, കഴിച്ചു. വാ, ഒരു ചായ കുടിക്കാം.",
          roman: "uvvu, kazhichchu. vaa, oru chaaya kudikkaam.",
          meaning: "Yes, I have eaten. Come, let's have tea.",
        },
        {
          speaker: "A",
          script: "ശരി, പോകാം.",
          roman: "shari, pokaam.",
          meaning: "Okay, let's go.",
        },
      ],
    },
    restaurant: {
      context: 'Asha orders lunch at a small "hotel" (restaurant) in Thiruvananthapuram.',
      lines: [
        {
          speaker: "A",
          script: "എന്താണ് വേണ്ടത്?",
          roman: "enthaanu vendathu?",
          meaning: "What would you like?",
        },
        {
          speaker: "B",
          script: "ഒരു പ്ലേറ്റ് ചോറും പരിപ്പും തരൂ.",
          roman: "oru plate chorum parippum tharoo.",
          meaning: "Please give me one plate of rice and dal.",
        },
        {
          speaker: "A",
          script: "കുടിക്കാൻ എന്തെങ്കിലും വേണോ?",
          roman: "kudikkaan enthenkilum veno?",
          meaning: "Anything to drink?",
        },
        {
          speaker: "B",
          script: "ഒരു ചായ, പഞ്ചസാര ഇടാതെ.",
          roman: "oru chaaya, panchasaara idaathe.",
          meaning: "One tea, without sugar, please.",
        },
        {
          speaker: "A",
          script: "ശരി. വേറെ എന്തെങ്കിലും?",
          roman: "shari. vere enthenkilum?",
          meaning: "Okay. Anything else?",
        },
        {
          speaker: "B",
          script: "കുറച്ച് വെള്ളവും വേണം. ഇതിന് എരിവുണ്ടോ?",
          roman: "kurachchu vellavum venam. ithinu erivundo?",
          meaning: "Some water too, please. Is it spicy?",
        },
        {
          speaker: "A",
          script: "കുറച്ച് എരിവുണ്ട്.",
          roman: "kurachchu erivundu.",
          meaning: "A little spicy.",
        },
        {
          speaker: "B",
          script: "കുഴപ്പമില്ല. കഴിച്ചിട്ട് ബിൽ തരൂ.",
          roman: "kuzhappamilla. kazhichchittu bill tharoo.",
          meaning: "That's fine. Please bring the bill after the meal.",
        },
      ],
    },
    shopping: {
      context: "Ravi buys mangoes at a market stall in Kozhikode.",
      lines: [
        {
          speaker: "A",
          script: "ചേട്ടാ, മാങ്ങ ഉണ്ടോ?",
          roman: "chetta, maanga undo?",
          meaning: "Brother, do you have mangoes?",
        },
        { speaker: "B", script: "ഉണ്ട്.", roman: "undu.", meaning: "Yes, we have." },
        {
          speaker: "A",
          script: "ഒരു കിലോയ്ക്ക് എത്രയാണ്?",
          roman: "oru kiloykku ethrayaanu?",
          meaning: "How much does one kilo cost?",
        },
        {
          speaker: "B",
          script: "നൂറ് രൂപ.",
          roman: "nooru roopa.",
          meaning: "One hundred rupees.",
        },
        {
          speaker: "A",
          script: "അത് വളരെ കൂടുതലാണ്. കുറച്ച് കുറയ്ക്കാമോ?",
          roman: "athu valare kooduthalaanu. kurachchu kuraykkaamo?",
          meaning: "That is too expensive. Could you reduce it a little?",
        },
        {
          speaker: "B",
          script: "ശരി, തൊണ്ണൂറ് രൂപ.",
          roman: "shari, thonnooru roopa.",
          meaning: "Okay, ninety rupees.",
        },
        {
          speaker: "A",
          script: "ശരി, ഒരു കിലോ എടുക്കാം.",
          roman: "shari, oru kilo edukkaam.",
          meaning: "Fine, I will take one kilo.",
        },
      ],
    },
    directions: {
      context: "A visitor asks a passer-by the way to Ernakulam railway station in Kochi.",
      lines: [
        {
          speaker: "A",
          script: "ക്ഷമിക്കണം, റെയിൽവേ സ്റ്റേഷൻ എവിടെയാണ്?",
          roman: "kshamikkanam, railway station evideyaanu?",
          meaning: "Excuse me, where is the railway station?",
        },
        {
          speaker: "B",
          script: "നേരെ പോയിട്ട് ഇടത്തോട്ട് തിരിയൂ.",
          roman: "nere poyittu idathottu thiriyoo.",
          meaning: "Go straight, then turn left.",
        },
        { speaker: "A", script: "ദൂരമുണ്ടോ?", roman: "dooramundo?", meaning: "Is it far?" },
        {
          speaker: "B",
          script: "ഇല്ല, അടുത്താണ്. നടന്നാൽ ഒരു അഞ്ച് മിനിറ്റ്.",
          roman: "illa, aduthaanu. nadannaal oru anchu minute.",
          meaning: "No, it is near. About five minutes on foot.",
        },
        {
          speaker: "A",
          script: "വളരെ നന്ദി.",
          roman: "valare nandi.",
          meaning: "Thank you very much.",
        },
        {
          speaker: "B",
          script: "ഓ, അതിനെന്താ.",
          roman: "o, athinenthaa.",
          meaning: "Oh, you're welcome.",
        },
      ],
    },
    college: {
      context:
        "On her first day at a college in Thiruvananthapuram, Asha talks to a senior student.",
      lines: [
        {
          speaker: "A",
          script: "ഹായ്, നിങ്ങൾ ഇവിടെ പുതിയതാണോ?",
          roman: "haay, ningal ivide puthiyathaano?",
          meaning: "Hi, are you new here?",
        },
        {
          speaker: "B",
          script: "അതെ, ഇന്ന് എന്റെ ആദ്യത്തെ ദിവസമാണ്.",
          roman: "athe, innu ente aadyathe divasamaanu.",
          meaning: "Yes, today is my first day.",
        },
        {
          speaker: "A",
          script: "ഏത് ക്ലാസിലാണ്?",
          roman: "ethu classilaanu?",
          meaning: "Which class are you in?",
        },
        {
          speaker: "B",
          script: "ഫസ്റ്റ് ഇയറിലാണ്. ലൈബ്രറി എവിടെയാണ്?",
          roman: "first yearilaanu. library evideyaanu?",
          meaning: "I'm in first year. Where is the library?",
        },
        {
          speaker: "A",
          script: "ഓഫീസിന്റെ പിന്നിലാണ്. വരൂ, ഞാൻ കാണിച്ചുതരാം.",
          roman: "officinte pinnilaanu. varoo, njaan kaanichchutharaam.",
          meaning: "It is behind the office. Come, I will show you.",
        },
        {
          speaker: "B",
          script: "നന്ദി! പരീക്ഷ എപ്പോഴാണ്?",
          roman: "nandi! pareeksha eppozhaanu?",
          meaning: "Thank you! When is the exam?",
        },
        { speaker: "A", script: "അടുത്ത മാസം.", roman: "adutha maasam.", meaning: "Next month." },
      ],
    },
    phoneCall: {
      context: "Ravi calls his friend to invite her over.",
      lines: [
        { speaker: "A", script: "ഹലോ?", roman: "hello?", meaning: "Hello?" },
        {
          speaker: "B",
          script: "ഹലോ, ആരാണ് സംസാരിക്കുന്നത്?",
          roman: "hello, aaraanu samsaarikkunnathu?",
          meaning: "Hello, who is speaking?",
        },
        {
          speaker: "A",
          script: "ഞാനാണ്, രവി. നീ എവിടെയാണ്?",
          roman: "njaanaanu, Ravi. nee evideyaanu?",
          meaning: "It's me, Ravi. Where are you?",
        },
        {
          speaker: "B",
          script: "ഞാൻ വീട്ടിലാണ്. എന്തുപറ്റി?",
          roman: "njaan veettilaanu. enthupatti?",
          meaning: "I am at home. What happened?",
        },
        {
          speaker: "A",
          script: "നാളെ നിനക്ക് ഒഴിവുണ്ടോ?",
          roman: "naale ninakku ozhivundo?",
          meaning: "Are you free tomorrow?",
        },
        {
          speaker: "B",
          script: "ഉവ്വ്, ഒഴിവുണ്ട്.",
          roman: "uvvu, ozhivundu.",
          meaning: "Yes, I am free.",
        },
        {
          speaker: "A",
          script: "എന്നാൽ വൈകുന്നേരം എന്റെ വീട്ടിലേക്ക് വാ.",
          roman: "ennaal vaikunneram ente veettilekku vaa.",
          meaning: "Then come to my house in the evening.",
        },
        {
          speaker: "B",
          script: "ശരി, ഞാൻ വരാം. ഞാൻ പിന്നെ വിളിക്കാം.",
          roman: "shari, njaan varaam. njaan pinne vilikkaam.",
          meaning: "Okay, I will come. I will call you later.",
        },
      ],
    },
    askingForHelp: {
      context: "A visitor in Kozhikode can't find an address and asks a shopkeeper for help.",
      lines: [
        {
          speaker: "A",
          script: "ചേട്ടാ, എന്നെ ഒന്ന് സഹായിക്കാമോ?",
          roman: "chetta, enne onnu sahaayikkaamo?",
          meaning: "Excuse me (brother), can you help me?",
        },
        {
          speaker: "B",
          script: "എന്താ, പറയൂ.",
          roman: "enthaa, parayoo.",
          meaning: "Yes, tell me.",
        },
        {
          speaker: "A",
          script: "എനിക്ക് വഴി തെറ്റി. ഈ അഡ്രസ്സ് എനിക്ക് മനസ്സിലാകുന്നില്ല.",
          roman: "enikku vazhi thetti. ee address enikku manassilaakunnilla.",
          meaning: "I am lost. I don't understand this address.",
        },
        {
          speaker: "B",
          script: "കാണിക്കൂ. ഇത് ചന്തയുടെ അടുത്താണ്.",
          roman: "kaanikkoo. ithu chanthayude aduthaanu.",
          meaning: "Show me. This is near the market.",
        },
        {
          speaker: "A",
          script: "കുറച്ച് പതുക്കെ പറയാമോ?",
          roman: "kurachchu pathukke parayaamo?",
          meaning: "Could you speak a little slowly?",
        },
        {
          speaker: "B",
          script: "ചന്തയിൽ പോയി അവിടെ ചോദിക്കൂ. അത് അടുത്താണ്.",
          roman: "chanthayil poyi avide chodikkoo. athu aduthaanu.",
          meaning: "Go to the market and ask there. It is close.",
        },
        {
          speaker: "A",
          script: "വളരെ നന്ദി, ചേട്ടാ.",
          roman: "valare nandi, chetta.",
          meaning: "Thank you so much.",
        },
      ],
    },
    travel: {
      context: "In Thrissur, a passenger gets on a town bus and talks to the conductor.",
      lines: [
        {
          speaker: "A",
          script: "ഈ ബസ് റെയിൽവേ സ്റ്റേഷനിലേക്ക് പോകുമോ?",
          roman: "ee bus railway stationilekku pokumo?",
          meaning: "Does this bus go to the railway station?",
        },
        {
          speaker: "B",
          script: "പോകും. എവിടെയാണ് ഇറങ്ങേണ്ടത്?",
          roman: "pokum. evideyaanu irangendathu?",
          meaning: "Yes. Where do you want to get off?",
        },
        {
          speaker: "A",
          script: "റെയിൽവേ സ്റ്റേഷനിൽ. ടിക്കറ്റിന് എത്രയാണ്?",
          roman: "railway stationil. ticketinu ethrayaanu?",
          meaning: "At the railway station. How much is the ticket?",
        },
        {
          speaker: "B",
          script: "ഇരുപത് രൂപ.",
          roman: "irupathu roopa.",
          meaning: "Twenty rupees.",
        },
        {
          speaker: "A",
          script: "എത്ര സമയം എടുക്കും?",
          roman: "ethra samayam edukkum?",
          meaning: "How long will it take?",
        },
        {
          speaker: "B",
          script: "ഏകദേശം അര മണിക്കൂർ.",
          roman: "ekadesham ara manikkoor.",
          meaning: "About half an hour.",
        },
        {
          speaker: "A",
          script: "സ്റ്റേഷൻ എത്തുമ്പോൾ ഒന്ന് പറയണേ.",
          roman: "station ethumbol onnu parayane.",
          meaning: "Please tell me when we reach the station.",
        },
        {
          speaker: "B",
          script: "ശരി, ഞാൻ പറയാം.",
          roman: "shari, njaan parayaam.",
          meaning: "Okay, I will tell you.",
        },
      ],
    },
    dailyRoutine: {
      context: "Two classmates talk about their daily routine.",
      lines: [
        {
          speaker: "A",
          script: "നീ എത്ര മണിക്ക് എഴുന്നേൽക്കും?",
          roman: "nee ethra manikku ezhunnelkkum?",
          meaning: "What time do you wake up?",
        },
        {
          speaker: "B",
          script: "ഞാൻ ആറ് മണിക്ക് എഴുന്നേൽക്കും.",
          roman: "njaan aaru manikku ezhunnelkkum.",
          meaning: "I wake up at six o'clock.",
        },
        {
          speaker: "A",
          script: "അതിനുശേഷം എന്ത് ചെയ്യും?",
          roman: "athinushesham enthu cheyyum?",
          meaning: "What do you do after that?",
        },
        {
          speaker: "B",
          script: "കുളിച്ച്, പ്രാതൽ കഴിച്ച്, കോളേജിൽ പോകും.",
          roman: "kulichchu, praathal kazhichchu, collegil pokum.",
          meaning: "I bathe, eat breakfast and go to college.",
        },
        {
          speaker: "A",
          script: "എപ്പോഴാണ് വീട്ടിൽ തിരിച്ചെത്തുന്നത്?",
          roman: "eppozhaanu veettil thirichchethunnathu?",
          meaning: "When do you come home?",
        },
        {
          speaker: "B",
          script: "വൈകുന്നേരം വീട്ടിൽ വന്ന് പഠിക്കും.",
          roman: "vaikunneram veettil vannu padikkum.",
          meaning: "I come home in the evening and study.",
        },
        {
          speaker: "A",
          script: "എപ്പോഴാണ് ഉറങ്ങുന്നത്?",
          roman: "eppozhaanu urangunnathu?",
          meaning: "When do you sleep?",
        },
        {
          speaker: "B",
          script: "രാത്രി പത്ത് മണിക്ക് ഉറങ്ങും.",
          roman: "raathri pathu manikku urangum.",
          meaning: "I sleep at ten o'clock at night.",
        },
      ],
    },
  },
  lessonNotes: {
    "this-and-that":
      "Malayalam has standalone ഇത് (ithu, this thing) and അത് (athu, that thing / it), plus short forms used before a noun: ഈ (ee, this) and ആ (aa, that) — ഈ വീട് (ee veedu, this house), ആ കട (aa kada, that shop).",
    "how-are-you":
      'Feelings and states use the "to me" (dative) form: എനിക്ക് സുഖമാണ് (enikku sukhamaanu, I am fine) is literally "to me it is well-being". You will meet this pattern everywhere — wanting, liking, knowing, being hungry or ill.',
    "where-from":
      '"From" is -ഇൽ നിന്ന് (-il ninnu) and "in" is -ഇൽ (-il), added to the place name: കൊച്ചിയിൽ നിന്നാണ് (Kochiyil ninnaanu, from Kochi). Names ending in a vowel add a -യ- glide.',
    siblings:
      'Malayalam has no single word for "brother" or "sister" in daily use: you say ചേട്ടൻ (chettan, elder brother) or അനിയൻ (aniyan, younger brother), ചേച്ചി (chechi) or അനിയത്തി (aniyathi). Elder siblings are addressed by the title, never by name, and ചേട്ടാ / ചേച്ചീ are used politely for any slightly older stranger.',
    grandparents:
      "Many Kerala families build grandparent words from the parent words: അച്ഛമ്മ (achchhamma, father's mother), അമ്മമ്മ (ammamma, mother's mother), അച്ഛച്ഛൻ and അമ്മച്ഛൻ. Others use one general word for both sides — മുത്തച്ഛൻ / മുത്തശ്ശി, or അപ്പൂപ്പൻ / അമ്മൂമ്മ in the south — so learn the words your family uses.",
    "hungry-thirsty":
      'Hunger, thirst and wanting are "dative" in Malayalam — the person takes -ക്ക് (-kku): എനിക്ക് വിശക്കുന്നു (enikku vishakkunnu, I am hungry), literally "to me (it) hungers". Saying ഞാൻ വിശക്കുന്നു is a typical beginner mistake.',
    "numbers-1-10":
      'Most numbers end in the half-u ് (onnu, randu, moonnu). Before a noun, "one" becomes ഒരു (oru), which also works like English "a": ഒരു ചായ (oru chaaya, a/one tea). Prices and phone numbers are often said in English too.',
    "what-are-you-doing":
      '"Am / is / are …ing" is the verb + -ഉകയാണ് (-ukayaanu): ഞാൻ പഠിക്കുകയാണ് (njaan padikkukayaanu, I am studying). In casual speech it shrinks to -ഉവാ: ഞാൻ പഠിക്കുവാ (njaan padikkuvaa).',
    "my-day":
      "For daily habits Malayalam usually uses the -ഉം (-um) form, which is also the future: ഞാൻ ആറ് മണിക്ക് എഴുന്നേൽക്കും (njaan aaru manikku ezhunnelkkum, I get up at six). Time expressions go near the start, the verb at the end.",
    "places-1":
      'In Kerala a ഹോട്ടൽ (hotel) is a place to eat, not to stay — ask for a ലോഡ്ജ് (lodge) or "hotel room" if you need a bed. Most place names (school, college, office, bank) are English loanwords written in Malayalam script.',
    pronouns:
      'Malayalam has polite and casual "you": നിങ്ങൾ (ningal, polite / plural), നീ (nee, casual) and താങ്കൾ (thaankal, very formal). It also has two "we": നമ്മൾ (nammal, including you) and ഞങ്ങൾ (njangal, not including you). For respected elders, അവർ (avar) or അദ്ദേഹം (addeham) replaces അവൻ / അവൾ.',
    "word-order":
      'Malayalam is subject – object – verb: ഞാൻ ചോറ് കഴിക്കുന്നു (njaan choru kazhikkunnu) = "I rice eat". Best news for learners: verbs never change for person, number or gender — ഞാൻ / നീ / അവൻ / അവൾ / ഞങ്ങൾ / അവർ കഴിക്കുന്നു all use the same കഴിക്കുന്നു.',
    "past-future":
      "Past tense must be learnt per verb (കഴിച്ചു kazhichchu ate, പോയി poyi went, വന്നു vannu came), but the future is regular: add -ഉം (-um) — കഴിക്കും, പോകും, വരും. Neither changes for the person. The -ആം (-aam) form (പോകാം, വരാം) means \"I'll / let's\", a willing offer.",
    "questions-negatives":
      "Yes/no questions add -ഓ (-o) to the last word: ആണ് → ആണോ? (aano?), കഴിക്കും → കഴിക്കുമോ? (kazhikkumo?). There are two \"not\"s: അല്ല (alla, is not — identity) and ഇല്ല (illa, there isn't / didn't / won't) — ഇത് എന്റെ പുസ്തകമല്ല vs. എനിക്ക് പുസ്തകമില്ല (I have no book).",
    possession:
      "Malayalam uses endings instead of prepositions: -ഇൽ (-il, in / at), -ഇൽ നിന്ന് (-il ninnu, from), -ഉടെ / -ന്റെ (-ude / -nte, of / 's), and words after the possessive like മുകളിൽ (mukalil, on top of) and കൂടെ (koode, with): മേശയുടെ മുകളിൽ (meshayude mukalil, on the table).",
    "polite-casual":
      "Commands have a casual form (വാ vaa, ഇരിക്ക് irikku) and a polite form ending in -ഊ (വരൂ varoo, ഇരിക്കൂ irikkoo). Even softer is a question in -ആമോ? (-aamo?): ഇരിക്കാമോ? Use the polite forms with elders, strangers and teachers, and the casual forms with friends and children.",
    "love-friendship":
      'Malayalam expresses liking and love mostly with the dative: എനിക്ക് നിന്നെ ഇഷ്ടമാണ് (enikku ninne ishtamaanu), literally "to me you are liked" — this is what people say even when confessing love. ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു sounds like a film script, and "I love you" / "I miss you" are often said in English.',
    weather:
      'Rain has its own verb: മഴ പെയ്യുന്നു (mazha peyyunnu, it is raining). For heat and cold Malayalam says "there is good heat": ഇന്ന് നല്ല ചൂടുണ്ട് (innu nalla choodundu).',
  },
};
