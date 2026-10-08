import type { LanguageContent } from "../types.ts";

// Tamil (தமிழ்). Main forms are the standard polite Tamil that is both written and safely spoken
// (நீங்கள், -ங்கள் / -கிறேன் endings, sandhi doubling such as எனக்குத் தண்ணீர்). Notes give the
// everyday colloquial forms (இருக்கீங்க, வேணும், வாங்க …) that learners will hear in Chennai,
// Madurai, Coimbatore or Tiruchirappalli.
// Romanization: long vowels doubled (aa, ee, oo), ழ = zh, த = th / dh (between vowels and after n),
// ன்ற = ndr, ற்ற = tr, ஃப = f. ள is written l, like ல; notes point out the retroflex sound where it matters.

export const content: LanguageContent = {
  code: "ta",
  entries: {
    // First words › Greetings (lesson "greetings")
    hello: {
      script: "வணக்கம்",
      roman: "vanakkam",
      accept: ["Hi", "Greetings", "Namaste"],
      notes:
        'Works at any time of day and with anyone, usually with palms pressed together. Among friends people often just say "hi" in English or ask என்ன? (enna?, what\'s up?).',
    },
    goodbye: {
      script: "போய் வருகிறேன்",
      roman: "poi varugiren",
      accept: ["Bye", "I'll go and come back"],
      notes:
        'Literally "I will go and come (back)" — Tamil speakers avoid a final-sounding goodbye. Spoken: போயிட்டு வரேன் (poyittu varen). The host replies போய் வாருங்கள் (poi vaarungal), spoken போயிட்டு வாங்க (poyittu vaanga). Friends just say "bye".',
    },
    seeYouLater: {
      words: [
        ["பிறகு", "piragu"],
        ["பார்க்கலாம்", "paarkkalaam"],
      ],
      notes:
        'Literally "(we) can see (each other) later". Spoken: அப்புறம் பார்க்கலாம் (appuram paarkkalaam).',
    },
    goodMorning: {
      words: [
        ["காலை", "kaalai"],
        ["வணக்கம்", "vanakkam"],
      ],
      notes:
        'Literally "morning greeting". Used on TV, in schools and in messages; in daily life people simply say வணக்கம் (vanakkam) or "good morning" in English.',
    },
    goodNight: {
      words: [
        ["இனிய", "iniya"],
        ["இரவு", "iravu"],
      ],
      notes:
        'Literally "sweet night", common in messages (also இனிய இரவு வணக்கம், iniya iravu vanakkam). Face to face most people just say "good night" in English.',
    },
    thankYou: {
      script: "நன்றி",
      roman: "nandri",
      accept: ["Thanks"],
      notes:
        'ன்ற is said "ndr": nan-dri. Warmer: மிக்க நன்றி (mikka nandri, many thanks) or spoken ரொம்ப நன்றி (romba nandri). Among family, saying thank you for small things can sound distant.',
    },
    welcome: {
      script: "வரவேற்கிறோம்",
      roman: "varaverkirom",
      accept: ["We welcome you"],
      notes:
        'Literally "we welcome (you)", as on signs and in speeches: உங்களை வரவேற்கிறோம் (ungalai varaverkirom). A host at the door says வாருங்கள் வாருங்கள் (vaarungal vaarungal), spoken வாங்க வாங்க (vaanga vaanga).',
    },
    // First words › Yes, no & polite words (lesson "polite-words")
    yes: {
      script: "ஆம்",
      roman: "aam",
      notes:
        "In speech people say ஆமாம் (aamaam) or ஆமா (aamaa); add -ங்க for politeness: ஆமாங்க (aamaanga). சரி (sari, okay) is also often used to say yes.",
    },
    no: {
      script: "இல்லை",
      roman: "illai",
      notes:
        "Spoken: இல்ல (illa). இல்லை also means \"there isn't\": தண்ணீர் இல்லை (thanneer illai, there is no water). To refuse something offered, say வேண்டாம் (vendaam, I don't want it).",
    },
    please: {
      script: "தயவுசெய்து",
      roman: "thayavuseydhu",
      notes:
        "Formal and not used much in conversation. Tamil shows politeness through the verb ending -ங்கள் / spoken -ங்க: கொடுங்கள் / கொடுங்க (kodungal / kodunga, please give). Also written தயவு செய்து.",
    },
    sorry: {
      script: "மன்னிக்கவும்",
      roman: "mannikkavum",
      accept: ["Excuse me", "Pardon"],
      notes:
        'Literally "please forgive". In everyday speech many people just say "sorry" in English; மன்னிச்சுக்கோங்க (mannichchukkonga) is a warm spoken apology.',
    },
    excuseMe: {
      words: [
        ["மன்னிக்க", "mannikka"],
        ["வேண்டும்", "vendum"],
      ],
      accept: ["Pardon me", "I beg your pardon", "Sorry"],
      notes:
        'Literally "(you) must forgive (me)" — a polite way to interrupt or get past. To get a stranger\'s attention people usually say மன்னிக்கவும் (mannikkavum), "excuse me" in English, or call them சார் (saar), அண்ணா (annaa) or அக்கா (akkaa).',
    },
    okay: {
      script: "சரி",
      roman: "sari",
      accept: ["OK", "All right", "Fine"],
      notes:
        "One of the most useful Tamil words: okay, right, fine, correct. Polite: சரிங்க (saringa).",
    },
    noProblem: {
      words: [
        ["பிரச்சினை", "pirachchinai"],
        ["இல்லை", "illai"],
      ],
      notes:
        'Literally "there is no problem"; also spelled பிரச்சனை. The more typical Tamil reply is பரவாயில்லை (paravaayillai, it\'s all right), spoken பரவால்ல (paravaalla).',
    },
    youreWelcome: {
      words: [["பரவாயில்லை", "paravaayillai"]],
      accept: ["It's all right", "No problem", "Never mind"],
      notes:
        'Tamil has no fixed reply to thanks; பரவாயில்லை ("it\'s all right") is the usual one, spoken பரவால்ல (paravaalla). Friends may say நன்றி எதுக்கு? (nandri edhukku?, why thank me?).',
    },
    // First words › Everyday things (lesson "things")
    water: {
      script: "தண்ணீர்",
      roman: "thanneer",
      notes: "Spoken often தண்ணி (thanni). Drinking water is குடிநீர் (kudineer), as on signs.",
    },
    food: {
      script: "சாப்பாடு",
      roman: "saappaadu",
      accept: ["Meal"],
      notes:
        "Also means a full meal (rice with sambar, rasam etc.). The formal/written word is உணவு (unavu).",
    },
    house: {
      script: "வீடு",
      roman: "veedu",
      accept: ["Home"],
      notes:
        "Before case endings it becomes வீட்டு-: வீட்டில் (veettil, at home), வீட்டுக்கு (veettukku, to the house).",
    },
    book: {
      script: "புத்தகம்",
      roman: "puththagam",
    },
    phone: {
      script: "ஃபோன்",
      roman: "fon",
      accept: ["Mobile", "Mobile phone"],
      notes:
        'People say "phone" or "mobile" (மொபைல், mobail). The Tamil words are தொலைபேசி (tholaipesi, telephone) and கைபேசி / அலைபேசி (kaipesi / alaipesi, mobile). Also spelled போன்.',
    },
    bag: {
      script: "பை",
      roman: "pai",
      notes:
        'பை is any bag or pouch; a school or travel bag is often just "bag" (பேக், baek). A plastic carry bag is called a கவர் (kavar, "cover").',
    },
    pen: { script: "பேனா", roman: "penaa" },
    money: {
      script: "பணம்",
      roman: "panam",
      notes:
        'Spoken also காசு (kaasu), which originally meant "coin". The ண in பணம் is retroflex (tongue curled back).',
    },
    // First words › Common actions (lesson "actions")
    come: {
      script: "வர",
      roman: "vara",
      notes:
        'Infinitive "to come" (வர வேண்டும், vara vendum, must come). The verb root, also the casual command, is வா (vaa, come!).',
    },
    go: {
      script: "போக",
      roman: "poga",
      notes:
        'Infinitive "to go". Root / casual command: போ (po, go!); polite: போங்கள் (pongal). The formal written verb is செல் (sel), as in செல்ல (sella).',
    },
    eat: {
      script: "சாப்பிட",
      roman: "saappida",
      notes:
        'Infinitive "to eat". Root / casual command: சாப்பிடு (saappidu). Tamil also uses this verb for taking medicine: மருந்து சாப்பிட (marundhu saappida).',
    },
    drink: {
      script: "குடிக்க",
      roman: "kudikka",
      notes:
        'Infinitive "to drink". Root: குடி (kudi, drink!). Tea and coffee are "drunk" too: டீ குடிக்கலாம் (tee kudikkalaam, let\'s have tea).',
    },
    see: {
      script: "பார்க்க",
      roman: "paarkka",
      accept: ["To look", "To watch", "To meet"],
      notes:
        'Infinitive "to see". Root: பார் (paar, look!). Also means "to watch" (படம் பார்க்க, padam paarkka, to watch a film) and "to meet" someone.',
    },
    give: {
      script: "கொடுக்க",
      roman: "kodukka",
      notes:
        'Infinitive "to give". Root: கொடு (kodu); polite request: கொடுங்கள் (kodungal, please give). Spoken also குடுங்க (kudunga).',
    },
    take: {
      script: "எடுக்க",
      roman: "edukka",
      notes:
        'Infinitive "to take / pick up". Root: எடு (edu). "Take it for yourself" is எடுத்துக்கொள்ளுங்கள் (eduththukkollungal), spoken எடுத்துக்கோங்க (eduththukkonga).',
    },
    doVerb: {
      script: "செய்ய",
      roman: "seyya",
      notes:
        'Infinitive "to do". Root: செய் (sey). In speech பண்ணு (pannu) is very common, especially with English words: கால் பண்ணு (kaal pannu, call).',
    },
    // First words › This, that & questions (lesson "this-and-that")
    this: {
      script: "இது",
      roman: "idhu",
      notes:
        "Before a noun it becomes இந்த (indha): இந்தப் புத்தகம் (indhap puththagam, this book). For a person, politely: இவர் (ivar, this person).",
    },
    that: {
      script: "அது",
      roman: "adhu",
      accept: ["It"],
      notes:
        'Also means "it". Before a noun it becomes அந்த (andha): அந்த வீடு (andha veedu, that house). For a person, politely: அவர் (avar).',
    },
    here: {
      script: "இங்கே",
      roman: "inge",
      notes: "Spoken: இங்க (inga). Right here: இங்கேயே (ingeye).",
    },
    there: {
      script: "அங்கே",
      roman: "ange",
      notes:
        "Spoken: அங்க (anga). The i-/a- pattern runs through Tamil: இது/அது, இங்கே/அங்கே, இப்போது/அப்போது (now/then).",
    },
    what: {
      script: "என்ன",
      roman: "enna",
      notes:
        'Also used alone as "what\'s up?" or "pardon?". It usually comes at the end of a short question: இது என்ன? (idhu enna?).',
    },
    who: {
      script: "யார்",
      roman: "yaar",
    },
    whatIsThis: {
      words: [
        ["இது", "idhu"],
        ["என்ன?", "enna?"],
      ],
      notes: 'Literally "this what?" — Tamil needs no word for "is" in such sentences.',
    },
    whoIsThis: {
      words: [
        ["இவர்", "ivar"],
        ["யார்?", "yaar?"],
      ],
      notes:
        'இவர் (ivar) is the respectful "this person". For a child or a close friend: இவன் யார்? (ivan yaar?, boy) / இவள் யார்? (ival yaar?, girl). On the phone: யார் பேசுகிறீர்கள்? (yaar pesugireergal?).',
    },
    thisIsWater: {
      words: [
        ["இது", "idhu"],
        ["தண்ணீர்", "thanneer"],
      ],
      notes: 'Literally "this water". Tamil sentences of the type "X is Y" have no verb.',
    },
    // Introducing yourself › My name is… (lesson "my-name")
    name: {
      script: "பெயர்",
      roman: "peyar",
      notes: "Spoken: பேரு (peru) or பேர் (per).",
    },
    iPronoun: {
      script: "நான்",
      roman: "naan",
      notes:
        "Verb endings already show the person (-ஏன் = I), so நான் is often dropped: வருகிறேன் (varugiren, I am coming).",
    },
    youFormal: {
      script: "நீங்கள்",
      roman: "neengal",
      notes:
        'The respectful (and plural) "you" — use it with strangers, elders, teachers and anyone you don\'t know well. Spoken: நீங்க (neenga). The casual form is நீ (nee).',
    },
    my: {
      script: "என்",
      roman: "en",
      notes:
        "Full form: என்னுடைய (ennudaiya). Both go before the noun: என் பெயர் (en peyar, my name).",
    },
    yourFormal: {
      script: "உங்கள்",
      roman: "ungal",
      notes:
        'Respectful "your"; full form உங்களுடைய (ungaludaiya), spoken உங்க (unga). Casual: உன் (un).',
    },
    myNameIs: {
      words: [
        ["என்", "en"],
        ["பெயர்", "peyar"],
        ["ஆஷா", "Asha"],
      ],
      notes:
        'Literally "my name Asha" — no word for "is". Spoken: என் பேரு ஆஷா (en peru Asha). You can also say நான் ஆஷா (naan Asha, I am Asha).',
    },
    whatIsYourName: {
      words: [
        ["உங்கள்", "ungal"],
        ["பெயர்", "peyar"],
        ["என்ன?", "enna?"],
      ],
      notes:
        "Spoken: உங்க பேர் என்ன? (unga per enna?). To a child or friend: உன் பெயர் என்ன? (un peyar enna?).",
    },
    // Introducing yourself › How are you? (lesson "how-are-you")
    howAreYou: {
      words: [
        ["நீங்கள்", "neengal"],
        ["எப்படி", "eppadi"],
        ["இருக்கிறீர்கள்?", "irukkireergal?"],
      ],
      notes:
        "Everyday spoken form: எப்படி இருக்கீங்க? (eppadi irukkeenga?). A warm short alternative: நலமா? (nalamaa?, are you well?). To a friend: எப்படி இருக்கிறாய்? / spoken எப்படி இருக்க? (eppadi irukka?).",
    },
    iAmFine: {
      words: [
        ["நான்", "naan"],
        ["நன்றாக", "nandraaga"],
        ["இருக்கிறேன்", "irukkiren"],
      ],
      accept: ["I'm fine", "I am well", "I am good"],
      notes:
        "Spoken: நல்லா இருக்கேன் (nallaa irukken). Formal/written alternative: நான் நலமாக இருக்கிறேன் (naan nalamaaga irukkiren).",
    },
    andYou: {
      words: [
        ["நீங்கள்", "neengal"],
        ["எப்படி?", "eppadi?"],
      ],
      accept: ["How about you?", "And you?"],
      notes:
        'Literally "you, how?". Spoken: நீங்க? (neenga?) with a rising voice is enough. To a friend: நீ எப்படி? (nee eppadi?).',
    },
    veryGood: {
      words: [
        ["மிகவும்", "migavum"],
        ["நல்லது", "nalladhu"],
      ],
      notes:
        'Spoken: ரொம்ப நல்லது (romba nalladhu) — ரொம்ப (romba, very) is the everyday word for "very".',
    },
    iAmAlsoFine: {
      words: [
        ["நானும்", "naanum"],
        ["நன்றாக", "nandraaga"],
        ["இருக்கிறேன்", "irukkiren"],
      ],
      notes:
        '-உம் (-um) means "also / too": நான் → நானும் (me too). Spoken: நானும் நல்லா இருக்கேன் (naanum nallaa irukken).',
    },
    // Introducing yourself › Where are you from? (lesson "where-from")
    whereAreYouFrom: {
      words: [
        ["நீங்கள்", "neengal"],
        ["எந்த", "endha"],
        ["ஊர்?", "oor?"],
      ],
      accept: ["Which town are you from?", "Where are you from?"],
      notes:
        'Literally "you, which town?" — the natural Tamil question. ஊர் (oor) means your home town or native place. Fuller: நீங்கள் எங்கிருந்து வருகிறீர்கள்? (neengal engirundhu varugireergal?, where do you come from?). Spoken: நீங்க எந்த ஊரு? (neenga endha ooru?).',
    },
    iAmFromIndia: {
      words: [
        ["நான்", "naan"],
        ["இந்தியாவிலிருந்து", "Indhiyaavilirundhu"],
        ["வருகிறேன்", "varugiren"],
      ],
      accept: ["I come from India"],
      notes:
        '-இலிருந்து (-ilirundhu) = "from". Another common way: நான் இந்தியாவைச் சேர்ந்தவன் (naan Indhiyaavaich serndhavan, I belong to India); a woman says சேர்ந்தவள் (serndhaval).',
    },
    india: {
      script: "இந்தியா",
      roman: "Indhiyaa",
      notes:
        "The traditional name பாரதம் (Bhaaradham) is also used. Tamil Nadu is தமிழ்நாடு (Thamizhnaadu).",
    },
    city: {
      script: "நகரம்",
      roman: "nagaram",
      accept: ["Town"],
      notes:
        "In conversation people more often say ஊர் (oor, town / home town / place) or டவுன் (taun, town).",
    },
    village: {
      script: "கிராமம்",
      roman: "kiraamam",
      notes:
        "Spoken: கிராமம் or simply ஊர் (oor). A village-born person might say எங்க ஊரு (enga ooru, our village).",
    },
    country: {
      script: "நாடு",
      roman: "naadu",
      notes: "Also in names: தமிழ்நாடு (Thamizhnaadu, the Tamil land).",
    },
    whereDoYouLive: {
      words: [
        ["நீங்கள்", "neengal"],
        ["எங்கே", "enge"],
        ["வசிக்கிறீர்கள்?", "vasikkireergal?"],
      ],
      notes:
        "வசி (vasi) = to live/reside, a bit formal. Everyday speech: நீங்க எங்க இருக்கீங்க? (neenga enga irukkeenga?, where are you (staying)?).",
    },
    iLiveInCity: {
      words: [
        ["நான்", "naan"],
        ["சென்னையில்", "Chennaiyil"],
        ["வசிக்கிறேன்", "vasikkiren"],
      ],
      meaning: "I live in Chennai.",
      notes:
        '-இல் (-il) = "in": சென்னை → சென்னையில். Spoken: நான் சென்னையில இருக்கேன் (naan Chennaiyila irukken). Other cities: மதுரை (Madhurai), கோயம்புத்தூர் (Koyambuththoor), திருச்சி (Thiruchchi).',
    },
    // Introducing yourself › Nice to meet you (lesson "nice-to-meet-you")
    niceToMeetYou: {
      words: [
        ["உங்களைச்", "ungalaich"],
        ["சந்தித்ததில்", "sandhiththadhil"],
        ["மகிழ்ச்சி", "magizhchchi"],
      ],
      notes:
        'Literally "(I have) happiness in having met you" — polite and correct. Spoken: உங்களைப் பார்த்ததுல சந்தோஷம் (ungalaip paarththadhula sandhosham). The reply: எனக்கும் மகிழ்ச்சி (enakkum magizhchchi, me too).',
    },
    iAmAStudent: {
      words: [
        ["நான்", "naan"],
        ["மாணவன்", "maanavan"],
      ],
      notes:
        "மாணவன் is a male student; a woman says நான் மாணவி (naan maanavi). Many people also say நான் ஒரு ஸ்டூடன்ட் (naan oru stoodant) in speech.",
    },
    iAmLearningLanguage: {
      words: [
        ["நான்", "naan"],
        ["தமிழ்", "Thamizh"],
        ["கற்றுக்கொள்கிறேன்", "katrukkolgiren"],
      ],
      meaning: "I am learning Tamil.",
      accept: ["I learn Tamil"],
      notes:
        'கற்றுக்கொள் (katrukkol) = to learn. Spoken: நான் தமிழ் கத்துக்கிறேன் (naan Thamizh kaththukkiren). Note ழ in தமிழ் — the famous Tamil "zh" sound, tongue curled back without touching.',
    },
    iSpeakALittle: {
      words: [
        ["நான்", "naan"],
        ["கொஞ்சம்", "konjam"],
        ["தமிழ்", "Thamizh"],
        ["பேசுவேன்", "pesuven"],
      ],
      meaning: "I speak a little Tamil.",
      notes:
        'பேசுவேன் is the future/habitual form ("I (can and do) speak"). Also natural: எனக்குக் கொஞ்சம் தமிழ் தெரியும் (enakkuk konjam Thamizh theriyum, I know a little Tamil).',
    },
    student: {
      script: "மாணவர்",
      roman: "maanavar",
      notes:
        'Respectful / general form. Male: மாணவன் (maanavan); female: மாணவி (maanavi). In speech "student" is also common.',
    },
    teacher: {
      script: "ஆசிரியர்",
      roman: "aasiriyar",
      notes:
        "Students address teachers as சார் (saar, sir) or மிஸ் / டீச்சர் (mis / teechar) rather than by name. A college lecturer is also பேராசிரியர் (peraasiriyar, professor).",
    },
    // Introducing yourself › I don't understand (lesson "understanding")
    iUnderstand: {
      words: [
        ["எனக்குப்", "enakkup"],
        ["புரிகிறது", "purigiradhu"],
      ],
      notes:
        'Literally "to me (it) is understood". Spoken: புரியுது (puriyudhu). "Understood!" after an explanation: புரிந்தது (purindhadhu), spoken புரிஞ்சுது (purinjudhu).',
    },
    iDontUnderstand: {
      words: [
        ["எனக்குப்", "enakkup"],
        ["புரியவில்லை", "puriyavillai"],
      ],
      accept: ["I didn't understand"],
      notes: "Spoken: புரியல (puriyala) — on its own it is the most useful phrase for learners.",
    },
    pleaseRepeat: {
      words: [
        ["மீண்டும்", "meendum"],
        ["சொல்லுங்கள்", "sollungal"],
      ],
      accept: ["Please repeat", "Say it again, please", "Please repeat that"],
      notes:
        'Spoken: இன்னொரு தடவை சொல்லுங்க (innoru thadavai sollunga, say it one more time). A quick "pardon?" is என்ன? (enna?) or என்னங்க? (ennanga?).',
    },
    speakSlowly: {
      words: [
        ["மெதுவாகப்", "medhuvaagap"],
        ["பேசுங்கள்", "pesungal"],
      ],
      notes:
        "Spoken: மெதுவா பேசுங்க (medhuvaa pesunga). Add கொஞ்சம் (konjam, a little) to soften it.",
    },
    whatDoesThisMean: {
      words: [
        ["இதன்", "idhan"],
        ["அர்த்தம்", "arththam"],
        ["என்ன?", "enna?"],
      ],
      notes:
        'Literally "its meaning what?". Spoken: இதுக்கு என்ன அர்த்தம்? (idhukku enna arththam?). The pure-Tamil word for meaning is பொருள் (porul).',
    },
    doYouSpeakEnglish: {
      words: [
        ["உங்களுக்கு", "ungalukku"],
        ["ஆங்கிலம்", "aangilam"],
        ["பேசத்", "pesath"],
        ["தெரியுமா?", "theriyumaa?"],
      ],
      notes:
        'Literally "to you, is speaking English known?". Spoken: உங்களுக்கு இங்கிலீஷ் தெரியுமா? (ungalukku ingleesh theriyumaa?).',
    },
    howDoYouSay: {
      words: [
        ["இதைத்", "idhaith"],
        ["தமிழில்", "Thamizhil"],
        ["எப்படிச்", "eppadich"],
        ["சொல்வது?", "solvadhu?"],
      ],
      meaning: "How do you say this in Tamil?",
      notes: "Spoken: இதைத் தமிழ்ல எப்படிச் சொல்றது? (idhaith Thamizhla eppadich solradhu?).",
    },
    // Family & people › Parents & children (lesson "parents-children")
    mother: {
      script: "அம்மா",
      roman: "ammaa",
      accept: ["Mom", "Mum"],
      notes:
        "What everyone says and calls their mother. Formal: தாய் (thaai). அம்மா is also a respectful way to address any older woman.",
    },
    father: {
      script: "அப்பா",
      roman: "appaa",
      accept: ["Dad"],
      notes: "Formal: தந்தை (thandhai).",
    },
    parents: {
      script: "பெற்றோர்",
      roman: "petror",
      notes: "Formal word (e.g. on school forms). In speech people say அம்மா அப்பா (ammaa appaa).",
    },
    son: {
      script: "மகன்",
      roman: "magan",
      notes: "Spoken also பையன் (paiyan): என் பையன் (en paiyan, my son).",
    },
    daughter: {
      script: "மகள்",
      roman: "magal",
      notes:
        "Spoken also பொண்ணு (ponnu): என் பொண்ணு (en ponnu, my daughter). The ள at the end is retroflex.",
    },
    child: {
      script: "குழந்தை",
      roman: "kuzhandhai",
      accept: ["Baby", "Kid"],
      notes:
        'Mostly a baby or small child. "Children" (someone\'s kids) is often பிள்ளைகள் (pillaigal).',
    },
    family: {
      script: "குடும்பம்",
      roman: "kudumbam",
    },
    // Family & people › Brothers, sisters & partners (lesson "siblings")
    elderBrother: {
      script: "அண்ணன்",
      roman: "annan",
      notes:
        "When you call or address him: அண்ணா (annaa). அண்ணா is also a friendly-respectful way to address any young man older than you — shopkeepers, auto drivers.",
    },
    youngerBrother: {
      script: "தம்பி",
      roman: "thambi",
      notes: "Also used to address any boy or young man younger than you.",
    },
    elderSister: {
      script: "அக்கா",
      roman: "akkaa",
      notes: "Also used to address a woman a little older than you, e.g. a shopkeeper.",
    },
    youngerSister: {
      script: "தங்கை",
      roman: "thangai",
      notes: "Spoken: தங்கச்சி (thangachchi), which is also how you call her.",
    },
    husband: {
      script: "கணவர்",
      roman: "kanavar",
      notes:
        'Respectful form; plain form கணவன் (kanavan). Many women say என் வீட்டுக்காரர் (en veettukkaarar, "the man of my house") or use the English "husband".',
    },
    wife: {
      script: "மனைவி",
      roman: "manaivi",
      notes: 'Many men say என் வீட்டுக்காரி (en veettukkaari) or "wife" in English.',
    },
    // Family & people › Grandparents & relatives (lesson "grandparents")
    grandfatherPaternal: {
      script: "அப்பா வழித் தாத்தா",
      roman: "appaa vazhith thaaththaa",
      notes:
        'Literally "grandfather on father\'s side". You simply call him தாத்தா (thaaththaa) — the same word for both grandfathers; the side is only added when you need to be clear.',
    },
    grandmotherPaternal: {
      script: "அப்பா வழிப் பாட்டி",
      roman: "appaa vazhip paatti",
      notes:
        "You call her பாட்டி (paatti). In southern Tamil Nadu (e.g. Madurai) father's mother is often அப்பத்தா (appaththaa) or அப்பாயி (appaayi).",
    },
    grandfatherMaternal: {
      script: "அம்மா வழித் தாத்தா",
      roman: "ammaa vazhith thaaththaa",
      notes: 'Literally "grandfather on mother\'s side"; you call him தாத்தா (thaaththaa).',
    },
    grandmotherMaternal: {
      script: "அம்மா வழிப் பாட்டி",
      roman: "ammaa vazhip paatti",
      notes:
        "You call her பாட்டி (paatti). Some families say அம்மாச்சி (ammaachchi) or அம்மம்மா (ammammaa) for mother's mother.",
    },
    uncleMaternal: {
      script: "மாமா",
      roman: "maamaa",
      notes:
        "Mother's brother; the same word is used for father's sister's husband and for the father-in-law, and children call many older men மாமா. Father's brothers are பெரியப்பா (periyappaa, elder) and சித்தப்பா (siththappaa, younger).",
    },
    auntPaternal: {
      script: "அத்தை",
      roman: "aththai",
      notes:
        "Father's sister; also the mother-in-law. Her husband is மாமா (maamaa). Mother's sisters are பெரியம்மா (periyammaa, elder) and சித்தி (siththi, younger).",
    },
    // Family & people › People (lesson "people")
    man: {
      script: "ஆண்",
      roman: "aan",
      accept: ["Male"],
      notes:
        'Also "male". Spoken: ஆம்பளை (aambalai). A respectful way to refer to a man you don\'t know: அவர் (avar) or சார் (saar).',
    },
    woman: {
      script: "பெண்",
      roman: "pen",
      accept: ["Female", "Girl"],
      notes:
        'Also "female" and often "girl / young woman". Spoken: பொம்பளை (pombalai, woman) and பொண்ணு (ponnu, girl).',
    },
    boy: {
      script: "பையன்",
      roman: "paiyan",
      notes: "Formal: சிறுவன் (siruvan).",
    },
    girl: {
      script: "சிறுமி",
      roman: "sirumi",
      notes:
        "சிறுமி is a little girl (formal). In everyday speech a girl is பொண்ணு (ponnu) or பெண் பிள்ளை (pen pillai).",
    },
    friend: {
      script: "நண்பன்",
      roman: "nanban",
      notes:
        'A male friend; a female friend is தோழி (thozhi). The respectful / general form is நண்பர் (nanbar), plural நண்பர்கள் (nanbargal). Young people also say "friend" or ஃப்ரெண்ட் (frend).',
    },
    neighbour: {
      script: "பக்கத்து வீட்டுக்காரர்",
      roman: "pakkaththu veettukkaarar",
      notes: 'Literally "the person of the next house". Formal: அண்டை வீட்டார் (andai veettaar).',
    },
    person: {
      script: "ஆள்",
      roman: "aal",
      notes:
        "Everyday word: ஒரு ஆள் (oru aal, a person / someone). More formal: மனிதர் (manidhar, human being) or நபர் (nabar, individual). When counting people Tamil uses பேர்: மூன்று பேர் (moondru per, three people).",
    },
    doctor: {
      script: "டாக்டர்",
      roman: "daaktar",
      notes:
        'Everyone says "doctor". The Tamil word is மருத்துவர் (maruththuvar), used in news and writing.',
    },
    // Family & people › Describing people (lesson "describing-people")
    tall: {
      script: "உயரமான",
      roman: "uyaramaana",
      notes:
        "Adjective form (before a noun): உயரமான பையன் (uyaramaana paiyan, a tall boy). As a statement: அவன் உயரம் (avan uyaram, he is tall).",
    },
    short: {
      script: "குட்டையான",
      roman: "kuttaiyaana",
      notes:
        "Short in height. குள்ளமான (kullamaana) also exists but can sound blunt; a gentle way is உயரம் குறைவு (uyaram kuraivu, less tall).",
    },
    good: {
      script: "நல்ல",
      roman: "nalla",
      notes:
        'Before a noun: நல்ல பையன் (nalla paiyan, good boy). "It is good" is நல்லது (nalladhu) or spoken நல்லா இருக்கு (nallaa irukku).',
    },
    beautiful: {
      script: "அழகான",
      roman: "azhagaana",
      accept: ["Pretty", "Handsome"],
      notes:
        'From அழகு (azhagu, beauty), used for people and things. "She is beautiful": அவள் அழகாக இருக்கிறாள் (aval azhagaaga irukkiraal).',
    },
    young: {
      script: "இளமையான",
      roman: "ilamaiyaana",
      notes:
        "Before nouns the short form இளம் (ilam) is common: இளம் பெண் (ilam pen, young woman). In speech people say சின்ன வயசு (chinna vayasu, young age).",
    },
    old: {
      script: "வயதான",
      roman: "vayadhaana",
      accept: ["Elderly", "Aged"],
      notes:
        'For people ("aged"). For things, "old" is பழைய (pazhaiya): பழைய வீடு (pazhaiya veedu, old house).',
    },
    kind: {
      script: "அன்பான",
      roman: "anbaana",
      accept: ["Loving", "Affectionate"],
      notes:
        'Literally "loving". People also say நல்ல மனசு (nalla manasu, a good heart) about a kind person.',
    },
    thisIsMyMother: {
      words: [
        ["இவர்", "ivar"],
        ["என்", "en"],
        ["அம்மா", "ammaa"],
      ],
      notes:
        'இவர் (ivar) is the respectful "this person", right for introducing parents and elders. Spoken: இவங்க என் அம்மா (ivanga en ammaa).',
    },
    heIsMyFriend: {
      words: [
        ["அவன்", "avan"],
        ["என்", "en"],
        ["நண்பன்", "nanban"],
      ],
      notes:
        'Casual "he", fine for a friend your own age. Respectful: அவர் என் நண்பர் (avar en nanbar). For a woman friend: அவள் என் தோழி (aval en thozhi).',
    },
    sheIsMySister: {
      words: [
        ["அவள்", "aval"],
        ["என்", "en"],
        ["அக்கா", "akkaa"],
      ],
      notes:
        'Casual "she" (spoken அவ, ava). Many people use the respectful form for an elder sister: அவங்க என் அக்கா (avanga en akkaa). Younger sister: அவள் என் தங்கை (aval en thangai).',
    },
    myFatherIsADoctor: {
      words: [
        ["என்", "en"],
        ["அப்பா", "appaa"],
        ["டாக்டர்", "daaktar"],
      ],
      notes:
        'Literally "my father doctor" — no "is" and no "a" needed. Respectful with a verb: என் அப்பா டாக்டராக இருக்கிறார் (en appaa daaktaraaga irukkiraar).',
    },
    // Family & people › Family review (lesson "family-review")
    howManyBrothers: {
      words: [
        ["உங்களுக்கு", "ungalukku"],
        ["எத்தனை", "eththanai"],
        ["சகோதரர்கள்?", "sagodharargal?"],
      ],
      notes:
        'Literally "to you, how many brothers?". In speech people ask about elder and younger separately: உங்களுக்கு அண்ணன் தம்பி எத்தனை பேர்? (ungalukku annan thambi eththanai per?).',
    },
    iHaveOneBrother: {
      words: [
        ["எனக்கு", "enakku"],
        ["ஒரு", "oru"],
        ["தம்பி", "thambi"],
        ["இருக்கிறான்", "irukkiraan"],
      ],
      notes:
        'Literally "to me one younger brother is there" — Tamil expresses "have" with எனக்கு … இருக்கிறான்/இருக்கிறது. ஒரு (oru) is "one" before a noun. Spoken: எனக்கு ஒரு தம்பி இருக்கான் (irukkaan).',
    },
    iHaveTwoSisters: {
      words: [
        ["எனக்கு", "enakku"],
        ["இரண்டு", "irandu"],
        ["சகோதரிகள்", "sagodharigal"],
        ["இருக்கிறார்கள்", "irukkiraargal"],
      ],
      notes:
        "In real conversation people name them: எனக்கு ஒரு அக்கா, ஒரு தங்கை (enakku oru akkaa, oru thangai, I have an elder and a younger sister). Spoken: ரெண்டு (rendu) for two.",
    },
    // Food & drinks › Everyday food (lesson "food-staples")
    rice: {
      script: "சாதம்",
      roman: "saadham",
      notes:
        'Cooked rice. Uncooked rice is அரிசி (arisi) — the source of the English word "rice". Also சோறு (soru), a homely word for cooked rice.',
    },
    roti: {
      script: "சப்பாத்தி",
      roman: "chappaaththi",
      accept: ["Chapati", "Flatbread"],
      notes:
        'Tamil Nadu calls wheat flatbread "chapathi"; பரோட்டா (parottaa) is the layered flatbread loved in Madurai and everywhere.',
    },
    dal: {
      script: "பருப்பு",
      roman: "paruppu",
      accept: ["Lentils"],
      notes:
        "Means lentils / dal. Most Tamil meals have it as சாம்பார் (saambaar) or as plain பருப்பு with ghee on rice.",
    },
    vegetables: {
      script: "காய்கறிகள்",
      roman: "kaaygarigal",
      notes:
        "Singular / collective: காய்கறி (kaaygari). Many vegetable names end in -காய் (-kaai): கத்தரிக்காய் (kaththarikkaai, brinjal).",
    },
    curd: {
      script: "தயிர்",
      roman: "thayir",
      accept: ["Yogurt", "Yoghurt"],
      notes: "A Tamil meal ends with தயிர் சாதம் (thayir saadham, curd rice).",
    },
    salt: { script: "உப்பு", roman: "uppu" },
    sugar: {
      script: "சர்க்கரை",
      roman: "sarkkarai",
      notes:
        'In southern districts also சீனி (seeni). Jaggery is வெல்லம் (vellam). Diabetes is popularly called "sugar" too.',
    },
    sweets: {
      script: "இனிப்புகள்",
      roman: "inippugal",
      notes:
        "Singular இனிப்பு (inippu, a sweet). Spoken also ஸ்வீட் (sveet). Sweets and snacks made at home for festivals are பலகாரம் (palagaaram).",
    },
    // Food & drinks › Drinks (lesson "drinks")
    tea: {
      script: "டீ",
      roman: "tee",
      accept: ["Chai"],
      notes:
        "Everyone says டீ (tee). Formal Tamil: தேநீர் (theneer). A tea stall is டீக்கடை (teekkadai).",
    },
    coffee: {
      script: "காபி",
      roman: "kaapi",
      notes:
        "Filter coffee with milk is the classic Tamil drink, often served in a tumbler and a dabara (டபரா, dabaraa). Also spelled காஃபி.",
    },
    milk: { script: "பால்", roman: "paal" },
    juice: {
      script: "ஜூஸ்",
      roman: "joos",
      notes: 'Everyone says "juice". Tamil: பழச்சாறு (pazhachchaaru, fruit juice), seen on menus.',
    },
    buttermilk: {
      script: "மோர்",
      roman: "mor",
      notes: "Thin spiced buttermilk, offered free from pots in summer (நீர் மோர், neer mor).",
    },
    coconutWater: {
      script: "இளநீர்",
      roman: "ilaneer",
      accept: ["Tender coconut"],
      notes: 'Literally "young water" — the tender coconut sold on every roadside.',
    },
    // Food & drinks › Fruits, vegetables & more (lesson "fruits-vegetables")
    fruit: {
      script: "பழம்",
      roman: "pazham",
      notes:
        'Many fruit names end in -பழம்: மாம்பழம் (mango), வாழைப்பழம் (banana). பழம் also means "ripe".',
    },
    banana: {
      script: "வாழைப்பழம்",
      roman: "vaazhaippazham",
      notes:
        'Literally "plantain fruit"; vendors often just say பழம் (pazham). The leaf, வாழை இலை (vaazhai ilai), is used as a plate.',
    },
    mango: {
      script: "மாம்பழம்",
      roman: "maambazham",
      notes:
        'The unripe mango is மாங்காய் (maangaai), used for pickles. The English word "mango" comes from Tamil/Malayalam.',
    },
    apple: { script: "ஆப்பிள்", roman: "aappil" },
    onion: {
      script: "வெங்காயம்",
      roman: "vengaayam",
      notes:
        "Small shallots (very common in Tamil cooking) are சின்ன வெங்காயம் (chinna vengaayam).",
    },
    tomato: { script: "தக்காளி", roman: "thakkaali" },
    potato: {
      script: "உருளைக்கிழங்கு",
      roman: "urulaikkizhangu",
      notes: 'Literally "round tuber". Spoken short form: உருளை (urulai) or simply "potato".',
    },
    egg: {
      script: "முட்டை",
      roman: "muttai",
      notes:
        '"Omelette" is ஆம்லெட் (aamlet); egg dosa (முட்டை தோசை, muttai dosai) is a street favourite.',
    },
    fish: { script: "மீன்", roman: "meen" },
    chicken: {
      script: "கோழி",
      roman: "kozhi",
      notes:
        'கோழி is the bird; chicken as food is கோழிக்கறி (kozhikkari) or just "chicken" (சிக்கன், chikkan) on menus.',
    },
    // Food & drinks › Hungry & thirsty (lesson "hungry-thirsty")
    hungry: {
      script: "பசி",
      roman: "pasi",
      accept: ["Hunger"],
      notes:
        'A noun ("hunger"); Tamil says "to me it hungers": எனக்குப் பசிக்கிறது (enakkup pasikkiradhu).',
    },
    thirsty: {
      script: "தாகம்",
      roman: "thaagam",
      accept: ["Thirst"],
      notes:
        'A noun ("thirst"): எனக்குத் தாகமாக இருக்கிறது (enakkuth thaagamaaga irukkiradhu, I am thirsty).',
    },
    tasty: {
      script: "சுவையான",
      roman: "suvaiyaana",
      accept: ["Delicious"],
      notes:
        "From சுவை (suvai, taste). In speech people praise food with நல்லா இருக்கு (nallaa irukku, it's good) or ருசியா இருக்கு (rusiyaa irukku).",
    },
    spicy: {
      script: "காரமான",
      roman: "kaaramaana",
      accept: ["Hot (spicy)"],
      notes:
        'From காரம் (kaaram, spiciness). "Not too spicy, please": காரம் கம்மியா (kaaram kammiyaa).',
    },
    sweetTaste: {
      script: "இனிப்பான",
      roman: "inippaana",
      accept: ["Sweet"],
      notes:
        'From இனிப்பு (inippu, sweetness / a sweet). "It is sweet": இது இனிப்பாக இருக்கிறது (idhu inippaaga irukkiradhu).',
    },
    iAmHungry: {
      words: [
        ["எனக்குப்", "enakkup"],
        ["பசிக்கிறது", "pasikkiradhu"],
      ],
      notes:
        'Literally "to me (it) hungers". Spoken: பசிக்குது (pasikkudhu) or ரொம்ப பசிக்குது (romba pasikkudhu, I\'m very hungry).',
    },
    iAmThirsty: {
      words: [
        ["எனக்குத்", "enakkuth"],
        ["தாகமாக", "thaagamaaga"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        'Literally "to me it is thirsty". Spoken: தாகமா இருக்கு (thaagamaa irukku). People often just say தண்ணி வேணும் (thanni venum, I need water).',
    },
    iWantWater: {
      words: [
        ["எனக்குத்", "enakkuth"],
        ["தண்ணீர்", "thanneer"],
        ["வேண்டும்", "vendum"],
      ],
      notes:
        'Literally "to me water is needed". எனக்கு doubles the next hard consonant in careful writing (எனக்குத் தண்ணீர்); many people write எனக்கு தண்ணீர். Spoken: எனக்குத் தண்ணி வேணும் (enakkuth thanni venum).',
    },
    iWantTea: {
      words: [
        ["எனக்கு", "enakku"],
        ["டீ", "tee"],
        ["வேண்டும்", "vendum"],
      ],
      notes:
        "Spoken: எனக்கு ஒரு டீ வேணும் (enakku oru tee venum). At a stall just say ஒரு டீ (oru tee, one tea).",
    },
    iWantFood: {
      words: [
        ["எனக்குச்", "enakkuch"],
        ["சாப்பாடு", "saappaadu"],
        ["வேண்டும்", "vendum"],
      ],
      notes:
        "Spoken: எனக்குச் சாப்பாடு வேணும் (enakkuch saappaadu venum). The negative is வேண்டாம் (vendaam, don't want).",
    },
    iDontEatMeat: {
      words: [
        ["நான்", "naan"],
        ["இறைச்சி", "iraichchi"],
        ["சாப்பிடுவதில்லை", "saappiduvadhillai"],
      ],
      notes:
        "Literally \"I don't (habitually) eat meat\". Most people say நான் சைவம் (naan saivam, I'm vegetarian) or நான் அசைவம் சாப்பிட மாட்டேன் (naan asaivam saappida maatten, I won't eat non-veg). Meat is also called கறி (kari).",
    },
    // Food & drinks › Ordering food (lesson "ordering-food")
    breakfast: {
      script: "காலை உணவு",
      roman: "kaalai unavu",
      notes:
        'Literally "morning food". In speech: டிபன் (tiban, "tiffin") — idli, dosai, pongal and so on.',
    },
    lunch: {
      script: "மதிய உணவு",
      roman: "madhiya unavu",
      notes:
        'In speech: மதியச் சாப்பாடு (madhiyach saappaadu). A rice thali in a restaurant is called மீல்ஸ் (meels, "meals").',
    },
    dinner: {
      script: "இரவு உணவு",
      roman: "iravu unavu",
      notes: "In speech: ராத்திரி சாப்பாடு (raaththiri saappaadu) or நைட் டிபன் (nait tiban).",
    },
    giveMeOneTea: {
      words: [
        ["ஒரு", "oru"],
        ["டீ", "tee"],
        ["கொடுங்கள்", "kodungal"],
      ],
      notes:
        'The polite ending -ங்கள் does the work of "please". Spoken: ஒரு டீ குடுங்க (oru tee kudunga). At a tea stall, அண்ணா, ஒரு டீ (annaa, oru tee) is perfectly polite.',
    },
    whatWouldYouLike: {
      words: [
        ["உங்களுக்கு", "ungalukku"],
        ["என்ன", "enna"],
        ["வேண்டும்?", "vendum?"],
      ],
      notes:
        'Literally "to you what is needed?". Spoken: உங்களுக்கு என்ன வேணும்? (ungalukku enna venum?) or என்ன சாப்பிடுறீங்க? (enna saappidreenga?, what will you eat?).',
    },
    billPlease: {
      words: [
        ["பில்", "bil"],
        ["கொடுங்கள்", "kodungal"],
      ],
      notes:
        'Literally "please give the bill". Spoken: பில் கொண்டு வாங்க (bil kondu vaanga, bring the bill).',
    },
    withoutSugar: {
      words: [
        ["சர்க்கரை", "sarkkarai"],
        ["இல்லாமல்", "illaamal"],
        ["கொடுங்கள்", "kodungal"],
      ],
      notes:
        'இல்லாமல் (illaamal) = without. Spoken: சுகர் இல்லாம (sugar illaama) — tea stalls understand "without sugar" too.',
    },
    isItSpicy: {
      words: [
        ["இது", "idhu"],
        ["காரமாக", "kaaramaaga"],
        ["இருக்குமா?", "irukkumaa?"],
      ],
      notes:
        'Literally "will this be spicy?". Spoken: காரமா இருக்குமா? (kaaramaa irukkumaa?) or just காரமா? (kaaramaa?).',
    },
    itIsVeryTasty: {
      words: [
        ["இது", "idhu"],
        ["மிகவும்", "migavum"],
        ["சுவையாக", "suvaiyaaga"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        "Spoken, and the nicest compliment to a cook: ரொம்ப நல்லா இருக்கு (romba nallaa irukku, it's really good).",
    },
    giveMeWater: {
      words: [
        ["கொஞ்சம்", "konjam"],
        ["தண்ணீர்", "thanneer"],
        ["கொடுங்கள்", "kodungal"],
      ],
      notes:
        "கொஞ்சம் (konjam) = a little / some; it also softens any request. Spoken: கொஞ்சம் தண்ணி குடுங்க (konjam thanni kudunga).",
    },
    oneMorePlease: {
      words: [
        ["இன்னும்", "innum"],
        ["ஒன்று", "ondru"],
        ["கொடுங்கள்", "kodungal"],
      ],
      notes:
        "Spoken: இன்னொன்னு குடுங்க (innonnu kudunga). For more of something served: இன்னும் கொஞ்சம் (innum konjam, a little more).",
    },
    // Numbers, time & dates › Numbers 1–10 (lesson "numbers-1-10")
    one: {
      script: "ஒன்று",
      roman: "ondru",
      notes: 'Spoken: ஒண்ணு (onnu). Before a noun "one / a" is ஒரு (oru): ஒரு டீ (oru tee).',
    },
    two: {
      script: "இரண்டு",
      roman: "irandu",
      notes: "Spoken: ரெண்டு (rendu).",
    },
    three: { script: "மூன்று", roman: "moondru", notes: "Spoken: மூணு (moonu)." },
    four: { script: "நான்கு", roman: "naangu", notes: "Spoken: நாலு (naalu)." },
    five: { script: "ஐந்து", roman: "aindhu", notes: "Spoken: அஞ்சு (anju)." },
    six: { script: "ஆறு", roman: "aaru" },
    seven: { script: "ஏழு", roman: "ezhu", notes: 'ழ — the "zh" sound.' },
    eight: { script: "எட்டு", roman: "ettu" },
    nine: {
      script: "ஒன்பது",
      roman: "onbadhu",
      notes: "Spoken: ஒம்போது (ombodhu). Prices and phone numbers are very often said in English.",
    },
    ten: { script: "பத்து", roman: "paththu" },
    // Numbers, time & dates › Numbers 11–20 (lesson "numbers-11-20")
    eleven: {
      script: "பதினொன்று",
      roman: "padhinondru",
      notes: 'பதின்- ("ten-") + ஒன்று. Spoken: பதினொண்ணு (padhinonnu).',
    },
    twelve: { script: "பன்னிரண்டு", roman: "pannirandu", notes: "Spoken: பன்னெண்டு (pannendu)." },
    thirteen: {
      script: "பதின்மூன்று",
      roman: "padhinmoondru",
      notes: "Spoken: பதிமூணு (padhimoonu).",
    },
    fourteen: { script: "பதினான்கு", roman: "padhinaangu", notes: "Spoken: பதினாலு (padhinaalu)." },
    fifteen: {
      script: "பதினைந்து",
      roman: "padhinaindhu",
      notes: "Spoken: பதினஞ்சு (padhinanju).",
    },
    sixteen: { script: "பதினாறு", roman: "padhinaaru" },
    seventeen: { script: "பதினேழு", roman: "padhinezhu" },
    eighteen: { script: "பதினெட்டு", roman: "padhinettu" },
    nineteen: {
      script: "பத்தொன்பது",
      roman: "paththonbadhu",
      notes: 'Literally "ten-nine". Spoken: பத்தொம்போது (paththombodhu).',
    },
    twenty: { script: "இருபது", roman: "irubadhu", notes: "Spoken: இருவது (iruvadhu)." },
    // Numbers, time & dates › Tens & big numbers (lesson "big-numbers")
    thirty: { script: "முப்பது", roman: "muppadhu" },
    forty: { script: "நாற்பது", roman: "naarpadhu", notes: "Spoken: நாப்பது (naappadhu)." },
    fifty: { script: "ஐம்பது", roman: "aimbadhu", notes: "Spoken: அம்பது (ambadhu)." },
    hundred: {
      script: "நூறு",
      roman: "nooru",
      notes: "Two hundred is இருநூறு (irunooru); ninety is தொண்ணூறு (thonnooru).",
    },
    thousand: {
      script: "ஆயிரம்",
      roman: "aayiram",
      notes:
        "Big amounts use லட்சம் (latcham, lakh = 100,000) and கோடி (kodi, crore = 10 million).",
    },
    howMany: {
      words: [["எத்தனை?", "eththanai?"]],
      notes:
        "For countable things: எத்தனை பேர்? (eththanai per?, how many people?). For amounts and prices use எவ்வளவு (evvalavu, how much).",
    },
    // Numbers, time & dates › Age & phone numbers (lesson "age-phone")
    age: {
      script: "வயது",
      roman: "vayadhu",
      notes: "Spoken: வயசு (vayasu).",
    },
    year: {
      script: "வருடம்",
      roman: "varudam",
      notes:
        "Also ஆண்டு (aandu), more formal: முதலாம் ஆண்டு (mudhalaam aandu, first year at college). Spoken: வருஷம் (varusham).",
    },
    howOldAreYou: {
      words: [
        ["உங்களுக்கு", "ungalukku"],
        ["என்ன", "enna"],
        ["வயது?", "vayadhu?"],
      ],
      notes:
        "Literally \"to you what age?\". Spoken: உங்களுக்கு என்ன வயசு? (ungalukku enna vayasu?). Asking an adult's age can feel personal; with children it's common.",
    },
    iAmTwentyYearsOld: {
      words: [
        ["எனக்கு", "enakku"],
        ["இருபது", "irubadhu"],
        ["வயது", "vayadhu"],
      ],
      notes: 'Literally "to me twenty age". Spoken: எனக்கு இருவது வயசு (enakku iruvadhu vayasu).',
    },
    phoneNumber: {
      script: "ஃபோன் நம்பர்",
      roman: "fon nambar",
      notes:
        "What people say. Formal: தொலைபேசி எண் (tholaipesi en) or கைபேசி எண் (kaipesi en). Digits are usually read out one by one, often in English.",
    },
    whatIsYourPhoneNumber: {
      words: [
        ["உங்கள்", "ungal"],
        ["ஃபோன்", "fon"],
        ["நம்பர்", "nambar"],
        ["என்ன?", "enna?"],
      ],
      notes:
        "Spoken: உங்க நம்பர் என்ன? (unga nambar enna?) or நம்பர் குடுங்க (nambar kudunga, give me your number).",
    },
    // Numbers, time & dates › Time of day (lesson "time")
    time: {
      script: "நேரம்",
      roman: "neram",
      notes:
        'Time in general ("I have no time" = எனக்கு நேரம் இல்லை). Clock time uses மணி (mani, hour / o\'clock).',
    },
    now: {
      script: "இப்போது",
      roman: "ippodhu",
      notes: 'Spoken: இப்ப (ippa). "Right now": இப்பவே (ippave).',
    },
    today: {
      script: "இன்று",
      roman: "indru",
      notes: "Spoken: இன்னைக்கு (innaikku).",
    },
    tomorrow: {
      script: "நாளை",
      roman: "naalai",
      notes:
        "Spoken: நாளைக்கு (naalaikku). The day after tomorrow: நாளை மறுநாள் (naalai marunaal).",
    },
    yesterday: {
      script: "நேற்று",
      roman: "netru",
      notes: 'ற்ற is said "tr". Spoken: நேத்து (neththu).',
    },
    morning: { script: "காலை", roman: "kaalai", notes: '"In the morning": காலையில் (kaalaiyil).' },
    afternoon: {
      script: "மதியம்",
      roman: "madhiyam",
      notes: 'Roughly noon to 3 pm. "In the afternoon": மதியம் (no ending needed).',
    },
    evening: {
      script: "மாலை",
      roman: "maalai",
      notes: '"In the evening": மாலையில் (maalaiyil), spoken சாயங்காலம் (saayangaalam).',
    },
    night: {
      script: "இரவு",
      roman: "iravu",
      notes: "Spoken: ராத்திரி (raaththiri) or நைட் (nait).",
    },
    whatTimeIsIt: {
      words: [
        ["இப்போது", "ippodhu"],
        ["மணி", "mani"],
        ["என்ன?", "enna?"],
      ],
      notes:
        'Literally "now the hour what?". Spoken: இப்ப மணி என்ன? (ippa mani enna?) or just மணி என்ன? (mani enna?).',
    },
    itIsFiveOClock: {
      words: [
        ["மணி", "mani"],
        ["ஐந்து", "aindhu"],
      ],
      notes:
        'Literally "the hour (is) five". Spoken: மணி அஞ்சு (mani anju). "At five": ஐந்து மணிக்கு (aindhu manikku). Half past five: ஐந்தரை மணி (aindharai mani).',
    },
    // Numbers, time & dates › Days of the week (lesson "days")
    monday: {
      script: "திங்கட்கிழமை",
      roman: "thingatkizhamai",
      notes:
        'கிழமை (kizhamai) = weekday. Short forms are common: திங்கள் (thingal). Many people simply say "Monday".',
    },
    tuesday: {
      script: "செவ்வாய்க்கிழமை",
      roman: "sevvaaykkizhamai",
      notes: "Short: செவ்வாய் (sevvaai), named after Mars.",
    },
    wednesday: {
      script: "புதன்கிழமை",
      roman: "pudhankizhamai",
      notes: "Short: புதன் (pudhan), Mercury.",
    },
    thursday: {
      script: "வியாழக்கிழமை",
      roman: "viyaazhakkizhamai",
      notes: "Short: வியாழன் (viyaazhan), Jupiter.",
    },
    friday: {
      script: "வெள்ளிக்கிழமை",
      roman: "vellikkizhamai",
      notes: "Short: வெள்ளி (velli), Venus; வெள்ளி also means silver. A day for temple visits.",
    },
    saturday: { script: "சனிக்கிழமை", roman: "sanikkizhamai", notes: "Short: சனி (sani), Saturn." },
    sunday: {
      script: "ஞாயிற்றுக்கிழமை",
      roman: "gnaayitrukkizhamai",
      notes:
        'Short: ஞாயிறு (gnaayiru), the Sun. Spoken often ஞாயித்துக்கிழமை (gnaayiththukkizhamai) or just "Sunday".',
    },
    day: {
      script: "நாள்",
      roman: "naal",
      notes: '"Every day": தினமும் (thinamum) or ஒவ்வொரு நாளும் (ovvoru naalum).',
    },
    week: {
      script: "வாரம்",
      roman: "vaaram",
      notes: '"Next week": அடுத்த வாரம் (aduththa vaaram).',
    },
    month: {
      script: "மாதம்",
      roman: "maadham",
      notes: 'Spoken: மாசம் (maasam). "Next month": அடுத்த மாதம் (aduththa maadham).',
    },
    whatDayIsToday: {
      words: [
        ["இன்று", "indru"],
        ["என்ன", "enna"],
        ["கிழமை?", "kizhamai?"],
      ],
      notes:
        'Literally "today what weekday?". Spoken: இன்னைக்கு என்ன கிழமை? (innaikku enna kizhamai?).',
    },
    todayIsMonday: {
      words: [
        ["இன்று", "indru"],
        ["திங்கட்கிழமை", "thingatkizhamai"],
      ],
      notes: "No verb needed. Spoken: இன்னைக்கு திங்கக்கிழமை (innaikku thingakkizhamai).",
    },
    // Daily life › Morning & evening (lesson "routine-verbs")
    wakeUp: {
      script: "எழுந்திருக்க",
      roman: "ezhundhirukka",
      accept: ["To get up"],
      notes:
        "Infinitive; root எழுந்திரு (ezhundhiru, get up!). Spoken: எந்திரி (endhiri). Also simply எழ (ezha, to rise).",
    },
    sleep: {
      script: "தூங்க",
      roman: "thoonga",
      notes: "Root: தூங்கு (thoongu, sleep!).",
    },
    bathe: {
      script: "குளிக்க",
      roman: "kulikka",
      accept: ["To take a bath", "To shower"],
      notes:
        "Root: குளி (kuli). Used for any bath or shower; the bathroom is குளியலறை (kuliyalarai).",
    },
    cook: {
      script: "சமைக்க",
      roman: "samaikka",
      notes: "Root: சமை (samai). Cooking / cuisine is சமையல் (samaiyal).",
    },
    wash: {
      script: "கழுவ",
      roman: "kazhuva",
      notes:
        "For hands, dishes, the face: கை கழுவ (kai kazhuva, to wash hands). Washing clothes is a different verb: துவைக்க (thuvaikka).",
    },
    wear: {
      script: "அணிய",
      roman: "aniya",
      accept: ["To put on"],
      notes:
        "A bit formal. In speech: போட்டுக்கொள்ள (pottukkolla, put on — shirt, shoes), and for a saree or veshti: கட்ட (katta, to tie).",
    },
    // Daily life › Study, work & play (lesson "activity-verbs")
    study: {
      script: "படிக்க",
      roman: "padikka",
      accept: ["To read"],
      notes:
        'Means both "to study" and "to read". நீங்கள் என்ன படிக்கிறீர்கள்? (neengal enna padikkireergal?) = What are you studying?',
    },
    work: {
      script: "வேலை செய்ய",
      roman: "velai seyya",
      notes:
        'Literally "to do work". Spoken also வேலை பார்க்க (velai paarkka): ஆபீஸ்ல வேலை பார்க்கிறேன் (I work in an office).',
    },
    read: {
      script: "வாசிக்க",
      roman: "vaasikka",
      notes:
        '"To read (aloud)". In everyday speech reading a book is usually படிக்க (padikka), the same as "to study".',
    },
    write: {
      script: "எழுத",
      roman: "ezhudha",
      notes: "Root: எழுது (ezhudhu). Letters of the alphabet are எழுத்துகள் (ezhuththugal).",
    },
    play: {
      script: "விளையாட",
      roman: "vilaiyaada",
      notes: 'Root: விளையாடு (vilaiyaadu). For music "play" is வாசிக்க (vaasikka).',
    },
    listen: {
      script: "கேட்க",
      roman: "ketka",
      accept: ["To hear", "To ask"],
      notes:
        'Means "to listen / hear" and also "to ask". Root: கேள் (kel); polite கேளுங்கள் (kelungal, please listen / please ask).',
    },
    speak: {
      script: "பேச",
      roman: "pesa",
      accept: ["To talk"],
      notes:
        'Root: பேசு (pesu). In Sri Lankan Tamil "to speak" is கதை (kadhai); in Tamil Nadu it is always பேசு.',
    },
    // Daily life › Sit, stand & wait (lesson "movement-verbs")
    sit: {
      script: "உட்கார",
      roman: "utkaara",
      notes: "Root: உட்கார் (utkaar, sit!); polite உட்காருங்கள் (utkaarungal).",
    },
    stand: {
      script: "நிற்க",
      roman: "nirka",
      notes: "Root: நில் (nil, stand / stop!); spoken நில்லு (nillu).",
    },
    walk: {
      script: "நடக்க",
      roman: "nadakka",
      notes:
        'Root: நட (nada). நடந்து போக (nadandhu poga) = to go on foot. நடக்க also means "to happen": என்ன நடந்தது? (what happened?).',
    },
    run: { script: "ஓட", roman: "oda", notes: "Root: ஓடு (odu, run!)." },
    wait: {
      script: "காத்திருக்க",
      roman: "kaaththirukka",
      notes:
        'Root: காத்திரு (kaaththiru). In speech people usually say கொஞ்சம் இருங்க (konjam irunga, stay a bit) for "please wait".',
    },
    open: {
      script: "திறக்க",
      roman: "thirakka",
      notes: "Root: திற (thira); polite திறங்கள் (thirangal).",
    },
    close: {
      script: "மூட",
      roman: "mooda",
      accept: ["To shut"],
      notes:
        "Root: மூடு (moodu, close!). A shop that is closed: கடை மூடியிருக்கிறது (kadai moodiyirukkiradhu).",
    },
    // Daily life › What are you doing? (lesson "what-are-you-doing")
    whatAreYouDoing: {
      words: [
        ["நீங்கள்", "neengal"],
        ["என்ன", "enna"],
        ["செய்கிறீர்கள்?", "seygireergal?"],
      ],
      notes:
        'Spoken: என்ன பண்றீங்க? (enna panreenga?). To a friend: என்ன பண்ற? (enna panra?). It can also mean "what do you do (for a living)?".',
    },
    iAmStudying: {
      words: [
        ["நான்", "naan"],
        ["படித்துக்கொண்டிருக்கிறேன்", "padiththukkondirukkiren"],
      ],
      notes:
        'The -க்கொண்டிருக்கிறேன் ending means "I am in the middle of …". Spoken: படிச்சுக்கிட்டு இருக்கேன் (padichchukkittu irukken). Plain present நான் படிக்கிறேன் (naan padikkiren) also means "I study / I\'m a student".',
    },
    iAmEating: {
      words: [
        ["நான்", "naan"],
        ["சாப்பிட்டுக்கொண்டிருக்கிறேன்", "saappittukkondirukkiren"],
      ],
      notes:
        "Spoken: சாப்பிட்டுக்கிட்டு இருக்கேன் (saappittukkittu irukken), or simply சாப்பிடுறேன் (saappidren).",
    },
    iAmDrinkingWater: {
      words: [
        ["நான்", "naan"],
        ["தண்ணீர்", "thanneer"],
        ["குடித்துக்கொண்டிருக்கிறேன்", "kudiththukkondirukkiren"],
      ],
      notes: "Spoken: தண்ணி குடிச்சுக்கிட்டு இருக்கேன் (thanni kudichchukkittu irukken).",
    },
    iAmSleeping: {
      words: [
        ["நான்", "naan"],
        ["தூங்கிக்கொண்டிருக்கிறேன்", "thoongikkondirukkiren"],
      ],
      notes:
        'Spoken: தூங்கிக்கிட்டு இருக்கேன் (thoongikkittu irukken). "I am going to sleep": தூங்கப் போகிறேன் (thoongap pogiren).',
    },
    iAmWorking: {
      words: [
        ["நான்", "naan"],
        ["வேலை", "velai"],
        ["செய்துகொண்டிருக்கிறேன்", "seydhukondirukkiren"],
      ],
      notes:
        "Spoken: வேலை செஞ்சுக்கிட்டு இருக்கேன் (velai senjukkittu irukken) or வேலையா இருக்கேன் (velaiyaa irukken, I'm busy with work).",
    },
    iAmComing: {
      words: [
        ["நான்", "naan"],
        ["வருகிறேன்", "varugiren"],
      ],
      notes: "Spoken: வரேன் (varen) or வந்துட்டே இருக்கேன் (vandhutte irukken, I'm on my way).",
    },
    iAmGoing: {
      words: [
        ["நான்", "naan"],
        ["போகிறேன்", "pogiren"],
      ],
      notes: "Spoken: போறேன் (poren). Formal written: செல்கிறேன் (selgiren).",
    },
    // Daily life › My day (lesson "my-day")
    everyDay: {
      script: "தினமும்",
      roman: "thinamum",
      accept: ["Daily"],
      notes: "Also ஒவ்வொரு நாளும் (ovvoru naalum). Spoken: டெய்லி (deyli) is very common.",
    },
    iAmGoingHome: {
      words: [
        ["நான்", "naan"],
        ["வீட்டுக்குப்", "veettukkup"],
        ["போகிறேன்", "pogiren"],
      ],
      notes:
        '-க்கு (-kku) = "to": வீடு → வீட்டுக்கு. Spoken: வீட்டுக்குப் போறேன் (veettukkup poren).',
    },
    iAmGoingToCollege: {
      words: [
        ["நான்", "naan"],
        ["கல்லூரிக்குப்", "kalloorikkup"],
        ["போகிறேன்", "pogiren"],
      ],
      notes:
        'Spoken: காலேஜுக்குப் போறேன் (kaalejukkup poren) — "college" is very common in speech.',
    },
    iWakeUpAtSix: {
      words: [
        ["நான்", "naan"],
        ["ஆறு", "aaru"],
        ["மணிக்கு", "manikku"],
        ["எழுந்திருக்கிறேன்", "ezhundhirukkiren"],
      ],
      notes:
        "மணிக்கு (manikku) = at … o'clock. For routines Tamils often use the future-habitual: ஆறு மணிக்கு எழுந்திருப்பேன் (ezhundhiruppen); spoken ஆறு மணிக்கு எந்திரிப்பேன் (endhirippen).",
    },
    iGoToCollegeEveryDay: {
      words: [
        ["நான்", "naan"],
        ["தினமும்", "thinamum"],
        ["கல்லூரிக்குப்", "kalloorikkup"],
        ["போகிறேன்", "pogiren"],
      ],
      notes: "Habitual alternative: நான் தினமும் கல்லூரிக்குப் போவேன் (poven).",
    },
    iEatLunchAtOne: {
      words: [
        ["நான்", "naan"],
        ["ஒரு", "oru"],
        ["மணிக்கு", "manikku"],
        ["மதிய", "madhiya"],
        ["உணவு", "unavu"],
        ["சாப்பிடுகிறேன்", "saappidugiren"],
      ],
      notes:
        "ஒரு மணி (oru mani) = one o'clock. Spoken: மதியம் ஒரு மணிக்குச் சாப்பிடுவேன் (madhiyam oru manikkuch saappiduven).",
    },
    iSleepAtTen: {
      words: [
        ["நான்", "naan"],
        ["இரவு", "iravu"],
        ["பத்து", "paththu"],
        ["மணிக்குத்", "manikkuth"],
        ["தூங்குகிறேன்", "thoongugiren"],
      ],
      notes:
        "Habitual alternative: பத்து மணிக்குத் தூங்குவேன் (thoonguven). Spoken: நைட் பத்து மணிக்குத் தூங்குவேன்.",
    },
    // Places & directions › Places in town (lesson "places-1")
    school: {
      script: "பள்ளி",
      roman: "palli",
      notes: 'Also பள்ளிக்கூடம் (pallikkoodam); in speech "school" (ஸ்கூல், skool) is common.',
    },
    college: {
      script: "கல்லூரி",
      roman: "kalloori",
      notes:
        'In speech "college" (காலேஜ், kaalej) is just as common. University: பல்கலைக்கழகம் (palkalaikkazhagam).',
    },
    office: {
      script: "அலுவலகம்",
      roman: "aluvalagam",
      notes: "Written / formal word. In speech everyone says ஆபீஸ் (aapees).",
    },
    shop: {
      script: "கடை",
      roman: "kadai",
      accept: ["Store"],
      notes: "A shopkeeper is கடைக்காரர் (kadaikkaarar); a tea shop is டீக்கடை (teekkadai).",
    },
    market: {
      script: "சந்தை",
      roman: "sandhai",
      notes: "Traditional (often weekly) market. In cities people also say மார்க்கெட் (maarkket).",
    },
    restaurant: {
      script: "ஹோட்டல்",
      roman: "hottal",
      accept: ["Hotel", "Eatery"],
      notes:
        'In Tamil Nadu a restaurant is called a "hotel"; a place to stay is a லாட்ஜ் (laadj). The written Tamil word is உணவகம் (unavagam), as on signboards.',
    },
    // Places & directions › More places (lesson "places-2")
    hospital: {
      script: "மருத்துவமனை",
      roman: "maruththuvamanai",
      notes: "Written / formal. In speech: ஆஸ்பத்திரி (aaspaththiri) or ஹாஸ்பிடல் (haaspidal).",
    },
    station: {
      script: "ரயில் நிலையம்",
      roman: "rayil nilaiyam",
      accept: ["Station", "Train station"],
      notes:
        'Literally "train station", as in announcements. In speech: ஸ்டேஷன் (steshan) or ரயில்வே ஸ்டேஷன் (rayilve steshan). Chennai Central is சென்னை சென்ட்ரல் (Chennai Sentral).',
    },
    bank: {
      script: "வங்கி",
      roman: "vangi",
      notes: "In speech also பேங்க் (baenk).",
    },
    temple: {
      script: "கோயில்",
      roman: "koyil",
      notes: "Also spelled கோவில் (kovil). Take off your footwear before entering.",
    },
    bathroom: {
      script: "கழிவறை",
      roman: "kazhivarai",
      accept: ["Toilet", "Restroom"],
      notes:
        "The toilet, as on signs. In speech people say டாய்லெட் (taaylet) or பாத்ரூம் (baathroom). A room for bathing is குளியலறை (kuliyalarai).",
    },
    road: {
      script: "சாலை",
      roman: "saalai",
      accept: ["Street"],
      notes:
        "Used in road names: அண்ணா சாலை (Annaa Saalai) in Chennai. In speech: ரோடு (rodu). A smaller street is தெரு (theru).",
    },
    // Places & directions › Near, far, left & right (lesson "position-words")
    near: {
      script: "அருகில்",
      roman: "arugil",
      accept: ["Nearby", "Close"],
      notes:
        "In speech the usual word is பக்கத்தில் (pakkaththil), spoken பக்கத்துல (pakkaththula): கடைக்குப் பக்கத்தில் (near the shop).",
    },
    far: {
      script: "தூரம்",
      roman: "thooram",
      accept: ["Distance"],
      notes:
        'Also a noun, "distance". "Far away": தூரத்தில் (thooraththil). "Is it far?": தூரமா? (thooramaa?).',
    },
    left: {
      script: "இடது",
      roman: "idadhu",
      notes:
        "Usually with பக்கம் (pakkam, side): இடது பக்கம் (idadhu pakkam, on/to the left). Spoken also லெஃப்ட் (left).",
    },
    right: {
      script: "வலது",
      roman: "valadhu",
      notes:
        'வலது பக்கம் (valadhu pakkam, on/to the right). Only for direction — "right" as in correct is சரி (sari).',
    },
    straight: {
      script: "நேராக",
      roman: "neraaga",
      notes: 'Spoken: நேரா (neraa). "Go straight": நேராகப் போங்கள்.',
    },
    inFront: {
      script: "முன்னால்",
      roman: "munnaal",
      notes:
        '"In front of the temple": கோயிலுக்கு முன்னால் (koyilukku munnaal). Spoken: முன்னாடி (munnaadi).',
    },
    behind: {
      script: "பின்னால்",
      roman: "pinnaal",
      notes: '"Behind the office": அலுவலகத்துக்குப் பின்னால். Spoken: பின்னாடி (pinnaadi).',
    },
    inside: {
      script: "உள்ளே",
      roman: "ulle",
      notes:
        'Spoken: உள்ள (ulla). "May I come in?": உள்ளே வரலாமா? (ulle varalaamaa?). ள is retroflex.',
    },
    outside: {
      script: "வெளியே",
      roman: "veliye",
      notes: 'Spoken: வெளிய (veliya). "Abroad" is வெளிநாடு (velinaadu, outside country).',
    },
    // Places & directions › Asking for directions (lesson "asking-directions")
    where: {
      script: "எங்கே",
      roman: "enge",
      notes:
        "Spoken: எங்க (enga). It usually comes just before the verb: … எங்கே இருக்கிறது? (… enge irukkiradhu?, where is …?).",
    },
    whereIsTheBathroom: {
      words: [
        ["கழிவறை", "kazhivarai"],
        ["எங்கே", "enge"],
        ["இருக்கிறது?", "irukkiradhu?"],
      ],
      notes:
        "Spoken, and what you will actually say: டாய்லெட் எங்க இருக்கு? (taaylet enga irukku?) or பாத்ரூம் எங்க? (baathroom enga?).",
    },
    whereIsTheStation: {
      words: [
        ["ரயில்", "rayil"],
        ["நிலையம்", "nilaiyam"],
        ["எங்கே", "enge"],
        ["இருக்கிறது?", "irukkiradhu?"],
      ],
      notes:
        "Spoken: ஸ்டேஷன் எங்க இருக்கு? (steshan enga irukku?). Start with மன்னிக்கவும் (mannikkavum) or அண்ணா (annaa) to get attention.",
    },
    goStraight: {
      words: [
        ["நேராகப்", "neraagap"],
        ["போங்கள்", "pongal"],
      ],
      notes: "Spoken: நேரா போங்க (neraa ponga). Casual: நேரா போ (neraa po).",
    },
    turnLeft: {
      words: [
        ["இடது", "idadhu"],
        ["பக்கம்", "pakkam"],
        ["திரும்புங்கள்", "thirumbungal"],
      ],
      notes:
        'Literally "turn to the left side". Spoken: லெஃப்ட்ல திரும்புங்க (leftla thirumbunga) — left/right in English are very common in directions.',
    },
    turnRight: {
      words: [
        ["வலது", "valadhu"],
        ["பக்கம்", "pakkam"],
        ["திரும்புங்கள்", "thirumbungal"],
      ],
      notes: "Spoken: ரைட்ல திரும்புங்க (raitla thirumbunga).",
    },
    itIsNear: {
      words: [
        ["அது", "adhu"],
        ["அருகில்", "arugil"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        'Spoken: பக்கத்துலதான் இருக்கு (pakkaththulathaan irukku, it\'s just nearby) — -தான் (-thaan) adds "just / only".',
    },
    itIsFar: {
      words: [
        ["அது", "adhu"],
        ["தூரத்தில்", "thooraththil"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes: "Spoken: ரொம்ப தூரம் (romba thooram, it's very far).",
    },
    howFarIsIt: {
      words: [
        ["அது", "adhu"],
        ["எவ்வளவு", "evvalavu"],
        ["தூரம்?", "thooram?"],
      ],
      notes:
        'Literally "it how much distance?". Spoken: எவ்வளவு தூரம்? (evvalavu thooram?). The answer is often given in time: நடந்தால் பத்து நிமிடம் (nadandhaal paththu nimidam, ten minutes on foot).',
    },
    // Places & directions › Where are you going? (lesson "where-are-you-going")
    whereAreYouGoing: {
      words: [
        ["நீங்கள்", "neengal"],
        ["எங்கே", "enge"],
        ["போகிறீர்கள்?", "pogireergal?"],
      ],
      notes:
        "Spoken: எங்க போறீங்க? (enga poreenga?). To a friend: எங்க போற? (enga pora?). Asked as a friendly greeting, not out of nosiness.",
    },
    iAmGoingToTheMarket: {
      words: [
        ["நான்", "naan"],
        ["சந்தைக்குப்", "sandhaikkup"],
        ["போகிறேன்", "pogiren"],
      ],
      notes: "Spoken: மார்க்கெட்டுக்குப் போறேன் (maarkkettukkup poren).",
    },
    whereAreYou: {
      words: [
        ["நீங்கள்", "neengal"],
        ["எங்கே", "enge"],
        ["இருக்கிறீர்கள்?", "irukkireergal?"],
      ],
      notes:
        "Spoken (often on the phone): எங்க இருக்கீங்க? (enga irukkeenga?). To a friend: எங்க இருக்க? (enga irukka?).",
    },
    iAmAtHome: {
      words: [
        ["நான்", "naan"],
        ["வீட்டில்", "veettil"],
        ["இருக்கிறேன்", "irukkiren"],
      ],
      notes: "-இல் (-il) = at / in: வீடு → வீட்டில். Spoken: வீட்டுல இருக்கேன் (veettula irukken).",
    },
    comeHere: {
      words: [
        ["இங்கே", "inge"],
        ["வாருங்கள்", "vaarungal"],
      ],
      notes: "Polite. Spoken: இங்க வாங்க (inga vaanga). To a child or friend: இங்க வா (inga vaa).",
    },
    waitHere: {
      words: [
        ["இங்கே", "inge"],
        ["காத்திருங்கள்", "kaaththirungal"],
      ],
      notes:
        "Spoken: இங்கேயே இருங்க (ingeye irunga, stay right here) or இங்க வெயிட் பண்ணுங்க (inga veyit pannunga).",
    },
    // Shopping & money › Money & prices (lesson "money-words")
    rupee: {
      script: "ரூபாய்",
      roman: "roobaai",
      accept: ["Rupees"],
      notes:
        'Spoken: ரூவா (roovaa). "Ten rupees": பத்து ரூபாய் (paththu roobaai) — no plural needed after a number.',
    },
    price: {
      script: "விலை",
      roman: "vilai",
      accept: ["Cost"],
      notes: '"What\'s the price?" is இது என்ன விலை? (idhu enna vilai?).',
    },
    buy: {
      script: "வாங்க",
      roman: "vaanga",
      notes:
        'Infinitive "to buy" (root வாங்கு, vaangu). Careful: spoken வாங்க (vaanga) also means "please come" — context makes it clear.',
    },
    sell: {
      script: "விற்க",
      roman: "virka",
      notes: 'Root: வில் / விற் (vil). "For sale": விற்பனைக்கு (virpanaikku).',
    },
    expensive: {
      script: "விலை அதிகமான",
      roman: "vilai adhigamaana",
      accept: ["Costly"],
      notes:
        'Literally "high-priced". As a statement: விலை அதிகம் (vilai adhigam, the price is high). Spoken: காஸ்ட்லி (kaastli, "costly").',
    },
    cheap: {
      script: "விலை குறைவான",
      roman: "vilai kuraivaana",
      accept: ["Inexpensive", "Low-priced"],
      notes: 'Literally "low-priced". Also மலிவான (malivaana), which can suggest low quality.',
    },
    howMuch: {
      script: "எவ்வளவு",
      roman: "evvalavu",
      notes:
        "For amounts and prices: எவ்வளவு ஆச்சு? (evvalavu aachchu?, how much did it come to?). For countable items use எத்தனை (eththanai, how many).",
    },
    // Shopping & money › Colours (lesson "colours")
    colour: {
      script: "நிறம்",
      roman: "niram",
      accept: ["Color"],
      notes: 'Spoken also கலர் (kalar). "In red colour": சிவப்பு நிறத்தில் (sivappu niraththil).',
    },
    red: { script: "சிவப்பு", roman: "sivappu" },
    blue: {
      script: "நீலம்",
      roman: "neelam",
      notes: "Before a noun it becomes நீல: நீல சட்டை (neela sattai, blue shirt).",
    },
    green: {
      script: "பச்சை",
      roman: "pachchai",
      notes: 'Also means "raw / unripe": பச்சை மிளகாய் (pachchai milagaai, green chilli).',
    },
    yellow: { script: "மஞ்சள்", roman: "manjal", notes: "Also the word for turmeric." },
    white: { script: "வெள்ளை", roman: "vellai", notes: "ள்ள is the retroflex double L." },
    black: { script: "கருப்பு", roman: "karuppu", notes: "Also spelled கறுப்பு." },
    // Shopping & money › Clothes (lesson "clothes")
    clothes: {
      script: "ஆடைகள்",
      roman: "aadaigal",
      accept: ["Clothing", "Dress"],
      notes: "Written word. In speech: துணி (thuni, cloth / clothes) or டிரெஸ் (dres).",
    },
    shirt: { script: "சட்டை", roman: "sattai" },
    trousers: {
      script: "கால்சட்டை",
      roman: "kaalsattai",
      accept: ["Pants"],
      notes: 'Literally "leg shirt". Everyday word: பேண்ட் (pent, "pant").',
    },
    saree: {
      script: "புடவை",
      roman: "pudavai",
      accept: ["Sari"],
      notes:
        "Also சேலை (selai). Silk sarees from Kanchipuram (காஞ்சிபுரம் பட்டு, Kaanchipuram pattu) are famous.",
    },
    shoes: {
      script: "ஷூ",
      roman: "shoo",
      notes: "Everyday word. Written Tamil: காலணி (kaalani, footwear).",
    },
    slippers: {
      script: "செருப்பு",
      roman: "seruppu",
      accept: ["Chappals", "Sandals"],
      notes: "Any open footwear. Left outside houses and temples.",
    },
    // Shopping & money › At the shop (lesson "at-the-shop")
    howMuchIsThis: {
      words: [
        ["இது", "idhu"],
        ["என்ன", "enna"],
        ["விலை?", "vilai?"],
      ],
      notes: 'Literally "this what price?". Also இது எவ்வளவு? (idhu evvalavu?, how much is this?).',
    },
    thisIsTooExpensive: {
      words: [
        ["இது", "idhu"],
        ["மிகவும்", "migavum"],
        ["விலை", "vilai"],
        ["அதிகம்", "adhigam"],
      ],
      notes:
        'Literally "this, the price is very high". Spoken: ரொம்ப விலை அதிகம் (romba vilai adhigam) or ரொம்ப காஸ்ட்லி (romba kaastli).',
    },
    reduceThePrice: {
      words: [
        ["கொஞ்சம்", "konjam"],
        ["விலையைக்", "vilaiyaik"],
        ["குறையுங்கள்", "kuraiyungal"],
      ],
      notes:
        "Spoken bargaining: கொஞ்சம் குறைச்சுக் குடுங்க (konjam kuraichchuk kudunga, give it a bit cheaper). Calling the seller அண்ணா/அக்கா helps.",
    },
    doYouHaveMangoes: {
      words: [
        ["மாம்பழம்", "maambazham"],
        ["இருக்கிறதா?", "irukkiradhaa?"],
      ],
      notes:
        'Literally "mangoes — are there?". The -ஆ (-aa) ending makes a yes/no question. Spoken: மாம்பழம் இருக்கா? (maambazham irukkaa?).',
    },
    iNeedABag: {
      words: [
        ["எனக்கு", "enakku"],
        ["ஒரு", "oru"],
        ["பை", "pai"],
        ["வேண்டும்", "vendum"],
      ],
      notes:
        'Spoken: ஒரு கவர் குடுங்க (oru kavar kudunga) — shops call a plastic carry bag a "cover".',
    },
    giveMeThisOne: {
      words: [
        ["இதைக்", "idhaik"],
        ["கொடுங்கள்", "kodungal"],
      ],
      notes: "இது + -ஐ (object ending) = இதை. Spoken: இதைக் குடுங்க (idhaik kudunga).",
    },
    iWillTakeIt: {
      words: [
        ["நான்", "naan"],
        ["இதை", "idhai"],
        ["வாங்கிக்கொள்கிறேன்", "vaangikkolgiren"],
      ],
      accept: ["I will buy it", "I'll take this"],
      notes:
        'Literally "I will buy this (for myself)". Spoken: இதை வாங்கிக்கிறேன் (idhai vaangikkiren) or simply சரி, இதைக் குடுங்க (sari, idhaik kudunga).',
    },
    showMeThatOne: {
      words: [
        ["அதைக்", "adhaik"],
        ["காட்டுங்கள்", "kaattungal"],
      ],
      notes: "Spoken: அதைக் காட்டுங்க (adhaik kaattunga).",
    },
    doYouHaveARedOne: {
      words: [
        ["சிவப்பு", "sivappu"],
        ["நிறத்தில்", "niraththil"],
        ["இருக்கிறதா?", "irukkiradhaa?"],
      ],
      notes:
        'Literally "is there (one) in red colour?". Spoken: சிவப்பு கலர்ல இருக்கா? (sivappu kalarla irukkaa?).',
    },
    // Travel & transport › Getting around (lesson "vehicles")
    bus: {
      script: "பஸ்",
      roman: "bas",
      notes:
        'Everyone says "bus". The Tamil word பேருந்து (perundhu) appears on signs and in the news.',
    },
    train: {
      script: "ரயில்",
      roman: "rayil",
      notes: "Also spelled இரயில். Formal Tamil: தொடர்வண்டி (thodarvandi).",
    },
    autoRickshaw: {
      script: "ஆட்டோ",
      roman: "aatto",
      accept: ["Auto"],
      notes: 'Always just "auto". Agree on the fare before getting in: … எவ்வளவு? (… evvalavu?).',
    },
    taxi: {
      script: "டாக்ஸி",
      roman: "taaksi",
      accept: ["Cab"],
      notes: 'Many people say கால் டாக்ஸி (kaal taaksi, call taxi) or "cab".',
    },
    car: { script: "கார்", roman: "kaar" },
    bike: {
      script: "பைக்",
      roman: "baik",
      accept: ["Motorcycle", "Scooter", "Two-wheeler"],
      notes:
        "Spoken also வண்டி (vandi, vehicle). Formal: இருசக்கர வாகனம் (irusakkara vaaganam, two-wheeler).",
    },
    // Travel & transport › Tickets & stations (lesson "travel-words")
    ticket: {
      script: "டிக்கெட்",
      roman: "tikket",
      notes: "Everyday word. Formal Tamil: பயணச்சீட்டு (payanachcheettu).",
    },
    platform: {
      script: "நடைமேடை",
      roman: "nadaimedai",
      notes:
        "The word used in Tamil railway announcements (நடைமேடை எண் இரண்டு, platform number two). In speech: பிளாட்பாரம் (pilaatpaaram).",
    },
    busStop: {
      script: "பேருந்து நிறுத்தம்",
      roman: "perundhu niruththam",
      notes:
        "As written on signs. In speech: பஸ் ஸ்டாப் (bas staap); a big bus station is பஸ் ஸ்டாண்ட் (bas staand).",
    },
    airport: {
      script: "விமான நிலையம்",
      roman: "vimaana nilaiyam",
      notes: 'Literally "aeroplane station" — widely used. Also ஏர்போர்ட் (erport).',
    },
    luggage: {
      script: "சாமான்கள்",
      roman: "saamaangal",
      accept: ["Baggage", "Things"],
      notes: 'Literally "things / belongings". Also லக்கேஜ் (lakkej).',
    },
    journey: {
      script: "பயணம்",
      roman: "payanam",
      accept: ["Trip", "Travel"],
      notes:
        '"Have a good journey": இனிய பயணம் (iniya payanam), or நல்லபடியாகப் போய் வாருங்கள் (nallapadiyaagap poi vaarungal).',
    },
    // Travel & transport › When & how long? (lesson "when-how-long")
    when: {
      script: "எப்போது",
      roman: "eppodhu",
      notes: "Spoken: எப்ப (eppa).",
    },
    howLong: {
      script: "எவ்வளவு நேரம்",
      roman: "evvalavu neram",
      notes: 'Literally "how much time". For days: எத்தனை நாள் (eththanai naal, how many days).',
    },
    late: {
      script: "தாமதம்",
      roman: "thaamadham",
      accept: ["Delay"],
      notes:
        'Also a noun, "delay". In speech: லேட் (let): லேட் ஆயிடுச்சு (let aayiduchchu, I\'m late / it got late).',
    },
    early: {
      script: "சீக்கிரம்",
      roman: "seekkiram",
      accept: ["Soon"],
      notes:
        'Also "soon" and "quickly": சீக்கிரம் வாருங்கள் (seekkiram vaarungal, come soon / come early).',
    },
    quickly: {
      script: "வேகமாக",
      roman: "vegamaaga",
      accept: ["Fast"],
      notes:
        'From வேகம் (vegam, speed). Spoken: வேகமா (vegamaa). "Hurry up!": சீக்கிரம்! (seekkiram!).',
    },
    slowly: {
      script: "மெதுவாக",
      roman: "medhuvaaga",
      notes: "Spoken: மெதுவா (medhuvaa).",
    },
    whenDoesTheBusCome: {
      words: [
        ["பஸ்", "bas"],
        ["எப்போது", "eppodhu"],
        ["வரும்?", "varum?"],
      ],
      notes:
        'வரும் (varum) is "will come" for things and animals. Spoken: பஸ் எப்ப வரும்? (bas eppa varum?).',
    },
    howLongDoesItTake: {
      words: [
        ["எவ்வளவு", "evvalavu"],
        ["நேரம்", "neram"],
        ["ஆகும்?", "aagum?"],
      ],
      notes: 'Literally "how much time will it become?".',
    },
    theTrainIsLate: {
      words: [
        ["ரயில்", "rayil"],
        ["தாமதமாக", "thaamadhamaaga"],
        ["வருகிறது", "varugiradhu"],
      ],
      notes:
        'Literally "the train is coming late". Spoken: ட்ரெயின் லேட்டா வருது (trein lettaa varudhu).',
    },
    // Travel & transport › Travel phrases (lesson "travel-phrases")
    oneTicketPlease: {
      words: [
        ["மதுரைக்கு", "Madhuraikku"],
        ["ஒரு", "oru"],
        ["டிக்கெட்", "tikket"],
        ["கொடுங்கள்", "kodungal"],
      ],
      meaning: "One ticket to Madurai, please.",
      notes:
        '-க்கு (-kku) = "to": மதுரை → மதுரைக்கு. On a town bus just say the stop: சென்ட்ரல் ஒண்ணு (Sentral onnu, one to Central).',
    },
    whichPlatform: {
      words: [
        ["எந்த", "endha"],
        ["நடைமேடை?", "nadaimedai?"],
      ],
      notes: "In speech: எந்த பிளாட்பாரம்? (endha pilaatpaaram?).",
    },
    stopHerePlease: {
      words: [
        ["இங்கே", "inge"],
        ["நிறுத்துங்கள்", "niruththungal"],
      ],
      notes:
        "To an auto or cab driver. Spoken: இங்க நிறுத்துங்க (inga niruththunga) or அண்ணா, இங்க ஓரமா நிறுத்துங்க (annaa, inga oramaa niruththunga, stop by the side here).",
    },
    goSlowlyPlease: {
      words: [
        ["மெதுவாகப்", "medhuvaagap"],
        ["போங்கள்", "pongal"],
      ],
      notes: "Spoken: மெதுவா போங்க (medhuvaa ponga).",
    },
    howMuchToStation: {
      words: [
        ["ரயில்", "rayil"],
        ["நிலையத்துக்கு", "nilaiyaththukku"],
        ["எவ்வளவு?", "evvalavu?"],
      ],
      notes: "What you ask an auto driver. Spoken: ஸ்டேஷனுக்கு எவ்வளவு? (steshanukku evvalavu?).",
    },
    iAmLost: {
      words: [
        ["நான்", "naan"],
        ["வழி", "vazhi"],
        ["தவறிவிட்டேன்", "thavarivitten"],
      ],
      notes:
        'Literally "I have lost the way". Spoken: வழி தெரியல (vazhi theriyala, I don\'t know the way).',
    },
    doesThisBusGoToStation: {
      words: [
        ["இந்தப்", "indhap"],
        ["பஸ்", "bas"],
        ["ரயில்", "rayil"],
        ["நிலையத்துக்குப்", "nilaiyaththukkup"],
        ["போகுமா?", "pogumaa?"],
      ],
      notes:
        'Literally "will this bus go to the railway station?". Spoken: இந்த பஸ் ஸ்டேஷனுக்குப் போகுமா? (indha bas steshanukkup pogumaa?).',
    },
    // Everyday conversations › Meeting a friend (lesson "conv-friend")
    whatsNew: {
      words: [
        ["என்ன", "enna"],
        ["விசேஷம்?", "visesham?"],
      ],
      accept: ["What's up?", "What's special?"],
      notes:
        'Literally "what\'s special?" — a warm everyday greeting. Also என்ன செய்திகள்? (enna seydhigal?, what news?).',
    },
    longTimeNoSee: {
      words: [
        ["பார்த்து", "paarththu"],
        ["ரொம்ப", "romba"],
        ["நாள்", "naal"],
        ["ஆகிவிட்டது", "aagivittadhu"],
      ],
      notes:
        'Literally "it has been many days since (I) saw (you)". Spoken: பார்த்து ரொம்ப நாளாச்சு! (paarththu romba naalaachchu!).',
    },
    haveYouEaten: {
      words: [["சாப்பிட்டீர்களா?", "saappitteergalaa?"]],
      notes:
        "A very common caring greeting, not an invitation. Spoken: சாப்பிட்டீங்களா? (saappitteengalaa?); to a friend: சாப்பிட்டியா? (saappittiyaa?).",
    },
    yesIAte: {
      words: [
        ["ஆம்,", "aam,"],
        ["சாப்பிட்டேன்", "saappitten"],
      ],
      notes: "Spoken: ஆமா, சாப்பிட்டேன் (aamaa, saappitten). Not yet: இன்னும் இல்லை (innum illai).",
    },
    // Everyday conversations › At college (lesson "conv-college")
    whereIsTheClass: {
      words: [
        ["வகுப்பறை", "vagupparai"],
        ["எங்கே", "enge"],
        ["இருக்கிறது?", "irukkiradhu?"],
      ],
      notes: "வகுப்பறை (vagupparai) = classroom. Students say கிளாஸ் எங்க? (kilaas enga?).",
    },
    whenIsTheExam: {
      words: [
        ["தேர்வு", "thervu"],
        ["எப்போது?", "eppodhu?"],
      ],
      notes: "Spoken: எக்ஸாம் எப்போ? (eksaam eppo?). Also பரீட்சை (pareetchai).",
    },
    canIComeIn: {
      words: [
        ["உள்ளே", "ulle"],
        ["வரலாமா?", "varalaamaa?"],
      ],
      accept: ["Can I come in?"],
      notes:
        'Literally "may (I) come inside?" — -லாமா (-laamaa) asks for permission. Many students say "May I come in, sir?" in English.',
    },
    isThisSeatFree: {
      words: [
        ["இந்த", "indha"],
        ["இடம்", "idam"],
        ["காலியாக", "kaaliyaaga"],
        ["இருக்கிறதா?", "irukkiradhaa?"],
      ],
      notes:
        'Literally "is this place empty?". Spoken: இங்க யாராவது இருக்காங்களா? (inga yaaraavadhu irukkaangalaa?, is anyone sitting here?).',
    },
    // Everyday conversations › On the phone (lesson "conv-phone")
    hello_onPhone: {
      words: [["ஹலோ?", "halo?"]],
      notes:
        'Tamil speakers answer the phone with "hello"; வணக்கம் (vanakkam) is for meeting in person and formal calls.',
    },
    whoIsSpeaking: {
      words: [
        ["யார்", "yaar"],
        ["பேசுகிறீர்கள்?", "pesugireergal?"],
      ],
      notes:
        "Spoken: யார் பேசுறீங்க? (yaar pesureenga?). Answer: நான் ரவி பேசுகிறேன் (naan Ravi pesugiren, this is Ravi).",
    },
    callYouLater: {
      words: [
        ["நான்", "naan"],
        ["உங்களைப்", "ungalaip"],
        ["பிறகு", "piragu"],
        ["அழைக்கிறேன்", "azhaikkiren"],
      ],
      notes:
        "அழை (azhai) = to call, a bit formal. Spoken: அப்புறம் கால் பண்றேன் (appuram kaal panren).",
    },
    canYouHearMe: {
      words: [
        ["நான்", "naan"],
        ["பேசுவது", "pesuvadhu"],
        ["கேட்கிறதா?", "ketkiradhaa?"],
      ],
      notes:
        'Literally "is what I\'m saying audible?". Spoken: கேக்குதா? (kekkudhaa?) — the usual phone check.',
    },
    justAMinute: {
      words: [
        ["ஒரு", "oru"],
        ["நிமிடம்", "nimidam"],
      ],
      accept: ["One minute", "Wait a minute"],
      notes:
        "Spoken: ஒரு நிமிஷம் (oru nimisham) or ஒரு நிமிஷம் இருங்க (oru nimisham irunga, wait a minute).",
    },
    // Everyday conversations › Asking for help (lesson "conv-help")
    whatIsTheNameOfThisPlace: {
      words: [
        ["இந்த", "indha"],
        ["இடத்தின்", "idaththin"],
        ["பெயர்", "peyar"],
        ["என்ன?", "enna?"],
      ],
      accept: ["What is the name of this place?"],
      notes:
        "Spoken: இந்த இடம் பேரு என்ன? (indha idam peru enna?) or இது என்ன ஏரியா? (idhu enna eriyaa?, what area is this?).",
    },
    ofCourse: {
      words: [["கண்டிப்பாக", "kandippaaga"]],
      accept: ["Definitely", "Certainly", "Sure"],
      notes:
        "Spoken: கண்டிப்பா (kandippaa). Also நிச்சயமாக (nichchayamaaga, certainly), or simply சரி (sari).",
    },
    // Grammar & sentence building › I, you, he, she… (lesson "pronouns")
    youCasual: {
      script: "நீ",
      roman: "nee",
      notes:
        "Only for children, close friends of your age, younger siblings. Using it with a stranger or elder is rude — use நீங்கள் (neengal).",
    },
    he: {
      script: "அவன்",
      roman: "avan",
      notes:
        'Casual "he" (boys, friends, younger men). For an adult or anyone you respect use அவர் (avar), spoken அவரு (avaru) — the safe choice for strangers.',
    },
    she: {
      script: "அவள்",
      roman: "aval",
      notes:
        'Casual "she" (spoken அவ, ava). For an adult or anyone you respect use அவர் (avar), spoken அவங்க (avanga).',
    },
    we: {
      script: "நாங்கள்",
      roman: "naangal",
      notes:
        '"We" not including the listener (me and my people). "We" including the listener is நாம் (naam): நாம் போகலாம் (naam pogalaam, let\'s go). Spoken: நாங்க (naanga), நம்ம (namma).',
    },
    they: {
      script: "அவர்கள்",
      roman: "avargal",
      notes:
        'Also the very respectful singular "he/she". Spoken: அவங்க (avanga). For things: அவை (avai).',
    },
    itPronoun: {
      script: "அதை",
      roman: "adhai",
      meaning: 'It (as an object: "take it")',
      accept: ["It"],
      notes:
        'As a subject "it" is அது (adhu), the same word as "that". When "it" is the object it takes -ஐ: அதை (adhai) — அதைக் கொடுங்கள் (adhaik kodungal, give it).',
    },
    // Grammar & sentence building › Word order & the present (lesson "word-order")
    iEatRice: {
      words: [
        ["நான்", "naan"],
        ["சாதம்", "saadham"],
        ["சாப்பிடுகிறேன்", "saappidugiren"],
      ],
      accept: ["I am eating rice"],
      notes:
        'Literally "I rice eat". The present tense covers "I eat" and "I am eating". Spoken: நான் சாதம் சாப்பிடுறேன் (saappidren).',
    },
    sheDrinksTea: {
      words: [
        ["அவள்", "aval"],
        ["டீ", "tee"],
        ["குடிக்கிறாள்", "kudikkiraal"],
      ],
      notes:
        "-ஆள் (-aal) = she. Respectful: அவர் டீ குடிக்கிறார் (avar tee kudikkiraar). Spoken: அவ டீ குடிக்கிறா (ava tee kudikkiraa).",
    },
    weGoToCollege: {
      words: [
        ["நாங்கள்", "naangal"],
        ["கல்லூரிக்குப்", "kalloorikkup"],
        ["போகிறோம்", "pogirom"],
      ],
      notes: "-ஓம் (-om) = we. Spoken: நாங்க காலேஜுக்குப் போறோம் (naanga kaalejukkup porom).",
    },
    heReadsABook: {
      words: [
        ["அவன்", "avan"],
        ["புத்தகம்", "puththagam"],
        ["படிக்கிறான்", "padikkiraan"],
      ],
      notes:
        "-ஆன் (-aan) = he (casual). Respectful: அவர் புத்தகம் படிக்கிறார் (avar puththagam padikkiraar).",
    },
    theyLiveInIndia: {
      words: [
        ["அவர்கள்", "avargal"],
        ["இந்தியாவில்", "Indhiyaavil"],
        ["வசிக்கிறார்கள்", "vasikkiraargal"],
      ],
      notes:
        "-ஆர்கள் (-aargal) = they. Spoken: அவங்க இந்தியாவுல இருக்காங்க (avanga Indhiyaavula irukkaanga).",
    },
    myMotherCooksFood: {
      words: [
        ["என்", "en"],
        ["அம்மா", "ammaa"],
        ["சாப்பாடு", "saappaadu"],
        ["சமைக்கிறார்", "samaikkiraar"],
      ],
      notes:
        "Parents and elders take the respectful -ஆர் (-aar) ending. Spoken: அம்மா சமைக்கிறாங்க (ammaa samaikkiraanga). Many families say அம்மா சமைக்கிறா (samaikkiraa) affectionately.",
    },
    iSpeakEnglish: {
      words: [
        ["நான்", "naan"],
        ["ஆங்கிலம்", "aangilam"],
        ["பேசுகிறேன்", "pesugiren"],
      ],
      notes:
        "To say you can speak it: எனக்கு ஆங்கிலம் தெரியும் (enakku aangilam theriyum, I know English). Spoken: இங்கிலீஷ் (ingleesh).",
    },
    // Grammar & sentence building › Past & future (lesson "past-future")
    iAteRice: {
      words: [
        ["நான்", "naan"],
        ["சாதம்", "saadham"],
        ["சாப்பிட்டேன்", "saappitten"],
      ],
      accept: ["I have eaten rice"],
      notes: "Past: -ட்டேன் / -ந்தேன் / -னேன் + ஏன் (I). Same form for men and women.",
    },
    iWillEatRice: {
      words: [
        ["நான்", "naan"],
        ["சாதம்", "saadham"],
        ["சாப்பிடுவேன்", "saappiduven"],
      ],
      notes:
        'Future: -வேன் (-ven) / -ப்பேன் (-ppen). The same form describes habits ("I usually eat rice").',
    },
    iWentToTheMarketYesterday: {
      words: [
        ["நான்", "naan"],
        ["நேற்று", "netru"],
        ["சந்தைக்குப்", "sandhaikkup"],
        ["போனேன்", "ponen"],
      ],
      notes:
        "Time words usually come early in the sentence. Spoken: நேத்து மார்க்கெட்டுக்குப் போனேன் (neththu maarkkettukkup ponen).",
    },
    iWillGoTomorrow: {
      words: [
        ["நான்", "naan"],
        ["நாளை", "naalai"],
        ["போவேன்", "poven"],
      ],
      notes:
        "For a definite plan Tamils often use the present: நாளைக்குப் போறேன் (naalaikkup poren, I'm going tomorrow).",
    },
    sheCameYesterday: {
      words: [
        ["அவள்", "aval"],
        ["நேற்று", "netru"],
        ["வந்தாள்", "vandhaal"],
      ],
      notes:
        "Respectful: அவர் நேற்று வந்தார் (avar netru vandhaar). Spoken: அவ நேத்து வந்தா (ava neththu vandhaa).",
    },
    weWillComeTomorrow: {
      words: [
        ["நாங்கள்", "naangal"],
        ["நாளை", "naalai"],
        ["வருவோம்", "varuvom"],
      ],
      notes: "Spoken: நாங்க நாளைக்கு வருவோம் (naanga naalaikku varuvom) or நாளைக்கு வரோம் (varom).",
    },
    // Grammar & sentence building › Questions & negatives (lesson "questions-negatives")
    why: { script: "ஏன்", roman: "en", notes: "Spoken also எதுக்கு (edhukku, what for)." },
    how: { script: "எப்படி", roman: "eppadi" },
    which: {
      script: "எந்த",
      roman: "endha",
      notes:
        'Before a noun: எந்த பஸ்? (endha bas?, which bus?). On its own, "which one" is எது (edhu).',
    },
    doYouEatMeat: {
      words: [
        ["நீங்கள்", "neengal"],
        ["இறைச்சி", "iraichchi"],
        ["சாப்பிடுவீர்களா?", "saappiduveergalaa?"],
      ],
      notes:
        "Yes/no question: add -ஆ (-aa) to the verb. Spoken, as people really ask: நீங்க நான்-வெஜ் சாப்பிடுவீங்களா? (neenga naan-vej saappiduveengalaa?). Vegetarian = சைவம் (saivam), non-vegetarian = அசைவம் (asaivam).",
    },
    iDontKnow: {
      words: [
        ["எனக்குத்", "enakkuth"],
        ["தெரியாது", "theriyaadhu"],
      ],
      notes:
        'Literally "to me (it) is not known". Spoken: தெரியாது (theriyaadhu) or தெரியல (theriyala).',
    },
    isThisYourBook: {
      words: [
        ["இது", "idhu"],
        ["உங்கள்", "ungal"],
        ["புத்தகமா?", "puththagamaa?"],
      ],
      notes:
        "The question ending -ஆ goes on the word being asked about: புத்தகம் → புத்தகமா? Spoken: இது உங்க புத்தகமா? (idhu unga puththagamaa?).",
    },
    thisIsNotMyBook: {
      words: [
        ["இது", "idhu"],
        ["என்", "en"],
        ["புத்தகம்", "puththagam"],
        ["இல்லை", "illai"],
      ],
      notes: "Written Tamil uses அல்ல (alla) here: இது என் புத்தகம் அல்ல. Speech uses இல்ல (illa).",
    },
    whyAreYouLate: {
      words: [
        ["ஏன்", "en"],
        ["தாமதமாக", "thaamadhamaaga"],
        ["வந்தீர்கள்?", "vandheergal?"],
      ],
      notes:
        'Literally "why did you come late?". Spoken: ஏன் லேட்? (en let?) or ஏன் லேட்டா வந்தீங்க? (en lettaa vandheenga?).',
    },
    howDoYouGoToCollege: {
      words: [
        ["நீங்கள்", "neengal"],
        ["கல்லூரிக்கு", "kalloorikku"],
        ["எப்படிப்", "eppadip"],
        ["போகிறீர்கள்?", "pogireergal?"],
      ],
      notes:
        'Answer: பஸ்ஸில் (bassil, by bus) — -இல் also means "by" for vehicles. Spoken: காலேஜுக்கு எப்படிப் போறீங்க? (kaalejukku eppadip poreenga?).',
    },
    // Grammar & sentence building › My, your & small words (lesson "possession")
    inPostposition: {
      script: "-இல்",
      roman: "-il",
      accept: ["In", "At", "On"],
      notes:
        'A case ending, not a separate word: வீடு → வீட்டில் (veettil, in/at the house), சென்னை → சென்னையில் (Chennaiyil). Spoken: -ல (-la): வீட்டுல. For "inside" as a word: உள்ளே (ulle).',
    },
    onPostposition: {
      script: "மேல்",
      roman: "mel",
      accept: ["On top of", "Above"],
      notes:
        'Comes after the noun: மேசையின் மேல் (mesaiyin mel, on the table). Spoken: மேல (mela). "Up / upstairs": மேலே (mele).',
    },
    withPostposition: {
      script: "-உடன்",
      roman: "-udan",
      accept: ["Along with"],
      notes:
        "A case ending: நண்பன் → நண்பனுடன் (nanbanudan, with a friend). Spoken: -ஓட (-oda) or கூட (kooda): ஃப்ரெண்ட் கூட (frend kooda).",
    },
    fromPostposition: {
      script: "-இலிருந்து",
      roman: "-ilirundhu",
      notes:
        "A case ending for places: வீட்டிலிருந்து (veettilirundhu, from home). Spoken: -லேர்ந்து (-lerndhu): வீட்டுலேர்ந்து. From a person: -இடமிருந்து (-idamirundhu).",
    },
    table: {
      script: "மேசை",
      roman: "mesai",
      notes: "In speech also டேபிள் (tebil).",
    },
    thisIsMyBook: {
      words: [
        ["இது", "idhu"],
        ["என்", "en"],
        ["புத்தகம்", "puththagam"],
      ],
      notes:
        'Literally "this my book". Emphatic: இது என்னுடைய புத்தகம் (idhu ennudaiya puththagam, this is MY book).',
    },
    hisNameIsRavi: {
      words: [
        ["அவன்", "avan"],
        ["பெயர்", "peyar"],
        ["ரவி", "Ravi"],
      ],
      notes:
        'அவன் works as "his" before a noun in speech; the full form is அவனுடைய (avanudaiya). For an adult, respectfully: அவர் பெயர் ரவி (avar peyar Ravi).',
    },
    theBookIsOnTheTable: {
      words: [
        ["புத்தகம்", "puththagam"],
        ["மேசையின்", "mesaiyin"],
        ["மேல்", "mel"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        'Literally "book table\'s top-on is". Spoken: புக் டேபிள் மேல இருக்கு (buk tebil mela irukku).',
    },
    iGoWithMyFriend: {
      words: [
        ["நான்", "naan"],
        ["என்", "en"],
        ["நண்பனுடன்", "nanbanudan"],
        ["போகிறேன்", "pogiren"],
      ],
      notes:
        "With a female friend: என் தோழியுடன் (en thozhiyudan). Spoken: என் ஃப்ரெண்ட் கூட போறேன் (en frend kooda poren).",
    },
    sheIsComingFromHome: {
      words: [
        ["அவள்", "aval"],
        ["வீட்டிலிருந்து", "veettilirundhu"],
        ["வருகிறாள்", "varugiraal"],
      ],
      notes:
        "Spoken: அவ வீட்டுலேர்ந்து வரா (ava veettulerndhu varaa). Respectful: அவர் வீட்டிலிருந்து வருகிறார்.",
    },
    // Grammar & sentence building › Polite & casual (lesson "polite-casual")
    comeCasual: {
      words: [["வா!", "vaa!"]],
      notes:
        "The bare verb root — to a child, a younger sibling or a close friend. Spoken often வாடா (vaadaa, to a boy) / வாடி (vaadi, to a girl) among close friends.",
    },
    comePolite: {
      words: [["வாருங்கள்", "vaarungal"]],
      accept: ["Come, please", "Welcome"],
      notes:
        "Polite: root + -உங்கள். Spoken: வாங்க (vaanga) — said twice, வாங்க வாங்க, it is the standard warm welcome at the door.",
    },
    sitCasual: {
      words: [["உட்கார்!", "utkaar!"]],
      notes: "Casual command. Spoken: உட்காரு (utkaaru) or உக்காரு (ukkaaru).",
    },
    sitPolite: {
      words: [["உட்காருங்கள்", "utkaarungal"]],
      accept: ["Please sit", "Please have a seat"],
      notes: "Spoken: உட்காருங்க / உக்காருங்க (ukkaarunga).",
    },
    eatPolite: {
      words: [["சாப்பிடுங்கள்", "saappidungal"]],
      accept: ["Please eat", "Please have some"],
      notes:
        "Spoken: சாப்பிடுங்க (saappidunga). Hosts insist several times — refusing once is expected modesty. Casual: சாப்பிடு (saappidu).",
    },
    howAreYouCasual: {
      words: [
        ["எப்படி", "eppadi"],
        ["இருக்கிறாய்?", "irukkiraai?"],
      ],
      notes:
        "The நீ (nee) form. Spoken: எப்படி இருக்க? (eppadi irukka?) or எப்படிடா இருக்க? (eppadidaa irukka?) between close male friends.",
    },
    // Feelings, health & relationships › How do you feel? (lesson "feelings")
    happy: {
      script: "மகிழ்ச்சி",
      roman: "magizhchchi",
      accept: ["Happiness", "Joy"],
      notes:
        'A noun ("happiness"). Everyday spoken word: சந்தோஷம் (sandhosham). "Happily": மகிழ்ச்சியாக (magizhchchiyaaga).',
    },
    sad: {
      script: "வருத்தம்",
      roman: "varuththam",
      accept: ["Sadness", "Regret"],
      notes:
        'A noun: sadness / regret. Also சோகம் (sogam, sorrow) and கஷ்டம் (kashtam, hardship), often used for "I feel bad".',
    },
    angry: {
      script: "கோபம்",
      roman: "kobam",
      accept: ["Anger"],
      notes: 'A noun: anger. "Don\'t get angry": கோபப்படாதீர்கள் (kobappadaadheergal).',
    },
    tired: {
      script: "களைப்பு",
      roman: "kalaippu",
      accept: ["Tiredness"],
      notes:
        "A noun: tiredness. Spoken: டயர்டு (tayardu) — எனக்கு டயர்டா இருக்கு (enakku tayardaa irukku). Also சோர்வு (sorvu).",
    },
    scared: {
      script: "பயம்",
      roman: "payam",
      accept: ["Fear", "Afraid"],
      notes:
        'A noun: fear (often pronounced "bayam"). "Don\'t be afraid": பயப்படாதீர்கள் (payappadaadheergal).',
    },
    worried: {
      script: "கவலை",
      roman: "kavalai",
      accept: ["Worry"],
      notes:
        'A noun: worry. "I\'m worried": எனக்குக் கவலையாக இருக்கிறது (enakkuk kavalaiyaaga irukkiradhu).',
    },
    iAmHappy: {
      words: [
        ["நான்", "naan"],
        ["மகிழ்ச்சியாக", "magizhchchiyaaga"],
        ["இருக்கிறேன்", "irukkiren"],
      ],
      notes:
        'Literally "I am happily". Spoken: நான் சந்தோஷமா இருக்கேன் (naan sandhoshamaa irukken). Also எனக்கு ரொம்ப சந்தோஷம் (enakku romba sandhosham).',
    },
    iAmSad: {
      words: [
        ["நான்", "naan"],
        ["வருத்தமாக", "varuththamaaga"],
        ["இருக்கிறேன்", "irukkiren"],
      ],
      notes:
        "Spoken: எனக்குக் கஷ்டமா இருக்கு (enakkuk kashtamaa irukku) or மனசு சரியில்ல (manasu sariyilla, my heart isn't right).",
    },
    iAmTired: {
      words: [
        ["நான்", "naan"],
        ["களைப்பாக", "kalaippaaga"],
        ["இருக்கிறேன்", "irukkiren"],
      ],
      notes: "Spoken: ரொம்ப டயர்டா இருக்கு (romba tayardaa irukku).",
    },
    // Feelings, health & relationships › I'm okay, don't worry (lesson "feelings-2")
    iAmAngry: {
      words: [
        ["எனக்குக்", "enakkuk"],
        ["கோபமாக", "kobamaaga"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        'Literally "to me it is angry" — feelings often take எனக்கு. Spoken: எனக்குக் கோபமா இருக்கு (enakkuk kobamaa irukku).',
    },
    iAmOkay: {
      words: [
        ["எனக்கு", "enakku"],
        ["ஒன்றும்", "ondrum"],
        ["இல்லை", "illai"],
      ],
      accept: ["I'm all right", "Nothing is wrong with me"],
      notes:
        'Literally "to me (there is) nothing" — the natural reassurance. Spoken: எனக்கு ஒண்ணும் இல்ல (enakku onnum illa). Also நான் நல்லா இருக்கேன் (I\'m fine).',
    },
    iAmNotFeelingWell: {
      words: [
        ["எனக்கு", "enakku"],
        ["உடம்பு", "udambu"],
        ["சரியில்லை", "sariyillai"],
      ],
      accept: ["I am unwell", "I am sick"],
      notes:
        'Literally "to me the body is not right" — the standard way to say you\'re unwell. Spoken: உடம்பு சரியில்ல (udambu sariyilla).',
    },
    dontWorry: {
      words: [["கவலைப்படாதீர்கள்", "kavalaippadaadheergal"]],
      notes:
        "Polite. Spoken: கவலைப்படாதீங்க (kavalaippadaadheenga). To a friend: கவலைப்படாதே (kavalaippadaadhe) or ஒண்ணும் ஆகாது (onnum aagaadhu, nothing will happen).",
    },
    iAmScared: {
      words: [
        ["எனக்குப்", "enakkup"],
        ["பயமாக", "payamaaga"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        'Literally "to me it is fearful". Spoken: எனக்குப் பயமா இருக்கு (enakkup payamaa irukku; often pronounced "bayamaa").',
    },
    // Feelings, health & relationships › The body (lesson "body")
    head: { script: "தலை", roman: "thalai" },
    hand: {
      script: "கை",
      roman: "kai",
      accept: ["Arm"],
      notes: "Means both hand and arm. Use the right hand for eating and giving.",
    },
    leg: {
      script: "கால்",
      roman: "kaal",
      accept: ["Foot"],
      notes: 'Means both leg and foot. கால் also means "quarter".',
    },
    eye: { script: "கண்", roman: "kan", notes: "Plural: கண்கள் (kangal)." },
    ear: { script: "காது", roman: "kaadhu" },
    mouth: { script: "வாய்", roman: "vaai" },
    stomach: { script: "வயிறு", roman: "vayiru", accept: ["Belly", "Tummy"] },
    tooth: {
      script: "பல்",
      roman: "pal",
      notes: "Plural: பற்கள் (parkal); spoken பல்லு (pallu). Toothache: பல் வலி (pal vali).",
    },
    // Feelings, health & relationships › At the doctor (lesson "health")
    fever: {
      script: "காய்ச்சல்",
      roman: "kaaychchal",
      notes: "Spoken also ஜுரம் (juram).",
    },
    medicine: {
      script: "மருந்து",
      roman: "marundhu",
      notes:
        'Tablets are மாத்திரை (maaththirai). A pharmacy is மருந்துக் கடை (marundhuk kadai) or "medical (shop)".',
    },
    iHaveAFever: {
      words: [
        ["எனக்குக்", "enakkuk"],
        ["காய்ச்சலாக", "kaaychchalaaga"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        'Spoken: எனக்குக் காய்ச்சலா இருக்கு (enakkuk kaaychchalaa irukku) or ஜுரம் அடிக்குது (juram adikkudhu, fever is "hitting").',
    },
    iHaveAHeadache: {
      words: [
        ["எனக்குத்", "enakkuth"],
        ["தலை", "thalai"],
        ["வலிக்கிறது", "valikkiradhu"],
      ],
      notes:
        'Literally "to me the head aches". Headache as a noun: தலைவலி (thalaivali). Spoken: தலை வலிக்குது (thalai valikkudhu).',
    },
    myStomachHurts: {
      words: [
        ["எனக்கு", "enakku"],
        ["வயிறு", "vayiru"],
        ["வலிக்கிறது", "valikkiradhu"],
      ],
      notes:
        'Literally "to me the stomach aches" — body pain uses எனக்கு, not "my". Spoken: வயிறு வலிக்குது (vayiru valikkudhu).',
    },
    iNeedADoctor: {
      words: [
        ["நான்", "naan"],
        ["டாக்டரைப்", "daaktaraip"],
        ["பார்க்க", "paarkka"],
        ["வேண்டும்", "vendum"],
      ],
      accept: ["I need to see a doctor"],
      notes:
        'Literally "I need to see a doctor" — the natural way to say it. Spoken: டாக்டரைப் பார்க்கணும் (daaktaraip paarkkanum).',
    },
    callADoctor: {
      words: [
        ["டாக்டரைக்", "daaktaraik"],
        ["கூப்பிடுங்கள்", "kooppidungal"],
      ],
      notes:
        "கூப்பிடு (kooppidu) = to call (someone over, or on the phone). Spoken: டாக்டரைக் கூப்பிடுங்க (daaktaraik kooppidunga). Emergency: ஆம்புலன்ஸ் (aambulans).",
    },
    takeThisMedicine: {
      words: [
        ["இந்த", "indha"],
        ["மருந்தைச்", "marundhaich"],
        ["சாப்பிடுங்கள்", "saappidungal"],
      ],
      notes:
        'Tamil "eats" medicine (சாப்பிடு). For a syrup or drink: குடியுங்கள் (kudiyungal). Casual: இந்த மாத்திரையைச் சாப்பிடு (eat this tablet).',
    },
    // Feelings, health & relationships › Love & friendship (lesson "love-friendship")
    iLoveYou: {
      words: [
        ["நான்", "naan"],
        ["உன்னைக்", "unnaik"],
        ["காதலிக்கிறேன்", "kaadhalikkiren"],
      ],
      notes:
        'Strictly romantic — காதல் (kaadhal) is romantic love; lovers use the casual உன்னை. It sounds like a film line and is rarely said aloud; many couples say "I love you" in English. Love for family or friends is shown, not said, or with பாசம் (paasam, affection) / எனக்கு நீ ரொம்ப முக்கியம் (enakku nee romba mukkiyam, you mean a lot to me).',
    },
    iLikeYou: {
      words: [
        ["எனக்கு", "enakku"],
        ["உன்னைப்", "unnaip"],
        ["பிடிக்கும்", "pidikkum"],
      ],
      notes:
        'Literally "to me you are liking". Can sound like a romantic hint between young people; to a friend or elder it\'s simply warm. Polite form: எனக்கு உங்களைப் பிடிக்கும் (enakku ungalaip pidikkum). Spoken: உன்னை எனக்குப் பிடிச்சிருக்கு (unnai enakkup pidichchirukku).',
    },
    iMissYou: {
      words: [
        ["உன்", "un"],
        ["நினைவாகவே", "ninaivaagave"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        'Literally "(I) keep thinking of you" — Tamil has no exact "miss". In real life most people say உன்னை மிஸ் பண்றேன் (unnai mis panren, I miss you) in Tanglish. To family, polite: உங்கள் ஞாபகமாகவே இருக்கிறது (ungal gnaabagamaagave irukkiradhu).',
    },
    iLoveMyFamily: {
      words: [
        ["எனக்கு", "enakku"],
        ["என்", "en"],
        ["குடும்பம்", "kudumbam"],
        ["என்றால்", "endraal"],
        ["உயிர்", "uyir"],
      ],
      accept: ["My family is my life"],
      notes:
        'Literally "my family means life to me" — the natural, warm way to say it. The formal sentence நான் என் குடும்பத்தை மிகவும் நேசிக்கிறேன் (naan en kudumbaththai migavum nesikkiren) sounds bookish. Spoken: எனக்கு என் குடும்பம்னா உயிர் (kudumbamnaa uyir).',
    },
    youAreMyFriend: {
      words: [
        ["நீ", "nee"],
        ["என்", "en"],
        ["நண்பன்", "nanban"],
      ],
      notes:
        "Casual, to a male friend — friends use நீ. To a female friend: நீ என் தோழி (nee en thozhi). Polite: நீங்கள் என் நண்பர் (neengal en nanbar). Spoken among young people: நீ என் ஃப்ரெண்ட் (nee en frend).",
    },
    youAreMyBestFriend: {
      words: [
        ["நீ", "nee"],
        ["என்", "en"],
        ["உயிர்", "uyir"],
        ["நண்பன்", "nanban"],
      ],
      notes:
        'உயிர் நண்பன் (uyir nanban, "life-friend") is the Tamil idea of a best friend; to a woman: உயிர்த் தோழி (uyirth thozhi). Young people also say "best friend" or நண்பேன்டா! (nanbendaa!, "you\'re my buddy!").',
    },
    iLikeThis: {
      words: [
        ["எனக்கு", "enakku"],
        ["இது", "idhu"],
        ["பிடித்திருக்கிறது", "pidiththirukkiradhu"],
      ],
      notes:
        "For something you see now. For general likes use பிடிக்கும் (pidikkum): எனக்கு இசை பிடிக்கும். Spoken: இது எனக்குப் பிடிச்சிருக்கு (idhu enakkup pidichchirukku).",
    },
    iDontLikeThis: {
      words: [
        ["எனக்கு", "enakku"],
        ["இது", "idhu"],
        ["பிடிக்கவில்லை", "pidikkavillai"],
      ],
      notes:
        'Spoken: இது எனக்குப் பிடிக்கல (idhu enakkup pidikkala). In general ("I never like it"): பிடிக்காது (pidikkaadhu).',
    },
    takeCare: {
      words: [
        ["உடம்பைப்", "udambaip"],
        ["பார்த்துக்கொள்ளுங்கள்", "paarththukkollungal"],
      ],
      notes:
        'Literally "look after your body (health)" — a caring goodbye. Spoken: உடம்பைப் பார்த்துக்கோங்க (udambaip paarththukkonga); to a friend: பார்த்துக்கோ (paarththukko).',
    },
    // Practical communication › Weather (lesson "weather")
    weather: {
      script: "வானிலை",
      roman: "vaanilai",
      notes:
        'Used in weather reports. In conversation people talk about the வெயில் (veyil, sun/heat) and மழை (mazhai, rain), or say "climate" (க்ளைமேட்).',
    },
    hot: {
      script: "சூடு",
      roman: "soodu",
      accept: ["Heat"],
      notes:
        'Heat / hot (of food, water or weather). For hot weather people talk about the sun: வெயில் (veyil). "Hot coffee": சூடான காபி (soodaana kaapi).',
    },
    cold: {
      script: "குளிர்",
      roman: "kulir",
      notes:
        "Cold weather / feeling cold. Cold food or water is ஜில் (jil) or குளிர்ந்த (kulirndha); a cold (illness) is சளி (sali).",
    },
    rain: {
      script: "மழை",
      roman: "mazhai",
      notes: 'ழ — the "zh" sound. Monsoon: மழைக்காலம் (mazhaikkaalam, rainy season).',
    },
    sun: {
      script: "சூரியன்",
      roman: "sooriyan",
      notes:
        "Sunshine / the heat of the sun is வெயில் (veyil): வெயிலில் போகாதே (don't go out in the sun).",
    },
    wind: {
      script: "காற்று",
      roman: "kaatru",
      accept: ["Breeze", "Air"],
      notes: 'Also means "air". ற்ற is said "tr".',
    },
    itIsHotToday: {
      words: [
        ["இன்று", "indru"],
        ["வெயில்", "veyil"],
        ["அதிகமாக", "adhigamaaga"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        'Literally "today the sun(-heat) is a lot". Spoken: இன்னைக்கு ரொம்ப வெயில் (innaikku romba veyil) or ரொம்ப சூடா இருக்கு (romba soodaa irukku).',
    },
    itIsRaining: {
      words: [
        ["மழை", "mazhai"],
        ["பெய்கிறது", "peygiradhu"],
      ],
      notes:
        'Literally "rain is pouring". Spoken: மழை பெய்யுது (mazhai peyyudhu) or மழை வருது (mazhai varudhu, rain is coming).',
    },
    itIsColdToday: {
      words: [
        ["இன்று", "indru"],
        ["குளிராக", "kuliraaga"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        "Spoken: இன்னைக்குக் குளிரா இருக்கு (innaikkuk kuliraa irukku). Real cold is rare in Chennai — except in Ooty or Kodaikanal!",
    },
    // Practical communication › College & work (lesson "college-work")
    classroom: {
      script: "வகுப்பு",
      roman: "vaguppu",
      meaning: "Class",
      accept: ["Class", "Lesson"],
      notes:
        "A class (lesson, or year group). The room is வகுப்பறை (vagupparai). Students say கிளாஸ் (kilaas).",
    },
    exam: {
      script: "தேர்வு",
      roman: "thervu",
      accept: ["Test", "Examination"],
      notes: "Also பரீட்சை (pareetchai); students say எக்ஸாம் (eksaam).",
    },
    homework: {
      script: "வீட்டுப்பாடம்",
      roman: "veettuppaadam",
      notes: 'Literally "house lesson". Students also say ஹோம்வொர்க் (homvork).',
    },
    job: {
      script: "வேலை",
      roman: "velai",
      accept: ["Work"],
      notes:
        'Job and work. "What job do you do?": நீங்கள் என்ன வேலை செய்கிறீர்கள்? (neengal enna velai seygireergal?).',
    },
    holiday: {
      script: "விடுமுறை",
      roman: "vidumurai",
      accept: ["Leave", "Vacation"],
      notes: 'In speech: லீவு (leevu, "leave") — லீவு நாள் (leevu naal, a day off).',
    },
    iHaveAnExamTomorrow: {
      words: [
        ["எனக்கு", "enakku"],
        ["நாளை", "naalai"],
        ["தேர்வு", "thervu"],
        ["இருக்கிறது", "irukkiradhu"],
      ],
      notes:
        'Literally "to me tomorrow an exam is there". Spoken: நாளைக்கு எனக்கு எக்ஸாம் இருக்கு (naalaikku enakku eksaam irukku).',
    },
    todayIsAHoliday: {
      words: [
        ["இன்று", "indru"],
        ["விடுமுறை", "vidumurai"],
      ],
      notes: "Spoken: இன்னைக்கு லீவு (innaikku leevu).",
    },
    iWorkInAnOffice: {
      words: [
        ["நான்", "naan"],
        ["ஒரு", "oru"],
        ["அலுவலகத்தில்", "aluvalagaththil"],
        ["வேலை", "velai"],
        ["செய்கிறேன்", "seygiren"],
      ],
      notes: "Spoken: நான் ஒரு ஆபீஸ்ல வேலை பார்க்கிறேன் (naan oru aapeesla velai paarkkiren).",
    },
    // Practical communication › Hobbies & likes (lesson "hobbies")
    music: {
      script: "இசை",
      roman: "isai",
      notes:
        'Also பாட்டு (paattu, songs) — "I like music" in speech is often எனக்குப் பாட்டு கேட்கப் பிடிக்கும் (I like listening to songs). Carnatic music: கர்நாடக இசை (karnaadaga isai).',
    },
    movie: {
      script: "திரைப்படம்",
      roman: "thiraippadam",
      accept: ["Film"],
      notes:
        "Formal. Everyone says படம் (padam, picture) or சினிமா (sinimaa). Tamil cinema is a huge part of daily life.",
    },
    song: {
      script: "பாட்டு",
      roman: "paattu",
      notes: 'Formal: பாடல் (paadal). "To sing": பாட (paada).',
    },
    cricket: { script: "கிரிக்கெட்", roman: "kirikket" },
    dance: {
      script: "நடனம்",
      roman: "nadanam",
      notes:
        "Spoken: டான்ஸ் (daans) or ஆட்டம் (aattam). The classical dance of Tamil Nadu is பரதநாட்டியம் (Bharadhanaattiyam).",
    },
    iLikeMusic: {
      words: [
        ["எனக்கு", "enakku"],
        ["இசை", "isai"],
        ["பிடிக்கும்", "pidikkum"],
      ],
      notes:
        'Literally "to me music is liked" — the liker takes எனக்கு. Spoken: எனக்கு மியூசிக் பிடிக்கும் (enakku myoosik pidikkum).',
    },
    doYouLikeCricket: {
      words: [
        ["உங்களுக்குக்", "ungalukkuk"],
        ["கிரிக்கெட்", "kirikket"],
        ["பிடிக்குமா?", "pidikkumaa?"],
      ],
      notes:
        "Spoken: உங்களுக்கு கிரிக்கெட் பிடிக்குமா? Chennai is proud of its IPL team, so expect a long answer.",
    },
    iLikeWatchingMovies: {
      words: [
        ["எனக்குப்", "enakkup"],
        ["படம்", "padam"],
        ["பார்க்கப்", "paarkkap"],
        ["பிடிக்கும்", "pidikkum"],
      ],
      notes:
        'Literally "to me, to watch films is liked". Spoken: எனக்குப் படம் பார்க்கப் பிடிக்கும் — the same; you\'ll also hear சினிமா பார்க்க (sinimaa paarkka).',
    },
    whatIsYourHobby: {
      words: [
        ["உங்கள்", "ungal"],
        ["பொழுதுபோக்கு", "pozhudhupokku"],
        ["என்ன?", "enna?"],
      ],
      notes:
        'பொழுதுபோக்கு (pozhudhupokku) = pastime, literally "passing the time". Spoken: உங்க ஹாபி என்ன? (unga haabi enna?).',
    },
    // Practical communication › Plans & invitations (lesson "plans")
    letsGo: {
      words: [["போகலாம்", "pogalaam"]],
      notes:
        "-லாம் (-laam) = \"let's / we may\". Common invitations: வாங்க போகலாம் (vaanga pogalaam, come, let's go); casual வா போகலாம் (vaa pogalaam). Spoken also போலாம் (polaam).",
    },
    comeToMyHouse: {
      words: [
        ["என்", "en"],
        ["வீட்டுக்கு", "veettukku"],
        ["வாருங்கள்", "vaarungal"],
      ],
      notes:
        'Spoken: எங்க வீட்டுக்கு வாங்க (enga veettukku vaanga, come to our house) — Tamils usually say "our house". To a friend: வீட்டுக்கு வா (veettukku vaa).',
    },
    areYouFreeTomorrow: {
      words: [
        ["நாளை", "naalai"],
        ["உங்களுக்கு", "ungalukku"],
        ["நேரம்", "neram"],
        ["இருக்கிறதா?", "irukkiradhaa?"],
      ],
      notes:
        'Literally "tomorrow, do you have time?". Spoken: நாளைக்கு ஃப்ரீயா இருக்கீங்களா? (naalaikku freeyaa irukkeengalaa?).',
    },
    yesIWillCome: {
      words: [
        ["ஆம்,", "aam,"],
        ["நான்", "naan"],
        ["வருகிறேன்", "varugiren"],
      ],
      notes:
        "Present tense for a promise. Spoken: சரி, வரேன் (sari, varen) or கண்டிப்பா வரேன் (kandippaa varen, I'll definitely come).",
    },
    sorryICantCome: {
      words: [
        ["மன்னிக்கவும்,", "mannikkavum,"],
        ["என்னால்", "ennaal"],
        ["வர", "vara"],
        ["முடியாது", "mudiyaadhu"],
      ],
      notes:
        'என்னால் … முடியாது = "by me … not possible". Spoken, softer: சாரி, என்னால வர முடியாது (saari, ennaala vara mudiyaadhu); add a reason to be polite.',
    },
    seeYouTomorrow: {
      words: [
        ["நாளை", "naalai"],
        ["பார்க்கலாம்", "paarkkalaam"],
      ],
      notes: "Spoken: நாளைக்குப் பார்க்கலாம் (naalaikkup paarkkalaam).",
    },
    // Practical communication › Requests & help (lesson "requests-help")
    canYouHelpMe: {
      words: [
        ["எனக்குக்", "enakkuk"],
        ["கொஞ்சம்", "konjam"],
        ["உதவி", "udhavi"],
        ["செய்ய", "seyya"],
        ["முடியுமா?", "mudiyumaa?"],
      ],
      notes:
        'Literally "can (you) do a little help for me?". Spoken: கொஞ்சம் ஹெல்ப் பண்ண முடியுமா? (konjam help panna mudiyumaa?).',
    },
    iNeedHelp: {
      words: [
        ["எனக்கு", "enakku"],
        ["உதவி", "udhavi"],
        ["வேண்டும்", "vendum"],
      ],
      notes: "Spoken: எனக்கு ஒரு உதவி வேணும் (enakku oru udhavi venum, I need a favour).",
    },
    pleaseHelpMe: {
      words: [
        ["தயவுசெய்து", "thayavuseydhu"],
        ["எனக்கு", "enakku"],
        ["உதவுங்கள்", "udhavungal"],
      ],
      notes: "Spoken: ப்ளீஸ், எனக்கு ஹெல்ப் பண்ணுங்க (pleez, enakku help pannunga).",
    },
    pleaseWait: {
      words: [
        ["கொஞ்சம்", "konjam"],
        ["காத்திருங்கள்", "kaaththirungal"],
      ],
      notes:
        "Spoken, much more common: கொஞ்சம் இருங்க (konjam irunga, stay a moment) or ஒரு நிமிஷம் (oru nimisham).",
    },
    pleaseTellMe: {
      words: [
        ["எனக்குச்", "enakkuch"],
        ["சொல்லுங்கள்", "sollungal"],
      ],
      notes:
        'On its own, சொல்லுங்கள் / spoken சொல்லுங்க (sollunga) means "go ahead, tell me" — also how people answer "Excuse me!".',
    },
    pleaseShowMe: {
      words: [
        ["எனக்குக்", "enakkuk"],
        ["காட்டுங்கள்", "kaattungal"],
      ],
      notes: "Spoken: காட்டுங்க (kaattunga).",
    },
    callMe: {
      words: [
        ["எனக்கு", "enakku"],
        ["ஃபோன்", "fon"],
        ["செய்யுங்கள்", "seyyungal"],
      ],
      accept: ["Please phone me", "Call me"],
      notes:
        "On the phone. Spoken: எனக்கு கால் பண்ணுங்க (enakku kaal pannunga). To call someone over: என்னைக் கூப்பிடுங்கள் (ennaik kooppidungal).",
    },
    help: {
      words: [["காப்பாற்றுங்கள்!", "kaappaatrungal!"]],
      accept: ["Save me!", "Help me!"],
      notes:
        'Literally "save (me)!" — what you shout in an emergency. Spoken: காப்பாத்துங்க! (kaappaaththunga!). Also உதவி! உதவி! (udhavi!, help!).',
    },
    itsOkay: {
      words: [
        ["பரவாயில்லை,", "paravaayillai,"],
        ["விடுங்கள்", "vidungal"],
      ],
      accept: ["Never mind", "It's all right, let it go"],
      notes:
        'Literally "it\'s all right, let it go" — to reassure someone who apologises. Spoken: பரவால்ல, விடுங்க (paravaalla, vidunga).',
    },
  },
  extras: [
    // Greetings
    {
      key: "nalamaa",
      lesson: "greetings",
      topic: "Greetings",
      meaning: "Are you well?",
      words: [["நலமா?", "nalamaa?"]],
      notes:
        "A short, warm greeting (from நலம், nalam, well-being). Reply: நலம் (nalam, well) or நல்லா இருக்கேன் (nallaa irukken).",
    },
    {
      key: "poi-vaarungal",
      lesson: "greetings",
      topic: "Greetings",
      meaning: "Go and come back (the host's goodbye)",
      words: [
        ["போய்", "poi"],
        ["வாருங்கள்", "vaarungal"],
      ],
      notes:
        'What the host says when a guest leaves; never just "go". Spoken: போயிட்டு வாங்க (poyittu vaanga).',
    },
    // Polite words
    {
      key: "mikka-nandri",
      lesson: "polite-words",
      topic: "Polite words",
      meaning: "Thank you very much",
      words: [
        ["மிக்க", "mikka"],
        ["நன்றி", "nandri"],
      ],
      notes:
        "Slightly formal. Spoken: ரொம்ப நன்றி (romba nandri) or ரொம்ப தேங்க்ஸ் (romba thenks).",
    },
    {
      key: "vendaam",
      lesson: "polite-words",
      topic: "Polite words",
      meaning: "Don't want / No, thanks",
      script: "வேண்டாம்",
      roman: "vendaam",
      notes:
        "Refusing something offered. Softer: வேண்டாம், நன்றி (vendaam, nandri). Spoken: வேணாம் (venaam).",
    },
    // Everyday things
    {
      key: "saavi",
      lesson: "things",
      topic: "Everyday things",
      meaning: "Key",
      script: "சாவி",
      roman: "saavi",
    },
    {
      key: "kudai",
      lesson: "things",
      topic: "Everyday things",
      meaning: "Umbrella",
      script: "குடை",
      roman: "kudai",
      notes: "Used for both rain and the fierce sun.",
    },
    // Actions
    {
      key: "theriyum",
      lesson: "actions",
      topic: "Actions",
      meaning: "(I) know / is known",
      script: "தெரியும்",
      roman: "theriyum",
      notes:
        "Used with the dative: எனக்குத் தெரியும் (enakkuth theriyum, I know). Negative: தெரியாது (theriyaadhu).",
    },
    {
      key: "mudiyum",
      lesson: "actions",
      topic: "Actions",
      meaning: "Can / is possible",
      script: "முடியும்",
      roman: "mudiyum",
      notes: "என்னால் முடியும் (ennaal mudiyum, I can). Negative: முடியாது (mudiyaadhu, can't).",
    },
    {
      key: "vendum",
      lesson: "actions",
      topic: "Actions",
      meaning: "Want / need / must",
      script: "வேண்டும்",
      roman: "vendum",
      notes:
        'எனக்கு … வேண்டும் (I want …); after a verb it means "must": போக வேண்டும் (poga vendum, (I) must go). Spoken: வேணும் (venum), and -கணும் (-kanum): போகணும்.',
    },
    // This & that
    {
      key: "idho",
      lesson: "this-and-that",
      topic: "Questions",
      meaning: "Here it is! / Here!",
      words: [["இதோ!", "idho!"]],
      notes:
        "Said when handing something over or pointing: இதோ வருகிறேன் (idho varugiren, coming right now!). Far version: அதோ (adho, there it is).",
    },
    {
      key: "edhu",
      lesson: "this-and-that",
      topic: "Questions",
      meaning: "Which one?",
      words: [["எது?", "edhu?"]],
      notes:
        "Stands on its own, unlike எந்த (endha) which needs a noun: எது உங்களுடையது? (edhu ungaludaiyadhu?, which one is yours?).",
    },
    // Introductions
    {
      key: "oor",
      lesson: "where-from",
      topic: "Introductions",
      meaning: "Home town / native place / town",
      script: "ஊர்",
      roman: "oor",
      notes:
        "A key Tamil idea — everyone has an ஊர் even if they live in Chennai. சொந்த ஊர் (sondha oor) = native place. Spoken: ஊரு (ooru).",
    },
    {
      key: "nallaa-irukken",
      lesson: "how-are-you",
      topic: "Introductions",
      meaning: "I'm fine (spoken)",
      words: [
        ["நல்லா", "nallaa"],
        ["இருக்கேன்", "irukken"],
      ],
      notes:
        "The everyday spoken answer to எப்படி இருக்கீங்க? — what you will hear far more than நன்றாக இருக்கிறேன்.",
    },
    // Understanding
    {
      key: "purindhadhaa",
      lesson: "understanding",
      topic: "Understanding",
      meaning: "Did you understand?",
      words: [["புரிந்ததா?", "purindhadhaa?"]],
      notes:
        "Teachers' favourite. Spoken: புரிஞ்சுதா? (purinjudhaa?). Answer: புரிந்தது (purindhadhu) / புரியல (puriyala).",
    },
    {
      key: "innoru-murai",
      lesson: "understanding",
      topic: "Understanding",
      meaning: "Once more / one more time",
      words: [
        ["இன்னொரு", "innoru"],
        ["முறை", "murai"],
      ],
      notes:
        "Spoken: இன்னொரு தடவை (innoru thadavai). Handy with சொல்லுங்கள் (sollungal, please say).",
    },
    // Family
    {
      key: "pillaigal",
      lesson: "parents-children",
      topic: "Family",
      meaning: "Children (one's kids)",
      script: "பிள்ளைகள்",
      roman: "pillaigal",
      notes:
        '"How many children do you have?": உங்களுக்கு எத்தனை பிள்ளைகள்? Spoken: புள்ளைங்க (pullainga).',
    },
    {
      key: "annaa",
      lesson: "siblings",
      topic: "Family",
      meaning: "Elder brother! (form of address)",
      words: [["அண்ணா!", "annaa!"]],
      notes:
        "How you call your elder brother — and any shopkeeper, driver or young man a bit older than you. Polite and friendly.",
    },
    {
      key: "thangachchi",
      lesson: "siblings",
      topic: "Family",
      meaning: "Younger sister (spoken)",
      script: "தங்கச்சி",
      roman: "thangachchi",
      notes: "Everyday form of தங்கை (thangai), also used to address her.",
    },
    {
      key: "thaaththaa",
      lesson: "grandparents",
      topic: "Family",
      meaning: "Grandfather / Grandpa",
      script: "தாத்தா",
      roman: "thaaththaa",
      notes: "Used for both grandfathers and to address any elderly man respectfully.",
    },
    {
      key: "paatti",
      lesson: "grandparents",
      topic: "Family",
      meaning: "Grandmother / Grandma",
      script: "பாட்டி",
      roman: "paatti",
      notes: "Used for both grandmothers and for any elderly woman.",
    },
    {
      key: "siththappaa",
      lesson: "grandparents",
      topic: "Family",
      meaning: "Uncle (father's younger brother)",
      script: "சித்தப்பா",
      roman: "siththappaa",
      notes:
        'Literally "small father". His wife is சித்தி (siththi), also the word for mother\'s younger sister.',
    },
    {
      key: "periyappaa",
      lesson: "grandparents",
      topic: "Family",
      meaning: "Uncle (father's elder brother)",
      script: "பெரியப்பா",
      roman: "periyappaa",
      notes:
        'Literally "big father". His wife is பெரியம்மா (periyammaa), also mother\'s elder sister.',
    },
    // People
    {
      key: "thozhi",
      lesson: "people",
      topic: "People",
      meaning: "Friend (female)",
      script: "தோழி",
      roman: "thozhi",
      notes: "A woman's or girl's female friend; ழ is the \"zh\" sound.",
    },
    {
      key: "saar",
      lesson: "people",
      topic: "People",
      meaning: "Sir",
      script: "சார்",
      roman: "saar",
      notes:
        "The everyday respectful address for men — teachers, officials, customers. For women: மேடம் (medam) or அம்மா (ammaa).",
    },
    {
      key: "olliyaana",
      lesson: "describing-people",
      topic: "Describing people",
      meaning: "Thin / slim",
      script: "ஒல்லியான",
      roman: "olliyaana",
      notes: "Spoken: ஒல்லியா இருக்கான் (olliyaa irukkaan, he is thin).",
    },
    {
      key: "buththisaali",
      lesson: "describing-people",
      topic: "Describing people",
      meaning: "Clever / intelligent (person)",
      script: "புத்திசாலி",
      roman: "buththisaali",
      notes: "A noun: அவள் புத்திசாலி (aval buththisaali, she is clever).",
    },
    // Food
    {
      key: "idli",
      lesson: "food-staples",
      topic: "Food",
      meaning: "Idli (steamed rice cakes)",
      script: "இட்லி",
      roman: "idli",
      notes:
        "The classic Tamil breakfast, with சட்னி (chatni) and சாம்பார் (saambaar). Usually ordered in pairs: ரெண்டு இட்லி.",
    },
    {
      key: "dosai",
      lesson: "food-staples",
      topic: "Food",
      meaning: "Dosa",
      script: "தோசை",
      roman: "dosai",
      notes: 'Tamils say "dosai". Varieties: மசால் தோசை (masaal dosai), ரவா தோசை (ravaa dosai).',
    },
    {
      key: "saambaar",
      lesson: "food-staples",
      topic: "Food",
      meaning: "Sambar (lentil and vegetable stew)",
      script: "சாம்பார்",
      roman: "saambaar",
      notes: "Poured over rice as the first course of a meal, and served with idli and dosai.",
    },
    {
      key: "rasam",
      lesson: "food-staples",
      topic: "Food",
      meaning: "Rasam (peppery tamarind soup)",
      script: "ரசம்",
      roman: "rasam",
      notes: "Eaten with rice after sambar; also drunk as a home remedy for colds.",
    },
    {
      key: "podhum",
      lesson: "hungry-thirsty",
      topic: "Food",
      meaning: "Enough! (no more, thanks)",
      words: [["போதும்", "podhum"]],
      notes:
        "Essential at meals, where hosts keep serving. Polite: போதுங்க (podhunga). Firmer: போதும், போதும்!",
    },
    {
      key: "vaazhai-ilai",
      lesson: "ordering-food",
      topic: "Restaurant",
      meaning: "Banana leaf (as a plate)",
      script: "வாழை இலை",
      roman: "vaazhai ilai",
      notes:
        "Meals are served on a banana leaf at weddings and many restaurants. Folding it towards you at the end means you enjoyed the meal.",
    },
    {
      key: "meals",
      lesson: "ordering-food",
      topic: "Restaurant",
      meaning: "Meals (South Indian rice thali)",
      script: "மீல்ஸ்",
      roman: "meels",
      notes:
        'In restaurants a full rice meal is "meals": ஒரு மீல்ஸ் (oru meels). Often unlimited refills.',
    },
    {
      key: "paarsal",
      lesson: "ordering-food",
      topic: "Restaurant",
      meaning: "Takeaway / parcel",
      script: "பார்சல்",
      roman: "paarsal",
      notes: '"Two idlis to take away": ரெண்டு இட்லி பார்சல் (rendu idli paarsal).',
    },
    // Drinks
    {
      key: "filter-kaapi",
      lesson: "drinks",
      topic: "Drinks",
      meaning: "Filter coffee",
      script: "ஃபில்டர் காபி",
      roman: "filtar kaapi",
      notes:
        "Strong South Indian coffee with boiled milk, frothed between a tumbler and a dabara (டபரா, dabaraa).",
    },
    {
      key: "padhaneer",
      lesson: "drinks",
      topic: "Drinks",
      meaning: "Padaneer (fresh palm sap drink)",
      script: "பதநீர்",
      roman: "padhaneer",
      notes:
        "Sweet sap from the palmyra palm (பனை மரம், panai maram), Tamil Nadu's state tree; sold in summer.",
    },
    // Fruits & vegetables
    {
      key: "palaappazham",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      meaning: "Jackfruit",
      script: "பலாப்பழம்",
      roman: "palaappazham",
      notes: "One of the முக்கனி (mukkani, three classic fruits) with mango and banana.",
    },
    {
      key: "murungaikkaai",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      meaning: "Drumstick (moringa pod)",
      script: "முருங்கைக்காய்",
      roman: "murungaikkaai",
      notes: "A favourite in sambar.",
    },
    {
      key: "kaththarikkaai",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      meaning: "Brinjal / aubergine",
      script: "கத்தரிக்காய்",
      roman: "kaththarikkaai",
    },
    {
      key: "thengaai",
      lesson: "fruits-vegetables",
      topic: "Fruits & vegetables",
      meaning: "Coconut",
      script: "தேங்காய்",
      roman: "thengaai",
      notes:
        "Ripe coconut, used in chutney and cooking; tender coconut is இளநீர் (ilaneer). The tree is தென்னை மரம் (thennai maram).",
    },
    // Numbers & time
    {
      key: "oru",
      lesson: "numbers-1-10",
      topic: "Numbers",
      meaning: "One / a (before a noun)",
      script: "ஒரு",
      roman: "oru",
      notes:
        "ஒன்று (ondru) is the counting form; ஒரு goes before nouns: ஒரு டீ (oru tee, one tea). Before a vowel: ஓர் (or), in formal Tamil.",
    },
    {
      key: "arai",
      lesson: "numbers-11-20",
      topic: "Numbers",
      meaning: "Half",
      script: "அரை",
      roman: "arai",
      notes:
        'அரை கிலோ (arai kilo, half a kilo); அரை மணி நேரம் (arai mani neram, half an hour). "Five and a half": ஐந்தரை (aindharai).',
    },
    {
      key: "latcham",
      lesson: "big-numbers",
      topic: "Numbers",
      meaning: "Lakh (100,000)",
      script: "லட்சம்",
      roman: "latcham",
      notes:
        "Indian numbering: பத்து லட்சம் (paththu latcham) = 1 million. 10 million = ஒரு கோடி (oru kodi).",
    },
    {
      key: "mani",
      lesson: "time",
      topic: "Time",
      meaning: "O'clock / hour (also bell)",
      script: "மணி",
      roman: "mani",
      notes:
        "மணி என்ன? (mani enna?, what time is it?), ஒரு மணி நேரம் (oru mani neram, one hour). Also a common name.",
    },
    {
      key: "appuram",
      lesson: "time",
      topic: "Time",
      meaning: "Then / later / after that",
      script: "அப்புறம்",
      roman: "appuram",
      notes:
        "Spoken equivalent of பிறகு (piragu). Also a conversation filler: அப்புறம்? (appuram?, and then? / what else?).",
    },
    // Days & festivals
    {
      key: "pongal",
      lesson: "days",
      topic: "Days",
      meaning: "Pongal (harvest festival, mid-January)",
      script: "பொங்கல்",
      roman: "pongal",
      notes:
        "Tamil Nadu's biggest festival, celebrated for several days around 14 January; also a dish of rice and lentils. Greeting: பொங்கல் வாழ்த்துகள் (pongal vaazhththugal).",
    },
    {
      key: "deepavali",
      lesson: "days",
      topic: "Days",
      meaning: "Deepavali / Diwali",
      script: "தீபாவளி",
      roman: "theepaavali",
      notes:
        "In Tamil Nadu it starts before dawn with an oil bath and new clothes. Greeting: தீபாவளி வாழ்த்துகள் (theepaavali vaazhththugal).",
    },
    {
      key: "thamizh-puththaandu",
      lesson: "days",
      topic: "Days",
      meaning: "Tamil New Year (mid-April)",
      script: "தமிழ்ப் புத்தாண்டு",
      roman: "Thamizhp puththaandu",
      notes:
        "The first day of the month சித்திரை (Chiththirai), around 14 April. Greeting: புத்தாண்டு வாழ்த்துகள் (puththaandu vaazhththugal).",
    },
    {
      key: "vaazhththugal",
      lesson: "days",
      topic: "Days",
      meaning: "Best wishes / Congratulations",
      script: "வாழ்த்துகள்",
      roman: "vaazhththugal",
      notes:
        "Used for birthdays, festivals and successes: பிறந்தநாள் வாழ்த்துகள் (pirandhanaal vaazhththugal, happy birthday). Also spelled வாழ்த்துக்கள்.",
    },
    // Daily routine
    {
      key: "kolam",
      lesson: "routine-verbs",
      topic: "Daily routine",
      meaning: "Kolam (rice-flour drawing at the doorstep)",
      script: "கோலம்",
      roman: "kolam",
      notes:
        "Drawn every morning in front of many Tamil homes: கோலம் போட (kolam poda, to draw a kolam).",
    },
    {
      key: "pal-thulakka",
      lesson: "routine-verbs",
      topic: "Daily routine",
      meaning: "To brush (one's) teeth",
      script: "பல் துலக்க",
      roman: "pal thulakka",
      notes: 'Spoken: பல் தேய்க்க (pal theykka, to rub the teeth) or "brush பண்ண".',
    },
    {
      key: "paada",
      lesson: "activity-verbs",
      topic: "Activities",
      meaning: "To sing",
      script: "பாட",
      roman: "paada",
      notes: "Root: பாடு (paadu). From the same root: பாட்டு (paattu, song).",
    },
    {
      key: "thirumba",
      lesson: "movement-verbs",
      topic: "Activities",
      meaning: "To turn / to return",
      script: "திரும்ப",
      roman: "thirumba",
      notes:
        "Also an adverb: திரும்ப வா (thirumba vaa, come back); திரும்பச் சொல்லுங்கள் (thirumbach sollungal, say it again).",
    },
    // Places
    {
      key: "teekkadai",
      lesson: "places-1",
      topic: "Places",
      meaning: "Tea stall",
      script: "டீக்கடை",
      roman: "teekkadai",
      notes: "The neighbourhood tea shop — the place for tea, snacks, newspapers and gossip.",
    },
    {
      key: "theru",
      lesson: "places-1",
      topic: "Places",
      meaning: "Street",
      script: "தெரு",
      roman: "theru",
      notes: "Addresses use it: கோயில் தெரு (koyil theru, Temple Street).",
    },
    {
      key: "kadarkarai",
      lesson: "places-2",
      topic: "Places",
      meaning: "Beach / seashore",
      script: "கடற்கரை",
      roman: "kadarkarai",
      notes:
        "Chennai's Marina Beach is மெரினா கடற்கரை (Merinaa kadarkarai); in speech also பீச் (beech).",
    },
    {
      key: "meenaatchi-amman-koyil",
      lesson: "places-2",
      topic: "Places",
      meaning: "Meenakshi Amman Temple (Madurai)",
      script: "மீனாட்சி அம்மன் கோயில்",
      roman: "Meenaatchi Amman Koyil",
      notes:
        "The great temple at the heart of Madurai, with its towering கோபுரம் (gopuram, gateway tower).",
    },
    {
      key: "pakkaththil",
      lesson: "position-words",
      topic: "Directions",
      meaning: "Near / next to (everyday word)",
      script: "பக்கத்தில்",
      roman: "pakkaththil",
      notes:
        'The usual spoken word for "near": பஸ் ஸ்டாப் பக்கத்துல (bas staap pakkaththula, near the bus stop).',
    },
    // Shopping
    {
      key: "chillarai",
      lesson: "money-words",
      topic: "Shopping",
      meaning: "Small change (coins / notes)",
      script: "சில்லறை",
      roman: "chillarai",
      notes:
        '"Do you have change?": சில்லறை இருக்கா? (chillarai irukkaa?) — often asked by bus conductors and autos.',
    },
    {
      key: "oodhaa",
      lesson: "colours",
      topic: "Colours",
      meaning: "Purple / violet",
      script: "ஊதா",
      roman: "oodhaa",
    },
    {
      key: "saambal-niram",
      lesson: "colours",
      topic: "Colours",
      meaning: "Grey (ash colour)",
      script: "சாம்பல் நிறம்",
      roman: "saambal niram",
      notes: 'Literally "ash colour". People also say கிரே (kire).',
    },
    {
      key: "vetti",
      lesson: "clothes",
      topic: "Clothes",
      meaning: "Veshti (white wrap worn by men)",
      script: "வேட்டி",
      roman: "vetti",
      notes:
        "Worn with a shirt for weddings, temples and festivals; tied, not worn: வேட்டி கட்ட (vetti katta).",
    },
    {
      key: "dhaavani",
      lesson: "clothes",
      topic: "Clothes",
      meaning: "Half-saree (davani)",
      script: "தாவணி",
      roman: "dhaavani",
      notes: "Traditional outfit of young girls, worn especially at festivals.",
    },
    // Transport & travel
    {
      key: "share-auto",
      lesson: "vehicles",
      topic: "Transport",
      meaning: "Share auto",
      script: "ஷேர் ஆட்டோ",
      roman: "sher aatto",
      notes: "A shared auto on a fixed route, cheap and common in Chennai.",
    },
    {
      key: "munbadhivu",
      lesson: "travel-words",
      topic: "Travel",
      meaning: "Reservation / advance booking",
      script: "முன்பதிவு",
      roman: "munbadhivu",
      notes: "Seen on railway counters. In speech: ரிசர்வேஷன் (rizarveshan).",
    },
    {
      key: "irangu",
      lesson: "travel-phrases",
      topic: "Travel",
      meaning: "To get off (a bus or train)",
      script: "இறங்க",
      roman: "iranga",
      notes:
        '"Where do you get off?": எங்கே இறங்க வேண்டும்? (enge iranga vendum?). "Get off here": இங்கே இறங்குங்கள் (inge irangungal). Getting on is ஏற (era).',
    },
    // Conversation
    {
      key: "appadiyaa",
      lesson: "conv-friend",
      topic: "Conversation",
      meaning: "Is that so? / Really?",
      words: [["அப்படியா?", "appadiyaa?"]],
      notes: 'The everyday reaction to news. A long rising "ஓஹோ" (oho) means "I see!".',
    },
    {
      key: "summaa",
      lesson: "conv-friend",
      topic: "Conversation",
      meaning: "Just / for no reason / nothing much",
      script: "சும்மா",
      roman: "summaa",
      notes:
        'Very common: சும்மா வந்தேன் (summaa vandhen, I just dropped by). "What are you doing?" — சும்மா (nothing much).',
    },
    {
      key: "daa",
      lesson: "conv-friend",
      topic: "Conversation",
      meaning: "Hey (to a close male friend)",
      script: "டா",
      roman: "daa",
      notes:
        "An affectionate tag among close friends: வாடா (vaadaa, come, man). To a girl: டி (di). Never use it with strangers or elders.",
    },
    // Feelings & health
    {
      key: "sandhosham",
      lesson: "feelings",
      topic: "Feelings",
      meaning: "Happiness / joy (everyday word)",
      script: "சந்தோஷம்",
      roman: "sandhosham",
      notes: "The spoken word for happy: ரொம்ப சந்தோஷம்! (romba sandhosham!, I'm so glad!).",
    },
    {
      key: "sali",
      lesson: "health",
      topic: "Health",
      meaning: "A cold / runny nose",
      script: "சளி",
      roman: "sali",
      notes: '"I have a cold": எனக்குச் சளி பிடித்திருக்கிறது (enakkuch sali pidiththirukkiradhu).',
    },
    // Relationships
    {
      key: "chellam",
      lesson: "love-friendship",
      topic: "Relationships",
      meaning: "Darling / dear one",
      script: "செல்லம்",
      roman: "chellam",
      notes:
        "An affectionate word for children and loved ones: என் செல்லம் (en chellam, my darling).",
    },
    {
      key: "nanbaa",
      lesson: "love-friendship",
      topic: "Relationships",
      meaning: "Friend! / Buddy! (calling a friend)",
      words: [["நண்பா!", "nanbaa!"]],
      notes: "How you call out to a male friend; to a female friend: தோழி! (thozhi!).",
    },
    // Weather
    {
      key: "veyil",
      lesson: "weather",
      topic: "Weather",
      meaning: "Sunshine / heat of the sun",
      script: "வெயில்",
      roman: "veyil",
      notes:
        "The word Tamils use most about weather: வெயில் அதிகம் (veyil adhigam, it's very hot). The hottest period is அக்னி நட்சத்திரம் (agni natchaththiram) in May.",
    },
    {
      key: "puyal",
      lesson: "weather",
      topic: "Weather",
      meaning: "Cyclone / storm",
      script: "புயல்",
      roman: "puyal",
      notes: "Cyclones hit the Tamil coast in October–December, during the north-east monsoon.",
    },
    // College & work, hobbies, plans, help
    {
      key: "sambalam",
      lesson: "college-work",
      topic: "College & work",
      meaning: "Salary",
      script: "சம்பளம்",
      roman: "sambalam",
    },
    {
      key: "kabaddi",
      lesson: "hobbies",
      topic: "Hobbies",
      meaning: "Kabaddi",
      script: "கபடி",
      roman: "kabadi",
      notes: "Traditional team sport, very popular in Tamil villages.",
    },
    {
      key: "bharadhanaattiyam",
      lesson: "hobbies",
      topic: "Hobbies",
      meaning: "Bharatanatyam (classical dance)",
      script: "பரதநாட்டியம்",
      roman: "Bharadhanaattiyam",
      notes: "The classical dance form of Tamil Nadu.",
    },
    {
      key: "varugireergalaa",
      lesson: "plans",
      topic: "Plans & invitations",
      meaning: "Will you come?",
      words: [["வருகிறீர்களா?", "varugireergalaa?"]],
      notes:
        "Polite invitation question. Spoken: வரீங்களா? (vareengalaa?); to a friend: வரியா? (variyaa?).",
    },
    {
      key: "konjam",
      lesson: "requests-help",
      topic: "Requests & help",
      meaning: "A little / a bit",
      script: "கொஞ்சம்",
      roman: "konjam",
      notes:
        "Softens any request: கொஞ்சம் சொல்லுங்கள் (konjam sollungal, please tell me). Opposite: நிறைய (niraiya, a lot) or spoken ரொம்ப (romba).",
    },
  ],
  dialogues: {
    meetingSomeone: {
      context: "Ravi meets Asha at a friend's house in Chennai.",
      lines: [
        { speaker: "A", script: "வணக்கம்.", roman: "vanakkam.", meaning: "Hello." },
        { speaker: "B", script: "வணக்கம்.", roman: "vanakkam.", meaning: "Hello." },
        {
          speaker: "A",
          script: "உங்கள் பெயர் என்ன?",
          roman: "ungal peyar enna?",
          meaning: "What is your name?",
        },
        {
          speaker: "B",
          script: "என் பெயர் ஆஷா. உங்கள் பெயர் என்ன?",
          roman: "en peyar Asha. ungal peyar enna?",
          meaning: "My name is Asha. What is your name?",
        },
        {
          speaker: "A",
          script: "என் பெயர் ரவி. நீங்கள் எந்த ஊர்?",
          roman: "en peyar Ravi. neengal endha oor?",
          meaning: "My name is Ravi. Where are you from?",
        },
        {
          speaker: "B",
          script: "நான் கோயம்புத்தூரைச் சேர்ந்தவள். உங்களைச் சந்தித்ததில் மகிழ்ச்சி.",
          roman: "naan Koyambuththooraich serndhaval. ungalaich sandhiththadhil magizhchchi.",
          meaning: "I am from Coimbatore. Nice to meet you.",
        },
        {
          speaker: "A",
          script: "எனக்கும் உங்களைச் சந்தித்ததில் மகிழ்ச்சி.",
          roman: "enakkum ungalaich sandhiththadhil magizhchchi.",
          meaning: "Nice to meet you too.",
        },
      ],
    },
    meetingFriend: {
      context: "Two old college friends run into each other in Madurai (they use the casual நீ).",
      lines: [
        {
          speaker: "A",
          script: "ஹாய்! எப்படி இருக்கிறாய்?",
          roman: "haay! eppadi irukkiraai?",
          meaning: "Hi! How are you?",
        },
        {
          speaker: "B",
          script: "நான் நன்றாக இருக்கிறேன். நீ எப்படி?",
          roman: "naan nandraaga irukkiren. nee eppadi?",
          meaning: "I am fine. And you?",
        },
        {
          speaker: "A",
          script: "நானும் நன்றாக இருக்கிறேன். பார்த்து ரொம்ப நாள் ஆகிவிட்டது!",
          roman: "naanum nandraaga irukkiren. paarththu romba naal aagivittadhu!",
          meaning: "I am also fine. Long time no see!",
        },
        {
          speaker: "B",
          script: "ஆமாம். இப்போதெல்லாம் என்ன செய்கிறாய்?",
          roman: "aamaam. ippodhellaam enna seygiraai?",
          meaning: "Yes. What are you doing these days?",
        },
        {
          speaker: "A",
          script: "படித்துக்கொண்டிருக்கிறேன். சாப்பிட்டாயா?",
          roman: "padiththukkondirukkiren. saappittaayaa?",
          meaning: "I am studying. Have you eaten?",
        },
        {
          speaker: "B",
          script: "ஆமாம், சாப்பிட்டேன். வா, டீ குடிக்கலாம்.",
          roman: "aamaam, saappitten. vaa, tee kudikkalaam.",
          meaning: "Yes, I have eaten. Come, let's have tea.",
        },
        {
          speaker: "A",
          script: "சரி, போகலாம்.",
          roman: "sari, pogalaam.",
          meaning: "Okay, let's go.",
        },
      ],
    },
    restaurant: {
      context: 'Asha orders lunch at a small restaurant ("hotel") in Tiruchirappalli.',
      lines: [
        {
          speaker: "A",
          script: "உங்களுக்கு என்ன வேண்டும்?",
          roman: "ungalukku enna vendum?",
          meaning: "What would you like?",
        },
        {
          speaker: "B",
          script: "ஒரு பிளேட் சாதமும் பருப்பும் கொடுங்கள்.",
          roman: "oru pilet saadhamum paruppum kodungal.",
          meaning: "Please give me one plate of rice and dal.",
        },
        {
          speaker: "A",
          script: "குடிக்க ஏதாவது வேண்டுமா?",
          roman: "kudikka edhaavadhu vendumaa?",
          meaning: "Anything to drink?",
        },
        {
          speaker: "B",
          script: "ஒரு டீ, சர்க்கரை இல்லாமல் கொடுங்கள்.",
          roman: "oru tee, sarkkarai illaamal kodungal.",
          meaning: "One tea, without sugar, please.",
        },
        {
          speaker: "A",
          script: "சரி. வேறு ஏதாவது?",
          roman: "sari. veru edhaavadhu?",
          meaning: "Okay. Anything else?",
        },
        {
          speaker: "B",
          script: "கொஞ்சம் தண்ணீர் கொடுங்கள். இது காரமாக இருக்குமா?",
          roman: "konjam thanneer kodungal. idhu kaaramaaga irukkumaa?",
          meaning: "Some water, please. Is it spicy?",
        },
        {
          speaker: "A",
          script: "கொஞ்சம் காரமாக இருக்கும்.",
          roman: "konjam kaaramaaga irukkum.",
          meaning: "A little spicy.",
        },
        {
          speaker: "B",
          script: "பரவாயில்லை. சாப்பிட்ட பிறகு பில் கொடுங்கள்.",
          roman: "paravaayillai. saappitta piragu bil kodungal.",
          meaning: "That's fine. The bill, please, after the meal.",
        },
      ],
    },
    shopping: {
      context: "Ravi buys mangoes from a fruit seller at a market in Chennai.",
      lines: [
        {
          speaker: "A",
          script: "மாம்பழம் இருக்கிறதா?",
          roman: "maambazham irukkiradhaa?",
          meaning: "Do you have mangoes?",
        },
        {
          speaker: "B",
          script: "ஆமாம், இருக்கிறது.",
          roman: "aamaam, irukkiradhu.",
          meaning: "Yes, we have.",
        },
        {
          speaker: "A",
          script: "ஒரு கிலோ என்ன விலை?",
          roman: "oru kilo enna vilai?",
          meaning: "How much does one kilo cost?",
        },
        {
          speaker: "B",
          script: "நூறு ரூபாய்.",
          roman: "nooru roobaai.",
          meaning: "One hundred rupees.",
        },
        {
          speaker: "A",
          script: "இது மிகவும் விலை அதிகம். கொஞ்சம் விலையைக் குறையுங்கள்.",
          roman: "idhu migavum vilai adhigam. konjam vilaiyaik kuraiyungal.",
          meaning: "That is too expensive. Please reduce the price a little.",
        },
        {
          speaker: "B",
          script: "சரி, தொண்ணூறு ரூபாய் கொடுங்கள்.",
          roman: "sari, thonnooru roobaai kodungal.",
          meaning: "Okay, give ninety rupees.",
        },
        {
          speaker: "A",
          script: "சரி, ஒரு கிலோ வாங்கிக்கொள்கிறேன்.",
          roman: "sari, oru kilo vaangikkolgiren.",
          meaning: "Fine, I will take one kilo.",
        },
      ],
    },
    directions: {
      context: "Asha asks a passer-by the way to the railway station in Madurai.",
      lines: [
        {
          speaker: "A",
          script: "மன்னிக்கவும், ரயில் நிலையம் எங்கே இருக்கிறது?",
          roman: "mannikkavum, rayil nilaiyam enge irukkiradhu?",
          meaning: "Excuse me, where is the railway station?",
        },
        {
          speaker: "B",
          script: "நேராகப் போய், இடது பக்கம் திரும்புங்கள்.",
          roman: "neraagap poi, idadhu pakkam thirumbungal.",
          meaning: "Go straight, then turn left.",
        },
        { speaker: "A", script: "தூரமா?", roman: "thooramaa?", meaning: "Is it far?" },
        {
          speaker: "B",
          script: "இல்லை, அருகில்தான். நடந்தால் ஐந்து நிமிடம் ஆகும்.",
          roman: "illai, arugilthaan. nadandhaal aindhu nimidam aagum.",
          meaning: "No, it is near. About five minutes on foot.",
        },
        {
          speaker: "A",
          script: "மிக்க நன்றி.",
          roman: "mikka nandri.",
          meaning: "Thank you very much.",
        },
        {
          speaker: "B",
          script: "பரவாயில்லை.",
          roman: "paravaayillai.",
          meaning: "You're welcome.",
        },
      ],
    },
    college: {
      context: "On her first day at a college in Coimbatore, Asha meets a senior student.",
      lines: [
        {
          speaker: "A",
          script: "ஹாய், நீங்கள் இங்கே புதியவரா?",
          roman: "haay, neengal inge pudhiyavaraa?",
          meaning: "Hi, are you new here?",
        },
        {
          speaker: "B",
          script: "ஆமாம், இன்றுதான் என் முதல் நாள்.",
          roman: "aamaam, indruthaan en mudhal naal.",
          meaning: "Yes, today is my first day.",
        },
        {
          speaker: "A",
          script: "நீங்கள் எந்த வகுப்பு?",
          roman: "neengal endha vaguppu?",
          meaning: "Which class are you in?",
        },
        {
          speaker: "B",
          script: "நான் முதலாம் ஆண்டு. நூலகம் எங்கே இருக்கிறது?",
          roman: "naan mudhalaam aandu. noolagam enge irukkiradhu?",
          meaning: "I am in first year. Where is the library?",
        },
        {
          speaker: "A",
          script: "அலுவலகத்துக்குப் பின்னால் இருக்கிறது. வாருங்கள், நான் காட்டுகிறேன்.",
          roman: "aluvalagaththukkup pinnaal irukkiradhu. vaarungal, naan kaattugiren.",
          meaning: "It is behind the office. Come, I will show you.",
        },
        {
          speaker: "B",
          script: "நன்றி! தேர்வு எப்போது?",
          roman: "nandri! thervu eppodhu?",
          meaning: "Thank you! When is the exam?",
        },
        {
          speaker: "A",
          script: "அடுத்த மாதம்.",
          roman: "aduththa maadham.",
          meaning: "Next month.",
        },
      ],
    },
    phoneCall: {
      context: "Ravi phones his friend Asha (friends use the casual நீ).",
      lines: [
        { speaker: "A", script: "ஹலோ?", roman: "halo?", meaning: "Hello?" },
        {
          speaker: "B",
          script: "ஹலோ, யார் பேசுகிறீர்கள்?",
          roman: "halo, yaar pesugireergal?",
          meaning: "Hello, who is speaking?",
        },
        {
          speaker: "A",
          script: "நான்தான், ரவி. நீ எங்கே இருக்கிறாய்?",
          roman: "naanthaan, Ravi. nee enge irukkiraai?",
          meaning: "It's me, Ravi. Where are you?",
        },
        {
          speaker: "B",
          script: "நான் வீட்டில் இருக்கிறேன். என்ன விஷயம்?",
          roman: "naan veettil irukkiren. enna vishayam?",
          meaning: "I am at home. What happened?",
        },
        {
          speaker: "A",
          script: "நாளை உனக்கு நேரம் இருக்கிறதா?",
          roman: "naalai unakku neram irukkiradhaa?",
          meaning: "Are you free tomorrow?",
        },
        {
          speaker: "B",
          script: "ஆமாம், இருக்கிறது.",
          roman: "aamaam, irukkiradhu.",
          meaning: "Yes, I am free.",
        },
        {
          speaker: "A",
          script: "அப்படியென்றால் மாலையில் என் வீட்டுக்கு வா.",
          roman: "appadiyendraal maalaiyil en veettukku vaa.",
          meaning: "Then come to my house in the evening.",
        },
        {
          speaker: "B",
          script: "சரி, வருகிறேன். பிறகு ஃபோன் செய்கிறேன்.",
          roman: "sari, varugiren. piragu fon seygiren.",
          meaning: "Okay, I will come. I will call you later.",
        },
      ],
    },
    askingForHelp: {
      context: "A visitor in Tiruchirappalli asks a shopkeeper for help with an address.",
      lines: [
        {
          speaker: "A",
          script: "மன்னிக்கவும், எனக்குக் கொஞ்சம் உதவி செய்ய முடியுமா?",
          roman: "mannikkavum, enakkuk konjam udhavi seyya mudiyumaa?",
          meaning: "Excuse me, can you help me?",
        },
        {
          speaker: "B",
          script: "சரி, சொல்லுங்கள்.",
          roman: "sari, sollungal.",
          meaning: "Yes, tell me.",
        },
        {
          speaker: "A",
          script: "நான் வழி தவறிவிட்டேன். இந்த முகவரி எனக்குப் புரியவில்லை.",
          roman: "naan vazhi thavarivitten. indha mugavari enakkup puriyavillai.",
          meaning: "I am lost. I don't understand this address.",
        },
        {
          speaker: "B",
          script: "காட்டுங்கள். இது சந்தைக்கு அருகில் இருக்கிறது.",
          roman: "kaattungal. idhu sandhaikku arugil irukkiradhu.",
          meaning: "Show me. This is near the market.",
        },
        {
          speaker: "A",
          script: "தயவுசெய்து மெதுவாகப் பேசுங்கள்.",
          roman: "thayavuseydhu medhuvaagap pesungal.",
          meaning: "Please speak slowly.",
        },
        {
          speaker: "B",
          script: "சந்தைக்குப் போய் அங்கே கேளுங்கள். அது பக்கத்தில்தான்.",
          roman: "sandhaikkup poi ange kelungal. adhu pakkaththilthaan.",
          meaning: "Go to the market and ask there. It is close.",
        },
        {
          speaker: "A",
          script: "மிக்க நன்றி.",
          roman: "mikka nandri.",
          meaning: "Thank you so much.",
        },
      ],
    },
    travel: {
      context: "Ravi gets on a town bus in Chennai and talks to the conductor.",
      lines: [
        {
          speaker: "A",
          script: "இந்தப் பஸ் ரயில் நிலையத்துக்குப் போகுமா?",
          roman: "indhap bas rayil nilaiyaththukkup pogumaa?",
          meaning: "Does this bus go to the railway station?",
        },
        {
          speaker: "B",
          script: "போகும். நீங்கள் எங்கே இறங்க வேண்டும்?",
          roman: "pogum. neengal enge iranga vendum?",
          meaning: "Yes. Where do you want to get off?",
        },
        {
          speaker: "A",
          script: "ரயில் நிலையத்தில். டிக்கெட் எவ்வளவு?",
          roman: "rayil nilaiyaththil. tikket evvalavu?",
          meaning: "At the railway station. How much is the ticket?",
        },
        {
          speaker: "B",
          script: "இருபது ரூபாய்.",
          roman: "irubadhu roobaai.",
          meaning: "Twenty rupees.",
        },
        {
          speaker: "A",
          script: "எவ்வளவு நேரம் ஆகும்?",
          roman: "evvalavu neram aagum?",
          meaning: "How long will it take?",
        },
        {
          speaker: "B",
          script: "சுமார் அரை மணி நேரம்.",
          roman: "sumaar arai mani neram.",
          meaning: "About half an hour.",
        },
        {
          speaker: "A",
          script: "ரயில் நிலையம் வந்ததும் எனக்குச் சொல்லுங்கள்.",
          roman: "rayil nilaiyam vandhadhum enakkuch sollungal.",
          meaning: "Please tell me when we reach the station.",
        },
        {
          speaker: "B",
          script: "சரி, சொல்கிறேன்.",
          roman: "sari, solgiren.",
          meaning: "Okay, I will tell you.",
        },
      ],
    },
    dailyRoutine: {
      context:
        "Two classmates talk about their daily routine (habits use the future-habitual form -வேன்).",
      lines: [
        {
          speaker: "A",
          script: "நீங்கள் எத்தனை மணிக்கு எழுந்திருப்பீர்கள்?",
          roman: "neengal eththanai manikku ezhundhiruppeergal?",
          meaning: "What time do you wake up?",
        },
        {
          speaker: "B",
          script: "நான் ஆறு மணிக்கு எழுந்திருப்பேன்.",
          roman: "naan aaru manikku ezhundhiruppen.",
          meaning: "I wake up at six o'clock.",
        },
        {
          speaker: "A",
          script: "அதற்குப் பிறகு என்ன செய்வீர்கள்?",
          roman: "adharkup piragu enna seyveergal?",
          meaning: "What do you do after that?",
        },
        {
          speaker: "B",
          script: "குளித்து, காலை உணவு சாப்பிட்டு, கல்லூரிக்குப் போவேன்.",
          roman: "kuliththu, kaalai unavu saappittu, kalloorikkup poven.",
          meaning: "I bathe, eat breakfast and go to college.",
        },
        {
          speaker: "A",
          script: "வீட்டுக்கு எப்போது வருவீர்கள்?",
          roman: "veettukku eppodhu varuveergal?",
          meaning: "When do you come home?",
        },
        {
          speaker: "B",
          script: "மாலையில் வீட்டுக்கு வந்து படிப்பேன்.",
          roman: "maalaiyil veettukku vandhu padippen.",
          meaning: "I come home in the evening and study.",
        },
        {
          speaker: "A",
          script: "எப்போது தூங்குவீர்கள்?",
          roman: "eppodhu thoonguveergal?",
          meaning: "When do you sleep?",
        },
        {
          speaker: "B",
          script: "இரவு பத்து மணிக்குத் தூங்குவேன்.",
          roman: "iravu paththu manikkuth thoonguven.",
          meaning: "I sleep at ten o'clock at night.",
        },
      ],
    },
  },
  lessonNotes: {
    greetings:
      'வணக்கம் (vanakkam) works for every greeting, any time of day. Tamil avoids a final "goodbye": you say போய் வருகிறேன் (poi varugiren, "I\'ll go and come back") and the host answers போய் வாருங்கள் (poi vaarungal).',
    "polite-words":
      'Tamil politeness lives in verb endings more than in "please": the polite -ங்கள் (-ngal, spoken -ங்க -nga) turns கொடு (give!) into கொடுங்கள் (please give). Adding -ங்க to yes/okay (ஆமாங்க, சரிங்க) sounds respectful.',
    actions:
      'Verbs are shown in the infinitive (வர "to come", சாப்பிட "to eat"). The short root — வா, சாப்பிடு — is the casual command; add -உங்கள் for the polite one: வாருங்கள், சாப்பிடுங்கள்.',
    "this-and-that":
      'Tamil has i- words for near things and a- words for far ones: இது/அது (this/that), இங்கே/அங்கே (here/there), இவர்/அவர் (this/that person). "X is Y" sentences need no verb: இது தண்ணீர் (this is water).',
    "my-name":
      "Written Tamil and spoken Tamil differ a lot. This course teaches the polite standard form that works everywhere (உங்கள் பெயர் என்ன?); notes give the everyday spoken version (உங்க பேர் என்ன?). Both are correct — the first is safer for beginners.",
    "how-are-you":
      "Formal endings shrink in speech: இருக்கிறீர்கள் → இருக்கீங்க, இருக்கிறேன் → இருக்கேன், நன்றாக → நல்லா. So நீங்கள் எப்படி இருக்கிறீர்கள்? is said எப்படி இருக்கீங்க? (eppadi irukkeenga?) — learn to recognise both.",
    "where-from":
      "Tamil adds case endings to nouns instead of using prepositions: -இல் (-il, in/at) — சென்னையில் (in Chennai); -இலிருந்து (-ilirundhu, from) — இந்தியாவிலிருந்து (from India); -க்கு (-kku, to) — மதுரைக்கு (to Madurai). ஊர் (oor), your home town, is a key word in introductions.",
    understanding:
      "Understanding, knowing, wanting and liking use the dative -க்கு: எனக்குப் புரியவில்லை (to me it is not understood), உங்களுக்குத் தெரியுமா? (to you is it known?). After எனக்கு a following க/ச/த/ப is doubled in careful writing: எனக்குப் புரிகிறது.",
    siblings:
      "Tamil always says whether a sibling is older or younger: அண்ணன் / தம்பி (elder / younger brother), அக்கா / தங்கை (elder / younger sister). The same words are used to address strangers politely — அண்ணா, அக்கா for people a bit older, தம்பி for younger boys.",
    grandparents:
      "Everyone calls a grandfather தாத்தா (thaaththaa) and a grandmother பாட்டி (paatti) on both sides; you add அப்பா வழி (father's side) or அம்மா வழி (mother's side) only to be precise. Uncles and aunts have distinct words: மாமா (mother's brother), அத்தை (father's sister), சித்தப்பா / பெரியப்பா (father's younger / elder brother).",
    people:
      "Tamil marks respect with -ர் endings: நண்பன் (friend, casual) → நண்பர் (respectful), மாணவன் → மாணவர். With strangers use the respectful form, and address men as சார் (saar) or அண்ணா, women as மேடம் (medam) or அக்கா/அம்மா.",
    "describing-people":
      "Adjectives before a noun usually end in -ஆன (-aana): அழகான வீடு (a beautiful house). Gender shows up only in he/she: அவன் (he, casual), அவள் (she, casual), அவர் (he/she, respectful).",
    "hungry-thirsty":
      'Feelings of the body take the dative: எனக்குப் பசிக்கிறது ("to me it hungers" = I am hungry), எனக்குத் தண்ணீர் வேண்டும் ("to me water is needed" = I want water). In speech வேண்டும் becomes வேணும் (venum).',
    "ordering-food":
      'Requests end in -ங்கள் (-ngal), spoken -ங்க: ஒரு டீ கொடுங்கள் / குடுங்க. Restaurants are called "hotels" in Tamil Nadu, and a rice thali is "meals".',
    "numbers-1-10":
      'Counting forms (ஒன்று, இரண்டு …) are shortened in speech: ஒண்ணு, ரெண்டு, மூணு, நாலு, அஞ்சு. Before a noun "one" is ஒரு (oru): ஒரு டீ. Prices and phone numbers are very often said in English.',
    "numbers-11-20":
      "11–18 are built from பதின்- (ten) + the unit: பதினொன்று (11), பதினைந்து (15). 12 is பன்னிரண்டு, 19 is பத்தொன்பது (ten-nine), 20 is இருபது.",
    time: '"At … o\'clock" uses மணிக்கு: ஐந்து மணிக்கு (at five). Spoken Tamil adds -க்கு to time words: இன்னைக்கு (today), நாளைக்கு (tomorrow).',
    days: "Each weekday is a planet + கிழமை (kizhamai, weekday): திங்கள் (Moon) → திங்கட்கிழமை (Monday), சனி (Saturn) → சனிக்கிழமை. In daily speech the English names are very common too.",
    "what-are-you-doing":
      'Plain present (படிக்கிறேன்) means "I study / I am studying". To stress "right now" Tamil adds -கொண்டிருக்கிறேன்: படித்துக்கொண்டிருக்கிறேன் — spoken படிச்சுக்கிட்டு இருக்கேன்.',
    "my-day":
      'For daily habits Tamils often use the future form: நான் ஆறு மணிக்கு எழுந்திருப்பேன் (I (usually) get up at six). Going "to" a place takes -க்கு, and a following ப is doubled: வீட்டுக்குப் போகிறேன்.',
    "asking-directions":
      'Question words sit just before the verb: ரயில் நிலையம் எங்கே இருக்கிறது? (station where is?). Directions usually add பக்கம் (side): இடது பக்கம் (to the left). English "left / right" are widely used in speech.',
    "money-words":
      'Ask prices with இது என்ன விலை? (this what price?) or இது எவ்வளவு? Watch out: வாங்க means "to buy", but spoken வாங்க also means "please come".',
    "at-the-shop":
      "Yes/no questions add -ஆ (-aa) to the last word: இருக்கிறது (there is) → இருக்கிறதா? (is there?). Bargaining is normal at markets; calling the seller அண்ணா or அக்கா keeps it friendly.",
    pronouns:
      'Tamil has casual and respectful forms: நீ / நீங்கள் (you), அவன் / அவள் / அவர் (he / she / respectful he-she). It has two "we": நாம் (you and I) and நாங்கள் (us, not you). "It" is அது — the same as "that"; as an object it becomes அதை.',
    "word-order":
      'Tamil is verb-final (subject–object–verb): நான் சாதம் சாப்பிடுகிறேன் = "I rice eat". The verb ending tells you who: -ஏன் I, -ஆய் you (casual), -ஈர்கள் you (polite), -ஆன் he, -ஆள் she, -ஆர் respectful, -ஓம் we, -ஆர்கள் they.',
    "past-future":
      "Past and future change the middle of the verb: சாப்பிடுகிறேன் (eat) → சாப்பிட்டேன் (ate) → சாப்பிடுவேன் (will eat); போகிறேன் → போனேன் → போவேன். First-person forms are the same for men and women.",
    "questions-negatives":
      'Yes/no questions end in -ஆ: சாப்பிடுவீர்களா? (will/do you eat?). "Not" for verbs is -வில்லை (past/present) or மாட்டேன் (won\'t); for "is not" speech uses இல்லை and writing அல்ல: இது என் புத்தகம் இல்லை / அல்ல.',
    possession:
      "Case endings do the work of English prepositions: -இல் (in/at: வீட்டில்), -க்கு (to: வீட்டுக்கு), -இலிருந்து (from: வீட்டிலிருந்து), -உடன் (with: நண்பனுடன், spoken கூட), and மேல் (on) after the noun. Some nouns change before endings: வீடு → வீட்டு-.",
    "polite-casual":
      "The bare verb root is the casual command (வா! உட்கார்!) — for children and close friends only. Adding -உங்கள் makes it polite (வாருங்கள், உட்காருங்கள்), and in speech that becomes -ங்க (வாங்க, உட்காருங்க), the form you'll hear most.",
    feelings:
      'Feelings are mostly nouns (மகிழ்ச்சி happiness, பயம் fear) used with -ஆக இருக்கிறேன் ("I am …-ly") or with எனக்கு: எனக்குப் பயமாக இருக்கிறது (I am scared). Spoken -ஆக becomes -ஆ: சந்தோஷமா இருக்கேன்.',
    health:
      'Aches use எனக்கு + body part + வலிக்கிறது: எனக்குத் தலை வலிக்கிறது (I have a headache). "I\'m unwell" is எனக்கு உடம்பு சரியில்லை (my body isn\'t right). Medicine is "eaten": மருந்து சாப்பிடுங்கள்.',
    "love-friendship":
      "Tamil keeps romantic love (காதல், kaadhal) separate from affection (பாசம், paasam) and liking (பிடிக்கும்). நான் உன்னைக் காதலிக்கிறேன் is only for a partner and sounds dramatic; with family and friends people show love through care — உடம்பைப் பார்த்துக்கொள்ளுங்கள் (take care of yourself), சாப்பிட்டீர்களா? (have you eaten?) — or phrases like என் குடும்பம் என்றால் உயிர் (my family is my life).",
    weather:
      'Tamil Nadu is hot most of the year, so வெயில் (veyil, sun-heat) and மழை (mazhai, rain) are the weather words you\'ll hear most. "It\'s raining" is literally "rain pours": மழை பெய்கிறது.',
    hobbies:
      "Liking uses the dative + பிடிக்கும்: எனக்கு இசை பிடிக்கும் (to me music is liked). To like doing something, use the infinitive: எனக்குப் படம் பார்க்கப் பிடிக்கும் (I like watching films).",
    plans:
      "-லாம் (-laam) means \"let's / may\": போகலாம் (let's go), பார்க்கலாம் (we'll see / see you). என்னால் … முடியாது (by me … not possible) says \"I can't\": என்னால் வர முடியாது.",
  },
};
