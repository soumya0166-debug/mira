/**
 * Game Translations & Content Engine for MIND AI - NER
 * Complete multilingual content across all 10 North Eastern Languages:
 * 1. en (English)
 * 2. as (Assamese / অসমীয়া)
 * 3. bn (Bengali / বাংলা)
 * 4. brx (Bodo / बड़ो)
 * 5. mni (Meitei / Manipuri / মৈতৈলোন্)
 * 6. kha (Khasi / Ka Ktien Khasi)
 * 7. lus (Mizo / Mizo ṭawng)
 * 8. grt (Garo / A·chik)
 * 9. trp (Kokborok / ককবরক)
 * 10. nag (Nagamese)
 */

export const GAME_METADATA = {
  'memory-match': {
    icon: '🦏',
    en: {
      title: 'Heritage Memory Match',
      subtitle: 'Cultural Visual Memory',
      category: 'Visual Recall',
      badge: 'North Eastern Heritage',
      desc: 'Match pairs of North Eastern cultural treasures: Rhino, Hornbill, Eri Silk, and Loktak Lake.',
      voiceIntro: 'Welcome to Heritage Memory Match. Tap any card to flip and find its matching pair.'
    },
    as: {
      title: 'ঐতিহ্য স্মৃতি মিলন',
      subtitle: 'সাংস্কৃতিক দৃশ্য স্মৃতি',
      category: 'দৃশ্যমান সোঁৱৰণ',
      badge: 'উত্তৰ-পূবৰ ঐতিহ্য',
      desc: 'উত্তৰ-পূবৰ সাংস্কৃতিক সম্পদৰ যোৰ মিলাওক: গঁড়, ধনেশ, এৰী পাট, আৰু লোকটক হ্ৰদ।',
      voiceIntro: 'ঐতিহ্য স্মৃতি মিলনলৈ স্বাগতম। যোৰ মিলাবলৈ যিকোনো কাৰ্ডত টিপক।'
    },
    bn: {
      title: 'ঐতিহ্য স্মৃতি মেলানো',
      subtitle: 'সাংস্কৃতিক চাক্ষুষ স্মৃতি',
      category: 'দৃষ্টি স্মরণ',
      badge: 'উত্তর-পূর্ব ঐতিহ্য',
      desc: 'উত্তর-পূর্বের সাংস্কৃতিক ঐতিহ্যের জোড়া মেলান: গণ্ডার, ধনেশ, এরি রেশম এবং লোকটাক হ্রদ।',
      voiceIntro: 'ঐতিহ্য স্মৃতি মেলানোতে স্বাগতম। কার্ড উল্টাতে স্পর্শ করুন।'
    },
    brx: {
      title: 'गोहो गोसोखां खेला',
      subtitle: 'हारिमु गोसोखां',
      category: 'नोजोर गोसोखां',
      badge: 'सा-सान्जा हारिमु',
      desc: 'सा-सान्जा हादोरसानि गाहाय जिउसाफोरनि जरा मिलाइ: गन्डा, दाउस्रि, एरि सि, आरो लकटक बिलो।',
      voiceIntro: 'गोहो गोसोखां खेलायाव बरायबाय। जरा मिलायनो कार्ड थु।'
    },
    mni: {
      title: 'নাৎকী নীংশিং পুন্না তাবা',
      subtitle: 'নাৎকী শক্তম নীংশিংবা',
      category: 'উবা নীংশিংবা',
      badge: 'নোংপোক থংবা নাৎ',
      desc: 'নোংপোক থংবগী লনশিংগী জোড়া তিন্নবা: শামু য়াইরোইবা, উচেন চাউবা, এরী ফী, লোকতাক পাত।',
      voiceIntro: 'নাৎকী নীংশিং পুন্না তাবা শান্নপোত্তা তরাম্না ওকচরি।'
    },
    kha: {
      title: 'Ka Jingiabiang Jingkynmaw Tynrai',
      subtitle: 'Jingkynmaw Tynrai ba Iohi',
      category: 'Jingkynmaw',
      badge: 'Spah Tynrai Shatei Lam Mihngi',
      desc: 'Pyniabiang ki spah tynrai Shatei Lam Mihngi: Rhino, Hornbill, Jain Eri, bad Nan Loktak.',
      voiceIntro: 'Pdiang sngewbha sha Ka Jingiabiang Jingkynmaw Tynrai.'
    },
    lus: {
      title: 'Hnam Rohlu Hriatrengna Mil',
      subtitle: 'Mitthla Hriatrengna',
      category: 'Hriatrengna',
      badge: 'Chhim Chhak Rohlu',
      desc: 'Chhim Chhak rohlu a kawp zawn mil rawh: Samak, Vapual, Eri Puan, leh Loktak Dil.',
      voiceIntro: 'Hnam Rohlu Hriatrengna Mil ah kan lo lawm a che.'
    },
    grt: {
      title: 'Dakbewal Gisik Ra·ani Meliani',
      subtitle: 'Dakbewal Nikani Gisik Ra·ani',
      category: 'Nikani Gisik',
      badge: 'Salgro Salgipeng Dakbewal',
      desc: 'Salgro Salgipengni gamrangko jora sanna: Gonda, Do·reng, Eri Kaskong, aro Loktak Wari.',
      voiceIntro: 'Dakbewal Gisik Ra·ani Meliona rimnapbeani ong·china.'
    },
    trp: {
      title: 'Hukumu Uansuk Khoplai',
      subtitle: 'Hukumu Nukmung Uansuk',
      category: 'Nukmung Uansuk',
      badge: 'North East Hukumu',
      desc: 'North East ni hukumu jora khoplai: Gonda, Toksa, Eri Puan, tei Loktak Dwi.',
      voiceIntro: 'Hukumu Uansuk Khoplai o kaham kulumkhor.'
    },
    nag: {
      title: 'Heritage Yaad Match Khel',
      subtitle: 'Culture Visual Memory',
      category: 'Visual Yaad',
      badge: 'North East Heritage',
      desc: 'North East laga sundar chij jora milabi: Rhino, Hornbill chora, Eri Silk kapra aru Loktak Pukri.',
      voiceIntro: 'Heritage Yaad Match Khel te apnake swagat ase. Jora milabole card te dababi.'
    }
  },
  'sequence-recall': {
    icon: '🥁',
    en: {
      title: 'Rhythm Sequence Recall',
      subtitle: 'Sensory Auditory Rhythm',
      category: 'Working Memory',
      badge: 'Traditional Percussion',
      desc: 'Repeat peaceful light and drum rhythm patterns from Bihu Dhol, Manipuri Pung, and Garo Dama.',
      voiceIntro: 'Rhythm Sequence Recall. Listen to the drum sequence, then repeat the same rhythm.'
    },
    as: {
      title: 'তাল ক্ৰম সোঁৱৰণ',
      subtitle: 'শ্ৰৱণ ছন্দ স্মৃতি',
      category: 'কাৰ্যকৰী স্মৃতি',
      badge: 'পৰম্পৰাগত বাদ্য',
      desc: 'বিহু ঢোল, মণিপুৰী পুং আৰু গাৰো দামাৰ শান্ত ছন্দৰ অনুকৰণ কৰক।',
      voiceIntro: 'তাল ক্ৰম সোঁৱৰণ। ঢোলৰ ছন্দ শুনক, তাৰ পিছত সেই ক্ৰমতে বজাওক।'
    },
    bn: {
      title: 'ছন্দ ক্রম স্মরণ',
      subtitle: 'শ্রবণ ছন্দ স্মৃতি',
      category: 'কার্যকরী স্মৃতি',
      badge: 'ঐতিহ্যবাহী বাদ্যযন্ত্র',
      desc: 'বিহু ঢোল, মণিপুরী পুং এবং গারো দামার শান্ত ছন্দ অনুসরণ করুন।',
      voiceIntro: 'ছন্দ ক্রম স্মরণ। ঢাকের ছন্দ শুনুন, তারপর একই ক্রমে বাজান।'
    },
    brx: {
      title: 'दामनाय फारि गोसोखां',
      subtitle: 'खोनासंनाय ताल',
      category: 'मावफुं गोसोखां',
      badge: 'गोजाम बाजुवा',
      desc: 'बिहु ढोल, मनिपुरि पुं आरो गारो दामानि तालखौ खोनासंनानै फारियै थु।',
      voiceIntro: 'दामनाय फारि गोसोखां खेलायाव बरायबाय। तालखौ खोनासंनानै थु।'
    },
    mni: {
      title: 'শৈশক খোন্থোক নীংশিংবা',
      subtitle: 'তাবিবা শৈশক নীংশিংবা',
      category: 'থবক নীংশিংবা',
      badge: 'নাৎকী পুং',
      desc: 'বিহু ঢোল, মৈতৈ পুং অমসুং গারো দামাগী শৈশক খোন্থোক ইন্দুনা তাউ।',
      voiceIntro: 'শৈশক খোন্থোক নীংশিংবা। পুংগী খোন্থোক তাউ অমসুং মতুং ইনবা শান্নৌ।'
    },
    kha: {
      title: 'Jingkynmaw Rhythms',
      subtitle: 'Sngap Ksing Tynrai',
      category: 'Jingkynmaw',
      badge: 'Ksing Tynrai',
      desc: 'Bud ia ki sur ksing na Bihu Dhol, Manipuri Pung, bad Garo Dama.',
      voiceIntro: 'Sngap ia ka sur ksing, nangta bud ia kajuh ka rukom.'
    },
    lus: {
      title: 'Khuang Ri Chhawm Hriat',
      subtitle: 'Bengchheng Ri Mawi',
      category: 'Hriatrengna',
      badge: 'Hnam Khuang',
      desc: 'Bihu Dhol, Manipuri Pung, leh Garo Dama khuang rik dan zui rawh.',
      voiceIntro: 'Khuang ri chhawm ngaithla la, a dawt zui rawh.'
    },
    grt: {
      title: 'Dama Ringani Gisik Ra·ani',
      subtitle: 'Knani Ring·ani',
      category: 'Kamni Gisik',
      badge: 'Dakbewal Dama',
      desc: 'Bihu Dhol, Manipuri Pung, aro Garo Damani surko knatimie ja·rikbo.',
      voiceIntro: 'Damani surko knatimbo aro ja·rikbo.'
    },
    trp: {
      title: 'Kham Ruku Uansuk',
      subtitle: 'Khwnamung Kham',
      category: 'Uansuk Samung',
      badge: 'Hukumu Kham',
      desc: 'Bihu Dhol, Manipuri Pung, tei Garo Dama ni kham ringmung ja·rikdi.',
      voiceIntro: 'Kham ringmung khwnadi, aro abohai tikhidi.'
    },
    nag: {
      title: 'Dhol Taal Yaad Khel',
      subtitle: 'Awaaz aru Taal',
      category: 'Active Yaad',
      badge: 'Asli Dhol',
      desc: 'Bihu Dhol, Manipuri Pung aru Garo Dama laga taal sunibi aru milabi.',
      voiceIntro: 'Dhol Taal Yaad Khel. Dhol laga awaaz sunibi aru step by step dababi.'
    }
  },
  'object-recall': {
    icon: '🧺',
    en: {
      title: 'Everyday Object Recall',
      subtitle: 'Keepsake Association',
      category: 'Memory Retention',
      badge: 'Familiar Items',
      desc: 'Observe everyday items from our homesteads, then recall which ones were present.',
      voiceIntro: 'Everyday Object Recall. Look carefully at these homestead items and remember them.'
    },
    as: {
      title: 'ঘৰুৱা সামগ্ৰী সোঁৱৰণ',
      subtitle: 'পৰিচিত স্মৃতি',
      category: 'স্মৃতি ধাৰণ',
      badge: 'চিনাকি বস্তু',
      desc: 'আমাৰ ঘৰৰ পৰিচিত বস্তুবোৰ মন দি চাওক, তাৰ পিছত কোনবোৰ আছিল মনত পেলাওক।',
      voiceIntro: 'ঘৰুৱা সামগ্ৰী সোঁৱৰণ। আমাৰ ঘৰৰ চিনাকি বস্তুবোৰ মনত ৰাখক।'
    },
    bn: {
      title: 'নিত্যদিনের জিনিস স্মরণ',
      subtitle: 'পরিচিত স্মৃতি',
      category: 'স্মৃতি ধারণ',
      badge: 'পরিচিত জিনিসপত্র',
      desc: 'ঘরের পরিচিত জিনিসগুলো মনোযোগ দিয়ে দেখুন, তারপর স্মরণ করুন কোনগুলো ছিল।',
      voiceIntro: 'নিত্যদিনের জিনিস স্মরণ। এই জিনিসগুলো ভালো করে মনে রাখুন।'
    },
    brx: {
      title: 'नखरनि बेसाद गोसोखां',
      subtitle: 'सिनायथि गोसोखां',
      category: 'गोसोआव दोननाय',
      badge: 'सिनाয় जानाय बेसाद',
      desc: 'नखरनि बेसादफोरखौ मोजाङै नाय, बेनि उनाव मा मा दंमोन गोसोखां।',
      voiceIntro: 'नखरनि बेसादफोरखौ मोजाङै नाय आरो गोसोआव दोन।'
    },
    mni: {
      title: 'য়ুমগী পোৎলম নীংশিংবা',
      subtitle: 'খঙনবা পোৎলম',
      category: 'নীংশিং থম্বা',
      badge: 'চান্নবা পোৎলম',
      desc: 'য়ুমগী পোৎলমশিং অসি নীংথিনা য়েংউ, অমসুং করম্বা পোৎলম লৈরমবগে নীংশিংউ।',
      voiceIntro: 'য়ুমগী পোৎলম নীংশিংবা। পোৎলমশিং অসি নীংথিনা য়েংদুনা নীংশিংউ।'
    },
    kha: {
      title: 'Jingkynmaw Ki Tiar Ing',
      subtitle: 'Ki Tiar Ba Ieit',
      category: 'Kynmaw Bniah',
      badge: 'Tiar Ba Mlien',
      desc: 'Peit bniah ia ki tiar na ing, nangta kynmaw kiei kiba don.',
      voiceIntro: 'Peit bniah ia kine ki tiar na ing bad kynmaw ia ki.'
    },
    lus: {
      title: 'In Chhung Bungrua Hriat',
      subtitle: 'Bungrua Hriatrengna',
      category: 'Vawng Țha',
      badge: 'Hriatlar Bungrua',
      desc: 'In chhung bungrua en uluk la, engte nge awm hria rawh.',
      voiceIntro: 'In chhung bungrua uluk takin en la, hrereng rawh.'
    },
    grt: {
      title: 'Nokni Bosturangko Gisik Ra·ani',
      subtitle: 'U·igimin Bostu',
      category: 'Gisiko Danna',
      badge: 'Changronggimin',
      desc: 'Nokni bosturangko nitimbo, aro mai mai donga gisik ra·bo.',
      voiceIntro: 'Nokni bosturangko nitimbo aro gisik ra·bo.'
    },
    trp: {
      title: 'Nokhoni Jinish Uansuk',
      subtitle: 'Siningma Jinish',
      category: 'Uansuk Tongo',
      badge: 'Nokbarsani Jinish',
      desc: 'Nokhoni jinishrog kahamkhe naidi, tei tamo tamo tongmani uansukdi.',
      voiceIntro: 'Nokhoni jinishrog kahamkhe naidi tei uansuk tongdi.'
    },
    nag: {
      title: 'Ghar Laga Saman Yaad Khel',
      subtitle: 'Pahila Laga Saman',
      category: 'Yaad Rakhibole',
      badge: 'Chena Saman',
      desc: 'Ghar laga saman bhal pora sabhi aru kuntu kuntu asile yaad koribi.',
      voiceIntro: 'Ghar laga saman dhyan pora sabhi aru yaad rakhibi.'
    }
  },
  'pattern-recognition': {
    icon: '🧵',
    en: {
      title: 'Tribal Weave Pattern Recognition',
      subtitle: 'Geometric Handloom Weaves',
      category: 'Cognitive Logic',
      badge: 'Textile Geometry',
      desc: 'Complete traditional weave border sequences inspired by Phanek, Puan, and Gamosa patterns.',
      voiceIntro: 'Tribal Weave Pattern Recognition. Look at the weave pattern and select which symbol comes next.'
    },
    as: {
      title: 'জনজাতীয় শালৰ আৰ্হি চিনাক্তকৰণ',
      subtitle: 'হস্ততাঁতৰ জ্যামিতি',
      category: 'যুক্তিনিষ্ঠ চিন্তা',
      badge: 'বয়ন ঐতিহ্য',
      desc: 'গামোচা, ফানেক আৰু পুয়ানৰ পৰম্পৰাগত ফুল আৰু পাৰিৰ ক্ৰম সম্পূৰ্ণ কৰক।',
      voiceIntro: 'জনজাতীয় শালৰ আৰ্হি চিনাক্তকৰণ। পৰৱৰ্তী চিহ্নটো কি হ’ব বাছক।'
    },
    bn: {
      title: 'ঐতিহ্যবাহী তাঁতের নকশা মেলানো',
      subtitle: 'হস্তচালিত তাঁত জ্যামিতি',
      category: 'যুক্তি চিন্তন',
      badge: 'বস্ত্র ঐতিহ্য',
      desc: 'গামোছা, ফানেক এবং পুয়ানের ঐতিহ্যবাহী পাড়ের নকশার ক্রম পূর্ণ করুন।',
      voiceIntro: 'তাঁতের নকশা মেলানো। পরবর্তী প্রতীক কোনটি হবে বেছে নিন।'
    },
    brx: {
      title: 'दखना अरनाइ दानाय फारि',
      subtitle: 'सालोंनि डिजाइन',
      category: 'जिउ सानथौ',
      badge: 'दानाय-लुनाय',
      desc: 'अरनाइ, फानेक आरो पुवाननि दानाय डिजाइननि उनाव मा फैगोन सायख’।',
      voiceIntro: 'दानाय डिजाइनखौ नाय आरो उननि सिनखौ सायख’।'
    },
    mni: {
      title: 'ফী শাবা মরোল শকখঙবা',
      subtitle: 'নাৎকী ফী শাবা',
      category: 'ৱাখলগী তৌবা',
      badge: 'ফী-রোইবী নাৎ',
      desc: 'ফনেক অমসুং গামোচাগী ফী শাবগী মরোল মতুংদা করি লাক্কদগে খনবিউ।',
      voiceIntro: 'ফী শাবা মরোল শকখঙবা। মতুংদা করি চিহ্ন লাক্কদগে খনবিউ।'
    },
    kha: {
      title: 'Jingthoh Jain Tynrai',
      subtitle: 'Jain Tynrai Ba Thain',
      category: 'Bishar Bniah',
      badge: 'Spah Thain Jain',
      desc: 'Pyndep ia ki rukom thain jain tynrai na Gamosa, Phanek, bad Puan.',
      voiceIntro: 'Peit ia ka rukom thain bad jied kiei kiban bud.'
    },
    lus: {
      title: 'Puanchei Ziak Chhui',
      subtitle: 'Tualto Puan Ziak',
      category: 'Rilru Thluak',
      badge: 'Puan Ziak Rohlu',
      desc: 'Puanchei, Phanek leh Gamosa ziak dawt chhui la, a zawm tur thlang rawh.',
      voiceIntro: 'Puan ziak en la, a dawt zui tur thlang rawh.'
    },
    grt: {
      title: 'Bara Dokani Noksarang',
      subtitle: 'Dakbewal Bara',
      category: 'Gisik Chanchiani',
      badge: 'Dokani Gam',
      desc: 'Gamosa, Phanek aro Puanni bara dokani noksarangko matchotbo.',
      voiceIntro: 'Bara dokani noksako nibo aro ja·rikgipako seokbo.'
    },
    trp: {
      title: 'Rignai Rikutu Uansuk',
      subtitle: 'Hukumu Khorok',
      category: 'Uansuk Kwtal',
      badge: 'Rignai Daumung',
      desc: 'Gamosa, Phanek tei Puanni rignai dagmung naidi tei uloni chin tikhidi.',
      voiceIntro: 'Rignai dagmung naidi aro uloni chin seokdi.'
    },
    nag: {
      title: 'Kapra Weave Design Khel',
      subtitle: 'Handloom Design',
      category: 'Dimak Logic',
      badge: 'Handloom Kapra',
      desc: 'Gamosa, Phanek aru Puan laga border design dekhi kena agete ki ahibo chunibi.',
      voiceIntro: 'Weave design dhyan pora sabhi aru agete ki ahibo chunibi.'
    }
  },
  'attention-challenge': {
    icon: '🌸',
    en: {
      title: 'Nature Attention Challenge',
      subtitle: 'Gentle Visual Focus',
      category: 'Visual Attention',
      badge: 'Forest Harmony',
      desc: 'Find the unique bird or wild orchid in a tranquil, timer-free natural setting.',
      voiceIntro: 'Nature Attention Challenge. Find the single unique symbol among the others.'
    },
    as: {
      title: 'প্ৰকৃতি মনোযোগ প্ৰত্যাহ্বান',
      subtitle: 'শান্ত দৃষ্টি সংযোগ',
      category: 'দৃষ্টি মনোযোগ',
      badge: 'বননিৰ ঐক্য',
      desc: 'শান্ত প্ৰাকৃতিক পৰিৱেশত অদ্বিতীয় পক্ষী বা বনফুলটো বিচাৰি উলিয়াওক।',
      voiceIntro: 'প্ৰকৃতি মনোযোগ প্ৰত্যাহ্বান। সকলোৰে মাজত বেলেগ থকা চিহ্নটো বিচাৰক।'
    },
    bn: {
      title: 'প্রকৃতি মনোযোগ খেলা',
      subtitle: 'শান্ত দৃষ্টি সংযোগ',
      category: 'দৃষ্টি মনোযোগ',
      badge: 'অরণ্যের শান্তি',
      desc: 'প্রাকৃতিক পরিবেশে একক অনন্য পাখি বা অর্কিডটি খুঁজে বের করুন।',
      voiceIntro: 'প্রকৃতি মনোযোগ খেলা। বাকিদের মধ্যে অনন্য প্রতীকটি স্পর্শ করুন।'
    },
    brx: {
      title: 'मिथिंगा नोजोर गोसो होनाय',
      subtitle: 'गोजोन नोजोर',
      category: 'नोजोर गोसो होनाय',
      badge: 'हाग्रामा गोजোন',
      desc: 'मिथिंगायाव दंफां-बिरदौनि गेजेराव गुबुन सिनखौ नागिरना दिहुন।',
      voiceIntro: 'मिथिंगा नोजोर खेला। गुबुनसिन सिनखौ थु।'
    },
    mni: {
      title: 'মহৌশাগী পুকনিং চীংশিনবা',
      subtitle: 'অচুম্বা য়েংবা',
      category: 'মিৎয়েং চংবা',
      badge: 'উমংগী শান্তিবু',
      desc: 'মহৌশাগী শান্তিগী মরক্তা অতোপ্পগা মান্নদবা উচেক নত্রগা লৈরাং খঙদোকউ।',
      voiceIntro: 'মহৌশাগী পুকনিং চীংশিনবা। মান্নদবা চিহ্ন অদু থীদোকউ।'
    },
    kha: {
      title: 'Jingpynleit Jingmut Mariang',
      subtitle: 'Peit Bniah Mariang',
      category: 'Pynleit Jingmut',
      badge: 'Khlaw Mariang',
      desc: 'Shem ia u sim ne u syntiew ba kyrpang hapdeng kiwei.',
      voiceIntro: 'Shem ia uba kyrpang hapdeng kine kiwei.'
    },
    lus: {
      title: 'Siamtu Chhehvel Mit Vawng',
      subtitle: 'Mit Fim Takin En',
      category: 'Mit Fim',
      badge: 'Ramngaw Dai',
      desc: 'Sava emaw pangpar danglam bik tak zawn chhuak rawh.',
      voiceIntro: 'A danglam bik tak zawn chhuak rawh.'
    },
    grt: {
      title: 'Biringni Gisik On·ani',
      subtitle: 'Gisik On·e Niani',
      category: 'Mikron Niani',
      badge: 'Buringni Tomtoman',
      desc: 'Buringo dingtangmancha do·o ba bibalko sandibo.',
      voiceIntro: 'Dingtanggipa chinrangko sandibo.'
    },
    trp: {
      title: 'Hachuk Uansuk Naichung',
      subtitle: 'Kaham Nukmung',
      category: 'Naichung Samung',
      badge: 'Hachuk Tongthok',
      desc: 'Hachuk bisingo dingtang toksa ba khumpuiri seokdi.',
      voiceIntro: 'Bisingni dingtanggipa chinko seokdi.'
    },
    nag: {
      title: 'Prakriti Dhyan Khel',
      subtitle: 'Shanti Dhyan',
      category: 'Dhyan Focus',
      badge: 'Jungle Shanti',
      desc: 'Shanti jungle majot te alag chora ba phool ke bisari lobi.',
      voiceIntro: 'Prakriti Dhyan Khel. Sob majot te kun alag ase heitu chunibi.'
    }
  },
  'daily-recall': {
    icon: '☀️',
    en: {
      title: 'Daily Life Recall',
      subtitle: 'Temporal Orientation',
      category: 'Routine Orientation',
      badge: 'Daily Rhythms',
      desc: 'Gentle orientation reflections regarding morning Assam tea, seasons, and loved ones.',
      voiceIntro: 'Daily Life Recall. Listen to the question and pick the most comforting answer.'
    },
    as: {
      title: 'দৈনন্দিন জীৱন সোঁৱৰণ',
      subtitle: 'সময় আৰু দিশ নিৰ্ণয়',
      category: 'দৈনিক স্মৃতি',
      badge: 'দৈনন্দিন ছন্দ',
      desc: 'ৰাতিপুৱাৰ চাহ, ঋতু আৰু পৰিয়ালৰ বিষয়ে শান্ত সোঁৱৰণ।',
      voiceIntro: 'দৈনন্দিন জীৱন সোঁৱৰণ। প্ৰশ্নটো শুনক আৰু সঠিক উত্তৰটো বাছক।'
    },
    bn: {
      title: 'দৈনন্দিন জীবন স্মরণ',
      subtitle: 'সময় ও দিক স্মৃতি',
      category: 'দৈনন্দিন স্মৃতি',
      badge: 'দৈনিক ছন্দ',
      desc: 'সকালের চা, ঋতু এবং প্রিয়জন সম্পর্কিত সহজ ও শান্ত স্মৃতিচারণ।',
      voiceIntro: 'দৈনন্দিন জীবন স্মরণ। প্রশ্নটি শুনুন এবং সঠিক উত্তরটি স্পর্শ করুন।'
    },
    brx: {
      title: 'सानफ्रोमबोनि जिउ गोसोखां',
      subtitle: 'सम आरो जायगा',
      category: 'सानफ्रोमबोनि गोसोखां',
      badge: 'जिउनि फारि',
      desc: 'फुंनि साहा, बोथोर आरो नखरनि मानसिफोरनि सायाव गोसोखां।',
      voiceIntro: 'सानफ्रोमबोनि जिउ गोसोखां। सोंनायखौ खोनासंनानै गेबें फिननायखौ थु।'
    },
    mni: {
      title: 'নোংমগী পুন্সি নীংশিংবা',
      subtitle: 'মতমনীং অমসুং লম নীংশিংবা',
      category: 'নোংমগী থৌরম',
      badge: 'পুন্সিগী খোঙচৎ',
      desc: 'অয়ুক্কী চা, ঋতু অমসুং নুংশিজরবা মীওইশিংগী মতাংদা নিংথিনা নীংশিংবা।',
      voiceIntro: 'নোংমগী পুন্সি নীংশিংবা। ৱাহং অসি তাউ অমসুং অচুম্বা পাউখুম খনবিউ।'
    },
    kha: {
      title: 'Jingkynmaw Ka Jingim Man Ka Sngi',
      subtitle: 'Kynmaw Por bad Sngi',
      category: 'Jingim Man Ka Sngi',
      badge: 'Rukom Im Man Ka Sngi',
      desc: 'Kynmaw shaphang ka sha step, ki samoi, bad kiba ieit.',
      voiceIntro: 'Sngap ia ka jingkylli bad jied ia ka jubab ba dei.'
    },
    lus: {
      title: 'Nit Tin Nunphung Hriat',
      subtitle: 'Hun leh Ni Hriat',
      category: 'Nit Tin Nun',
      badge: 'Nunphung Ziak',
      desc: 'Zing thingpui, hunbi thlakthleng, leh chhungte hriatrengna.',
      voiceIntro: 'Jingkylli ngaithla la, chhanna dik thlang rawh.'
    },
    grt: {
      title: 'Salantini Janggi Tangani Gisik Ra·ani',
      subtitle: 'Somoy aro Bilsiko U·iani',
      category: 'Salantini Gisik',
      badge: 'Janggi Tangani',
      desc: 'Pringni cha, bilsini kari, aro ma·drangrangko gisik ra·ani.',
      voiceIntro: 'Sing·aniko knatimbo aro kakketgipa aganchakaniko seokbo.'
    },
    trp: {
      title: 'Salbrum Tangmung Uansuk',
      subtitle: 'Sal tei Jora Uansuk',
      category: 'Salbrum Uansuk',
      badge: 'Salbrum Samung',
      desc: 'Phungni cha, bisi tei logirogni bwsao uansukmung.',
      voiceIntro: 'Swngmung khwnadi tei kaham phunmung seokdi.'
    },
    nag: {
      title: 'Roz Laga Zindagi Yaad Khel',
      subtitle: 'Time aru Din Yaad',
      category: 'Roz Laga Routine',
      badge: 'Daily Rhythms',
      desc: 'Bihana laga cha, mausam aru parivar laga kotha bhal pora yaad koribi.',
      voiceIntro: 'Roz Laga Zindagi Yaad Khel. Sawal sunibi aru sahi jawab chunibi.'
    }
  },
  'picture-recognition': {
    icon: '🏔️',
    en: {
      title: 'Heritage Picture Recognition',
      subtitle: '8 States Sanctuaries',
      category: 'Spatial Knowledge',
      badge: '8 Sister States',
      desc: 'Identify celebrated landmarks: Kaziranga, Majuli, Living Root Bridges, and Ujjayanta Palace.',
      voiceIntro: 'Heritage Picture Recognition. Listen to the landmark clue and identify the place.'
    },
    as: {
      title: 'ঐতিহ্য ছবি চিনাক্তকৰণ',
      subtitle: '৮ খন ৰাজ্যৰ তীৰ্থস্থান',
      category: 'স্থানজ্ঞান স্মৃতি',
      badge: '৮ ভনী ৰাজ্য',
      desc: 'প্ৰখ্যাত স্থানসমূহ চিনি পাওক: কাজিৰঙা, মাজুলী, জীৱন্ত শিপাৰ দলং, আৰু উজ্জয়ন্ত প্ৰাসাদ।',
      voiceIntro: 'ঐতিহ্য ছবি চিনাক্তকৰণ। স্থানৰ ইংগিত শুনক আৰু ঠাইখন বাছক।'
    },
    bn: {
      title: 'ঐতিহ্য ছবি পরিচিতি',
      subtitle: '৮টি রাজ্যের মনোরম স্থান',
      category: 'স্থানজ্ঞান স্মৃতি',
      badge: '৮টি ভগিনী রাজ্য',
      desc: 'বিখ্যাত স্থানগুলো শনাক্ত করুন: কাজিরাঙা, মাজুলী, জীবন্ত গাছের শিকড়ের সেতু এবং উজ্জয়ন্ত প্রাসাদ।',
      voiceIntro: 'ঐতিহ্য ছবি পরিচিতি। সূত্রটি শুনুন এবং সঠিক স্থানটি বেছে নিন।'
    },
    brx: {
      title: 'सा-सान्जा मुंदांखा जायगा सिनायथि',
      subtitle: '८ हादोरसानि जायगा',
      category: 'जायगानि गियान',
      badge: '८ बिनानाव हादोरसा',
      desc: 'मुंदांखा जायगाफोरखौ सिनाय: काजिरंगा, माजुलि, जिउ गोनां रोदा दालाइ, आरो उज्जयन्त महल।',
      voiceIntro: 'जायगानि सिनायथि। खोनासंनानै जायगाखौ सायख’।'
    },
    mni: {
      title: 'নাৎকী শক্তম শকখঙবা',
      subtitle: 'রাজ্য ৮ গী মমিং চৎলবা মফম',
      category: 'মফমগী খঙবা',
      badge: 'ইচিন-ইনাও রাজ্য ৮',
      desc: 'মমিং চৎলবা মফমশিং খঙদোকউ: কাজিরঙ্গা, মাজুলী, উরি পাম্বীগী থোং, উজ্জয়ন্ত কোনুং।',
      voiceIntro: 'নাৎকী শক্তম শকখঙবা। মফমগী ৱাফম তাউ অমসুং মফম অদু খনবিউ।'
    },
    kha: {
      title: 'Jingshai Dur Tynrai',
      subtitle: '8 Tylli Ki Jylla',
      category: 'Tip Shaphang Ki Jaka',
      badge: '8 Tylli Ki Para Jylla',
      desc: 'Ithuh ia ki jaka ba pawnam: Kaziranga, Majuli, Jingkieng Tynrai, bad Ujjayanta Palace.',
      voiceIntro: 'Sngap ia ka jingbatai bad jied ia ka jaka ba dei.'
    },
    lus: {
      title: 'Hmun Pawimawh Thlalak Hriat',
      subtitle: 'State 8 Hmun Mawi',
      category: 'Hmun Hriatna',
      badge: 'Fanu Unau 8',
      desc: 'Hmun lar tak takte hria rawh: Kaziranga, Majuli, Thing Zung Lei, leh Ujjayanta Inpui.',
      voiceIntro: 'Hmun chanchin ngaithla la, a hming thlang rawh.'
    },
    grt: {
      title: 'Dakbewal Noksa U·iani',
      subtitle: 'State 8-ni Songjinmarang',
      category: 'Biapko U·iani',
      badge: 'Abi-Ino State 8',
      desc: 'Mingsinggipa biaprangko u·ibo: Kaziranga, Majuli, Ja·dil Jalang, aro Ujjayanta Palace.',
      voiceIntro: 'Biapni gimin knatimbo aro kakketgipako seokbo.'
    },
    trp: {
      title: 'Hukumu Noksa Sinimung',
      subtitle: 'Haste 8 ni Hasting',
      category: 'Haste Uansuk',
      badge: 'Phaiba Haste 8',
      desc: 'Chumukrok bihik sinidi: Kaziranga, Majuli, Kormo Dhol, tei Ujjayanta Palace.',
      voiceIntro: 'Hastingni kok khwnadi aro kaham hachuk seokdi.'
    },
    nag: {
      title: 'Sundar Jagah Photo Khel',
      subtitle: '8 State Laga Jagah',
      category: 'Jagah Laga Gyan',
      badge: '8 Sister States',
      desc: 'Namkora jagah sabhi: Kaziranga, Majuli, Living Root Bridge aru Ujjayanta Palace.',
      voiceIntro: 'Jagah laga clue sunibi aru sahi jagah chunibi.'
    }
  },
  'language-recall': {
    icon: '🗣️',
    en: {
      title: 'Regional Language Recall',
      subtitle: 'Mother Tongue Connection',
      category: 'Linguistic Recall',
      badge: '10 Regional Tongues',
      desc: 'Connect heartwarming greetings and expressions across Assamese, Meitei, Khasi, Mizo, and Bengali.',
      voiceIntro: 'Regional Language Recall. Hear the loving regional greeting and identify what it means.'
    },
    as: {
      title: 'আঞ্চলিক ভাষা সোঁৱৰণ',
      subtitle: 'মাতৃভাষা সংযোগ',
      category: 'ভাষিক স্মৃতি',
      badge: '১০ আঞ্চলিক ভাষা',
      desc: 'অসমীয়া, মৈতৈ, খাচী, মিজো আৰু বাংলাৰ মৰমৰ সম্ভাষণ আৰু মাত-কথা চিনাকি কৰক।',
      voiceIntro: 'আঞ্চলিক ভাষা সোঁৱৰণ। মৰমৰ সম্ভাষণটো শুনক আৰু ইয়াৰ অৰ্থ বাছক।'
    },
    bn: {
      title: 'আঞ্চলিক ভাষা স্মরণ',
      subtitle: 'মাতৃভাষা মেলবন্ধন',
      category: 'ভাষাগত স্মৃতি',
      badge: '১০টি আঞ্চলিক ভাষা',
      desc: 'অসমীয়া, মৈতৈ, খাসি, মিজো এবং বাংলার ভালোবাসার সম্ভাষণগুলো স্মরণ করুন।',
      voiceIntro: 'আঞ্চলিক ভাষা স্মরণ। মিষ্টি সম্ভাষণটি শুনুন এবং এর অর্থ বেছে নিন।'
    },
    brx: {
      title: 'गाहाइ राव गोसोखां खेला',
      subtitle: 'आईयार राव फोनांजाब',
      category: 'रावनि गोसोखां',
      badge: '१० हादोरसानी राव',
      desc: 'असमिया, मैतै, खासि, मिजो आरो बांलानि गोजोन खुलुमनायखौ सिनाय।',
      voiceIntro: 'आईयार राव खेला। खुलुमनायखौ खोनासंनानै बेनि ओंथिखौ सायख’।'
    },
    mni: {
      title: 'লোন অমসুং পৌরোং তিন্নবা',
      subtitle: 'ইমা লোনগী মরী',
      category: 'লোনগী নীংশিংবা',
      badge: 'লোন ১০',
      desc: 'অসমীয়া, মৈতৈলোন, খাসী, মিজো অমসুং বাংলাগী নুংশিরবা খুরুমজরি শকখঙউ।',
      voiceIntro: 'লোন অমসুং পৌরোং তিন্নবা। খুরুমজবগী ৱাফম অসি তাউ অমসুং মশীংগী অর্থ খনবিউ।'
    },
    kha: {
      title: 'Pyniahap Ktien Tynrai',
      subtitle: 'Ktien Kpa bad Kmie',
      category: 'Ktien Jingkynmaw',
      badge: '10 Tylli Ki Ktien',
      desc: 'Ithuh ia ki ktien khublei na ka Assamese, Meitei, Khasi, Mizo, bad Bengali.',
      voiceIntro: 'Sngap ia ka ktien khublei bad jied kaei ka mut.'
    },
    lus: {
      title: 'Ṭawng Zungzam Mil Tirna',
      subtitle: 'Hnam Ṭawng Zawmna',
      category: 'Ṭawng Hriatna',
      badge: 'Ṭawng Chi 10',
      desc: 'Assamese, Meitei, Khasi, Mizo, leh Bengali chibai inbukna awmze mil rawh.',
      voiceIntro: 'Chibai inbukna ngaithla la, a awmzia thlang rawh.'
    },
    grt: {
      title: 'Ku·sik Sochari Meliani',
      subtitle: 'Ma·gipa Ku·sik',
      category: 'Ku·sikni Gisik',
      badge: 'Ku·sik Ge 10',
      desc: 'Assamese, Meitei, Khasi, Mizo, aro Bengalini salam ka·ani ku·sikrangko u·ibo.',
      voiceIntro: 'Salam ka·aniko knatimbo aro a·selko seokbo.'
    },
    trp: {
      title: 'Kokborok Kok Khoplai',
      subtitle: 'Ama Kok Khoblaimung',
      category: 'Kokni Uansuk',
      badge: 'Kok Kwchar 10',
      desc: 'Assamese, Meitei, Khasi, Mizo, tei Bengalini kulummung kok sinidi.',
      voiceIntro: 'Kulummung kok khwnadi tei bini kokma seokdi.'
    },
    nag: {
      title: 'North East Kotha Milani',
      subtitle: 'Nijor Bhasha Prem',
      category: 'Bhasha Yaad',
      badge: '10 Ta Bhasha',
      desc: 'Assamese, Meitei, Khasi, Mizo aru Bengali laga pyar bhara namaskar milabi.',
      voiceIntro: 'Pyar bhara namaskar sunibi aru etu laga matlab chunibi.'
    }
  }
};

/**
 * Detailed Cards and Data for All 8 Games
 */

// 1. Heritage Memory Match Cards
export const MEMORY_MATCH_CARDS = {
  en: [
    { id: 'rhino', label: 'One-Horned Rhino', subtitle: 'Kaziranga, Assam', icon: '🦏' },
    { id: 'hornbill', label: 'Great Hornbill', subtitle: 'State Bird, Nagaland', icon: '🪶' },
    { id: 'silk', label: 'Golden Muga & Eri Silk', subtitle: 'Assamese Weave', icon: '🧵' },
    { id: 'flute', label: 'Bamboo Flute & Craft', subtitle: 'Tripura & Meghalaya', icon: '🎋' },
    { id: 'phumdi', label: 'Floating Phumdi', subtitle: 'Loktak Lake, Manipur', icon: '🌺' },
    { id: 'dhol', label: 'Bihu Dhol & Pepa', subtitle: 'Harvest Rhythm, Assam', icon: '🥁' },
    { id: 'tea', label: 'Fresh Assam Tea Leaf', subtitle: 'Tea Gardens of Brahmaputra', icon: '🍃' },
    { id: 'orchid', label: 'Blue Vanda Orchid', subtitle: 'Wild Bloom of Arunachal', icon: '🌸' }
  ],
  as: [
    { id: 'rhino', label: 'এশিঙীয়া গঁড়', subtitle: 'কাজিৰঙা, অসম', icon: '🦏' },
    { id: 'hornbill', label: 'ধনেশ পক্ষী', subtitle: 'নাগালেণ্ডৰ ৰাজ্যিক চৰাই', icon: '🪶' },
    { id: 'silk', label: 'সোণালী মুগা আৰু এৰী পাট', subtitle: 'অসমীয়া শিপিনীৰ কাপোৰ', icon: '🧵' },
    { id: 'flute', label: 'বাঁহৰ বাঁহী আৰু কাৰুশিল্প', subtitle: 'ত্ৰিপুৰা আৰু মেঘালয়', icon: '🎋' },
    { id: 'phumdi', label: 'ভাসমান ফুমদী', subtitle: 'লোকটক হ্ৰদ, মণিপুৰ', icon: '🌺' },
    { id: 'dhol', label: 'বিহু ঢোল আৰু পেঁপা', subtitle: 'ৰঙালী ছন্দ, অসম', icon: '🥁' },
    { id: 'tea', label: 'দুটি পাত এটি কুঁহিপাত', subtitle: 'ব্ৰহ্মপুত্ৰ উপত্যকাৰ চাহ', icon: '🍃' },
    { id: 'orchid', label: 'ভাটৌ ফুল / কপৌ ফুল', subtitle: 'অৰুণাচলৰ বনৰীয়া ফুল', icon: '🌸' }
  ],
  bn: [
    { id: 'rhino', label: 'একশৃঙ্গ গণ্ডার', subtitle: 'কাজিরাঙা, আসাম', icon: '🦏' },
    { id: 'hornbill', label: 'ধনেশ পাখি', subtitle: 'নাগাল্যান্ডের রাজ্য পাখি', icon: '🪶' },
    { id: 'silk', label: 'সোনালী মুগা ও এরি সিল্ক', subtitle: 'ঐতিহ্যবাহী বস্ত্রশিল্প', icon: '🧵' },
    { id: 'flute', label: 'বাঁশের বাঁশি ও হস্তশিল্প', subtitle: 'ত্রিপুরা ও মেঘালয়', icon: '🎋' },
    { id: 'phumdi', label: 'ভাসমান ফুমদি', subtitle: 'লোকটাক হ্রদ, মণিপুর', icon: '🌺' },
    { id: 'dhol', label: 'বিহু ঢোল ও পেপা', subtitle: 'উৎসবের ছন্দ, আসাম', icon: '🥁' },
    { id: 'tea', label: 'তাজা আসাম চা পাতা', subtitle: 'ব্রহ্মপুত্র উপত্যকার চা বাগান', icon: '🍃' },
    { id: 'orchid', label: 'বন্য অর্কিড ফুল', subtitle: 'অরুণাচলের সুন্দর পুষ্প', icon: '🌸' }
  ],
  brx: {
    // fallback with Bodo terms
    fallbackCode: 'as'
  },
  mni: [
    { id: 'rhino', label: 'শামু য়াইরোইবা (গণ্ডার)', subtitle: 'কাজিরঙ্গা, আসাম', icon: '🦏' },
    { id: 'hornbill', label: 'উচেন চাউবা', subtitle: 'নাগাল্যান্ডগী উচেক', icon: '🪶' },
    { id: 'silk', label: 'মৈরাং ফী অমসুং এরী', subtitle: 'মণিপুরী অমসুং অসমগী ফী', icon: '🧵' },
    { id: 'flute', label: 'ৱাগী য়োৎ অমসুং শুরন্দা', subtitle: 'ত্রিপুরা অমসুং মেঘালয়', icon: '🎋' },
    { id: 'phumdi', label: 'লোকতাক্কী ফুমদী', subtitle: 'মৈরাং, মণিপুর', icon: '🌺' },
    { id: 'dhol', label: 'মৈতৈ পুং অমসুং ঢোল', subtitle: 'হরাওবা খোন্থোক', icon: '🥁' },
    { id: 'tea', label: 'অসামগী চা মনা', subtitle: 'ব্রহ্মপুত্র খোঙবাল', icon: '🍃' },
    { id: 'orchid', label: 'উমংগী লৈরাং', subtitle: 'অরুণাচলগী লৈ', icon: '🌸' }
  ],
  kha: [
    { id: 'rhino', label: 'U Rhino Sharyngiew', subtitle: 'Kaziranga, Assam', icon: '🦏' },
    { id: 'hornbill', label: 'U Sim Kohhai', subtitle: 'Sim Nagaland', icon: '🪶' },
    { id: 'silk', label: 'Jain Ryndia & Eri', subtitle: 'Jain Tynrai Shatei Lam Mihngi', icon: '🧵' },
    { id: 'flute', label: 'Ka Besli Siej', subtitle: 'Tripura & Meghalaya', icon: '🎋' },
    { id: 'phumdi', label: 'Phumdi ba Per', subtitle: 'Nan Loktak, Manipur', icon: '🌺' },
    { id: 'dhol', label: 'Ka Ksing Bihu', subtitle: 'Sur Ksing Assam', icon: '🥁' },
    { id: 'tea', label: 'Sla Sha Assam', subtitle: 'Bari Sha Brahmaputra', icon: '🍃' },
    { id: 'orchid', label: 'U Tiew Khlaw Vanda', subtitle: 'Syntiew Arunachal', icon: '🌸' }
  ],
  lus: [
    { id: 'rhino', label: 'Ki Neih Samak', subtitle: 'Kaziranga, Assam', icon: '🦏' },
    { id: 'hornbill', label: 'Vapual Mawi', subtitle: 'Nagaland Sava', icon: '🪶' },
    { id: 'silk', label: 'Eri leh Muga Puan', subtitle: 'Hnam Puan Ziak', icon: '🧵' },
    { id: 'flute', label: 'Mau Rawchham', subtitle: 'Tripura leh Meghalaya', icon: '🎋' },
    { id: 'phumdi', label: 'Phumdi Dil Lang', subtitle: 'Loktak Dil, Manipur', icon: '🌺' },
    { id: 'dhol', label: 'Bihu Khuang', subtitle: 'Assam Rimawi', icon: '🥁' },
    { id: 'tea', label: 'Assam Thingpui Hnah', subtitle: 'Brahmaputra Hmun Mawi', icon: '🍃' },
    { id: 'orchid', label: 'Ramngaw Pangpar', subtitle: 'Arunachal Par Mawi', icon: '🌸' }
  ],
  grt: [
    { id: 'rhino', label: 'Grong Gonsanigipa Gonda', subtitle: 'Kaziranga, Assam', icon: '🦏' },
    { id: 'hornbill', label: 'Do·reng', subtitle: 'Nagaland Do·o', icon: '🪶' },
    { id: 'silk', label: 'Eri Kaskong Bara', subtitle: 'Dakbewal Bara', icon: '🧵' },
    { id: 'flute', label: 'Wa·a Bangsi', subtitle: 'Tripura aro Meghalaya', icon: '🎋' },
    { id: 'phumdi', label: 'Balbogipa Phumdi', subtitle: 'Loktak Wari, Manipur', icon: '🌺' },
    { id: 'dhol', label: 'Bihu Dhol', subtitle: 'Assam Dama', icon: '🥁' },
    { id: 'tea', label: 'Cha Bijak', subtitle: 'Brahmaputra A·ba', icon: '🍃' },
    { id: 'orchid', label: 'Buringni Bibal', subtitle: 'Arunachal Bibal', icon: '🌸' }
  ],
  trp: [
    { id: 'rhino', label: 'Khoroksa Gonda', subtitle: 'Kaziranga, Assam', icon: '🦏' },
    { id: 'hornbill', label: 'Toksa Hornbill', subtitle: 'Nagaland Toksa', icon: '🪶' },
    { id: 'silk', label: 'Eri tei Muga Rignai', subtitle: 'North East Daumung', icon: '🧵' },
    { id: 'flute', label: 'Wathop Sumui', subtitle: 'Tripura tei Meghalaya', icon: '🎋' },
    { id: 'phumdi', label: 'Loktak Phumdi', subtitle: 'Loktak Dwi, Manipur', icon: '🌺' },
    { id: 'dhol', label: 'Bihu Kham', subtitle: 'Assam Kham Ruku', icon: '🥁' },
    { id: 'tea', label: 'Assam Cha Bwlai', subtitle: 'Brahmaputra Bagan', icon: '🍃' },
    { id: 'orchid', label: 'Hachuk Khumpuiri', subtitle: 'Arunachal Khum', icon: '🌸' }
  ],
  nag: [
    { id: 'rhino', label: 'Ek-Seeng Laga Rhino', subtitle: 'Kaziranga, Assam', icon: '🦏' },
    { id: 'hornbill', label: 'Sundar Hornbill Chora', subtitle: 'Nagaland State Bird', icon: '🪶' },
    { id: 'silk', label: 'Golden Muga & Eri Silk', subtitle: 'Handloom Kapra', icon: '🧵' },
    { id: 'flute', label: 'Bansuri aru Craft', subtitle: 'Tripura & Meghalaya', icon: '🎋' },
    { id: 'phumdi', label: 'Floating Phumdi', subtitle: 'Loktak Lake, Manipur', icon: '🌺' },
    { id: 'dhol', label: 'Bihu Dhol aru Pepa', subtitle: 'Bihu Dhun, Assam', icon: '🥁' },
    { id: 'tea', label: 'Assam Cha Pata', subtitle: 'Brahmaputra Garden', icon: '🍃' },
    { id: 'orchid', label: 'Jungle Orchid Phool', subtitle: 'Arunachal Wild Flower', icon: '🌸' }
  ]
};

// 2. Rhythm Sequence Recall Drums
export const DRUMS_DATA = {
  en: [
    { id: 0, name: 'Bihu Dhol', region: 'Assam', color: '#c2410c', glow: '#fdba74', icon: '🥁', soundFreq: 260 },
    { id: 1, name: 'Manipuri Pung', region: 'Manipur', color: '#047857', glow: '#86efac', icon: '🪘', soundFreq: 330 },
    { id: 2, name: 'Garo Dama', region: 'Meghalaya', color: '#1d4ed8', glow: '#93c5fd', icon: '🪕', soundFreq: 392 },
    { id: 3, name: 'Mizo Khuang', region: 'Mizoram', color: '#7e22ce', glow: '#d8b4fe', icon: '🔔', soundFreq: 523 }
  ],
  as: [
    { id: 0, name: 'বিহু ঢোল', region: 'অসম', color: '#c2410c', glow: '#fdba74', icon: '🥁', soundFreq: 260 },
    { id: 1, name: 'মণিপুৰী পুং', region: 'মণিপুৰ', color: '#047857', glow: '#86efac', icon: '🪘', soundFreq: 330 },
    { id: 2, name: 'গাৰো দামা', region: 'মেঘালয়', color: '#1d4ed8', glow: '#93c5fd', icon: '🪕', soundFreq: 392 },
    { id: 3, name: 'মিজো খুৱাং', region: 'মিজোৰাম', color: '#7e22ce', glow: '#d8b4fe', icon: '🔔', soundFreq: 523 }
  ],
  bn: [
    { id: 0, name: 'বিহু ঢোল', region: 'আসাম', color: '#c2410c', glow: '#fdba74', icon: '🥁', soundFreq: 260 },
    { id: 1, name: 'মণিপুরী পুং', region: 'মণিপুর', color: '#047857', glow: '#86efac', icon: '🪘', soundFreq: 330 },
    { id: 2, name: 'গারো দামা', region: 'মেঘালয়', color: '#1d4ed8', glow: '#93c5fd', icon: '🪕', soundFreq: 392 },
    { id: 3, name: 'মিজো খুয়াং', region: 'মিজোরাম', color: '#7e22ce', glow: '#d8b4fe', icon: '🔔', soundFreq: 523 }
  ],
  mni: [
    { id: 0, name: 'বিহু ঢোল', region: 'অসাম', color: '#c2410c', glow: '#fdba74', icon: '🥁', soundFreq: 260 },
    { id: 1, name: 'মৈতৈ পুং', region: 'মণিপুর', color: '#047857', glow: '#86efac', icon: '🪘', soundFreq: 330 },
    { id: 2, name: 'গারো দামা', region: 'মেঘালয়', color: '#1d4ed8', glow: '#93c5fd', icon: '🪕', soundFreq: 392 },
    { id: 3, name: 'মিজো খুয়াং', region: 'মিজোরাম', color: '#7e22ce', glow: '#d8b4fe', icon: '🔔', soundFreq: 523 }
  ],
  nag: [
    { id: 0, name: 'Bihu Dhol', region: 'Assam', color: '#c2410c', glow: '#fdba74', icon: '🥁', soundFreq: 260 },
    { id: 1, name: 'Manipuri Pung', region: 'Manipur', color: '#047857', glow: '#86efac', icon: '🪘', soundFreq: 330 },
    { id: 2, name: 'Garo Dama', region: 'Meghalaya', color: '#1d4ed8', glow: '#93c5fd', icon: '🪕', soundFreq: 392 },
    { id: 3, name: 'Mizo Khuang', region: 'Mizoram', color: '#7e22ce', glow: '#d8b4fe', icon: '🔔', soundFreq: 523 }
  ]
};

// 3. Everyday Object Recall Items
export const OBJECT_RECALL_ITEMS = {
  en: [
    { id: 'japi', name: 'Bamboo Japi Hat', category: 'Traditional Sunhat', icon: '👒' },
    { id: 'gamusa', name: 'Red & White Gamusa', category: 'Handwoven Scarf', icon: '🧣' },
    { id: 'chai_kettle', name: 'Brass Tea Kettle', category: 'Assam Tea Ritual', icon: '🫖' },
    { id: 'flute', name: 'Handcrafted Flute', category: 'Folk Music', icon: '🎋' },
    { id: 'clay_lamp', name: 'Clay Diya / Lamp', category: 'Evening Prayer', icon: '🪔' },
    { id: 'basket', name: 'Cane Tea Basket', category: 'Harvest', icon: '🧺' },
    { id: 'brass_glass', name: 'Brass Water Tumbler', category: 'Dining Keepsake', icon: '🥛' },
    { id: 'betel_pouch', name: 'Bata Betel Pouch', category: 'Hospitality', icon: '🍃' },
    { id: 'spinning_wheel', name: 'Charkha Takli', category: 'Eri Silk Weaving', icon: '🧵' }
  ],
  as: [
    { id: 'japi', name: 'বাঁহৰ জাপি', category: 'পৰম্পৰাগত টুপি', icon: '👒' },
    { id: 'gamusa', name: 'ফুলাম গামোচা', category: 'মৰমৰ বস্ত্ৰ', icon: '🧣' },
    { id: 'chai_kettle', name: 'পিতলৰ চাহ কেটলী', category: 'চাহৰ পৰ্ব', icon: '🫖' },
    { id: 'flute', name: 'বাঁহৰ সুৰীয়া বাঁহী', category: 'লোক সঙ্গীত', icon: '🎋' },
    { id: 'clay_lamp', name: 'মাটিৰ চাকি', category: 'সন্ধ্যা প্ৰাৰ্থনা', icon: '🪔' },
    { id: 'basket', name: 'চাহ তোলা পাচি', category: 'চাহ খেতি', icon: '🧺' },
    { id: 'brass_glass', name: 'কাঁহৰ পানী খোৱা গিলাচ', category: 'আতিথ্য', icon: '🥛' },
    { id: 'betel_pouch', name: 'পিতলৰ বঁটা আৰু তামোল', category: 'সন্মানীয় আতিথ্য', icon: '🍃' },
    { id: 'spinning_wheel', name: 'এৰী সূতা কটা যঁতৰ', category: 'তাঁতশাল', icon: '🧵' }
  ],
  bn: [
    { id: 'japi', name: 'বাঁশের জাপি টুপি', category: 'ঐতিহ্যবাহী টুপি', icon: '👒' },
    { id: 'gamusa', name: 'ফুলতোলা গামোছা', category: 'স্নেহের চাদর', icon: '🧣' },
    { id: 'chai_kettle', name: 'পিতলের চায়ের কেটলি', category: 'চা পর্ব', icon: '🫖' },
    { id: 'flute', name: 'হাতে গড়া বাঁশি', category: 'লোক সঙ্গীত', icon: '🎋' },
    { id: 'clay_lamp', name: 'মাটির প্রদীপ', category: 'সন্ধ্যা আরতি', icon: '🪔' },
    { id: 'basket', name: 'চা পাতা তোলার ঝুড়ি', category: 'ফসল তোলা', icon: '🧺' },
    { id: 'brass_glass', name: 'কাঁসার জলের গ্লাস', category: 'গৃহস্থালি', icon: '🥛' },
    { id: 'betel_pouch', name: 'পান-সুপারির বাটা', category: 'আতিথেয়তা', icon: '🍃' },
    { id: 'spinning_wheel', name: 'রেশম সুতা কাটার চরকা', category: 'বস্ত্র বয়ন', icon: '🧵' }
  ],
  mni: [
    { id: 'japi', name: 'ৱাগী খুদুপ (জাপি)', category: 'নাৎকী লুপাহুম', icon: '👒' },
    { id: 'gamusa', name: 'ফিদম গামোচা', category: 'নাৎকী ফী', icon: '🧣' },
    { id: 'chai_kettle', name: 'চা থকফম কেতলী', category: 'চা থকপা', icon: '🫖' },
    { id: 'flute', name: 'ৱাগী শুরন্দা', subtitle: 'ঈশৈ সাকপা', icon: '🎋' },
    { id: 'clay_lamp', name: 'লৈবাক্কী থাবা থাউমৈ', category: 'নুমিদাং থৌনীবা', icon: '🪔' },
    { id: 'basket', name: 'চা মনা পুবা পলং', category: 'পোৎলম পুবা', icon: '🧺' },
    { id: 'brass_glass', name: 'ঈশিং থকফম গ্লাস', category: 'চাক-ঈশিং', icon: '🥛' },
    { id: 'betel_pouch', name: 'কোয়া পুবা পুখম', category: 'মীথুং ওকপা', icon: '🍃' },
    { id: 'spinning_wheel', name: 'ফী শাবা তরেং', category: 'ফী শাবা', icon: '🧵' }
  ],
  nag: [
    { id: 'japi', name: 'Bamboo Japi Hat', category: 'Assam Sunhat', icon: '👒' },
    { id: 'gamusa', name: 'Laal-Sada Gamusa', category: 'Traditional Scarf', icon: '🧣' },
    { id: 'chai_kettle', name: 'Brass Cha Kettle', category: 'Cha Saman', icon: '🫖' },
    { id: 'flute', name: 'Haat pora banowa Bansuri', category: 'Gaan Bajana', icon: '🎋' },
    { id: 'clay_lamp', name: 'Mitti Diya', category: 'Sanjh Puja', icon: '🪔' },
    { id: 'basket', name: 'Cha Pata Jhuli', category: 'Bagan Kaam', icon: '🧺' },
    { id: 'brass_glass', name: 'Kaha Pani Glass', category: 'Ghar Laga Bartan', icon: '🥛' },
    { id: 'betel_pouch', name: 'Paan Supari Bata', category: 'Mehman Swagat', icon: '🍃' },
    { id: 'spinning_wheel', name: 'Kapra Bunibole Charkha', category: 'Weaving', icon: '🧵' }
  ]
};

// 4. Daily Life Recall Questions
export const DAILY_RECALL_QUESTIONS = {
  en: [
    {
      id: 'tea',
      question: 'What comforting warm beverage is cherished in the morning across Assam and the hills?',
      options: ['Fresh Assam Milk Tea with Cardamom', 'Iced Lemon Soda', 'Cold Apple Juice', 'Chilled Rose Milk'],
      correct: 0,
      hint: 'Grown along the Brahmaputra valley.'
    },
    {
      id: 'season',
      question: 'When the spring breeze arrives in North East India, which vibrant harvest festival is celebrated?',
      options: ['Bihu and Spring Harvest Festivals', 'Winter Snow Carnival', 'Autumn Leaves Gathering', 'Midsummer Sun Feast'],
      correct: 0,
      hint: 'Celebrated with dhol, pepa, and joyful dancing.'
    },
    {
      id: 'evening',
      question: 'What is a gentle, calming evening routine after sunset?',
      options: ['Lighting a brass lamp and gentle prayer', 'Running a fast marathon', 'Drinking three cups of black espresso', 'Chopping heavy firewood'],
      correct: 0,
      hint: 'Bringing peaceful warmth and prayer to the household.'
    },
    {
      id: 'care',
      question: 'When should morning medicine typically be taken?',
      options: ['After a warm nutritious breakfast with water', 'Right in the middle of deep sleep', 'Never with water', 'Only while jogging outdoors'],
      correct: 0,
      hint: 'Taken with gentle morning nourishment and water.'
    }
  ],
  as: [
    {
      id: 'tea',
      question: 'অসম আৰু পাহাৰৰ প্ৰতিখন ঘৰতে পুৱা কি উমাল আৰু সুস্বাদু পানীয় আদৰেৰে খোৱা হয়?',
      options: ['ইলাচী দিয়া গৰম অসমীয়া গাখীৰ চাহ', 'বৰফ দিয়া টেঙা চ’ডা', 'ঠাণ্ডা আপেল ৰস', 'বৰফ দিয়া গোলাপ গাখীৰ'],
      correct: 0,
      hint: 'ব্ৰহ্মপুত্ৰ উপত্যকাৰ সেউজীয়া বাগিচাত উৎপাদিত।'
    },
    {
      id: 'season',
      question: 'বসন্ত কাল অহাত উত্তৰ-পূৰ্বাঞ্চলত আনন্দ আৰু উলাহেৰে কি বিশেষ উৎসৱ পালন কৰা হয়?',
      options: ['ৰঙালী বিহু আৰু বসন্তৰ কৃষি উৎসৱ', 'শীতৰ বৰফ মহোৎসৱ', 'শৰতৰ শুকান পাত সংগ্ৰহ', 'মাজনিশাৰ ভোজ-ভাত'],
      correct: 0,
      hint: 'ঢোল, পেঁপা আৰু গগনাৰ সুৰেৰে উদযাপিত হয়।'
    },
    {
      id: 'evening',
      question: 'সন্ধিয়া পৰত ঘৰখনত শান্ত আৰু পবিত্ৰ পৰিৱেশ সৃষ্টি কৰিবলৈ কি কৰা হয়?',
      options: ['মাটিৰ বা পিতলৰ চাকি জ্বলাই নাম-প্ৰাৰ্থনা', 'পথাৰত দৌৰা প্ৰতিযোগিতা', 'তিনি কাপ ক’লা কফি খোৱা', 'ৰাতি খৰি ফলা'],
      correct: 0,
      hint: 'ঘৰলৈ সুখ-শান্তি আৰু পোহৰ কঢ়িয়াই আনে।'
    },
    {
      id: 'care',
      question: 'পুৱাৰ ঔষধ সাধাৰণতে কেনেদৰে খোৱাটো স্বাস্থ্যসন্মত?',
      options: ['পুৱাৰ পুষ্টিকৰ জলপান খাই পানীৰে সৈতে', 'গভীৰ টোপনিৰ মাজত শুই শুই', 'পানী নোখোৱাকৈ শুকানকৈ', 'কেৱল দৌৰি থকা অৱস্থাত'],
      correct: 0,
      hint: 'পুৱাৰ আহাৰৰ পিছত পৰ্যাপ্ত পানীৰে গ্ৰহণ কৰিব লাগে।'
    }
  ],
  bn: [
    {
      id: 'tea',
      question: 'আসাম এবং পাহাড়ি অঞ্চলে সকালে কোন গরম ও আরামদায়ক পানীয় সকলে ভালোবেসে পান করেন?',
      options: ['এলাচ দেওয়া গরম আসাম দুধ চা', 'বরফ দেওয়া লেবু সোডা', 'ঠান্ডা আপেলের রস', 'ঠান্ডা গোলাপ শরবত'],
      correct: 0,
      hint: 'ব্রহ্মপুত্র উপত্যকার সবুজ বাগানের চা পাতা।'
    },
    {
      id: 'season',
      question: 'বসন্তের হাওয়া এলে উত্তর-পূর্ব ভারতে আনন্দের সাথে কোন ফসল কাটার উৎসব উদযাপিত হয়?',
      options: ['রঙ্গালী বিহু ও বসন্তোৎসব', 'শীতের তুষার উৎসব', 'শরতের শুকনো পাতা কুড়ানো', 'গ্রীষ্মের তপ্ত মেলা'],
      correct: 0,
      hint: 'ঢোল ও বাঁশির সুরে আনন্দমুখর উৎসব।'
    },
    {
      id: 'evening',
      question: 'সন্ধ্যায় ঘরে শান্তি ও কল্যাণের জন্য সাধারণত কোন অভ্যাসটি পালন করা হয়?',
      options: ['প্রদীপ জ্বালিয়ে শান্ত মনে প্রার্থনা', 'রাস্তায় দ্রুত দৌড় প্রতিযোগিতা', 'কড়া কালো কফি পান করা', 'রাতে ভারী কাঠ কাটা'],
      correct: 0,
      hint: 'যা পরিবারে শান্তি ও শুভকামনা এনে দেয়।'
    },
    {
      id: 'care',
      question: 'সকালের ওষুধ সাধারণত কখন এবং কিভাবে গ্রহণ করা উচিত?',
      options: ['পুষ্টিকর সকালের নাস্তার পর পরিমিত জল দিয়ে', 'গভীর ঘুমের মধ্যে', 'জল ছাড়া শুকনোভাবে', 'বাইরে জগিং করার সময়'],
      correct: 0,
      hint: 'হালকা সকালের খাবারের পর জল দিয়ে খাওয়া নিরাপদ।'
    }
  ],
  mni: [
    {
      id: 'tea',
      question: 'অয়ুক্কী মতমদা অসাম অমসুং চিংগী লমদমশিংদা নুংশিজরবা করি গৰম পানীয় থকই?',
      options: ['ইলাইচী য়াওবা আসামগী লৌমী চা', 'আইস লেমন সোডা', 'শীৎলবা শেবকী মহী', 'আইস মিল্ক'],
      correct: 0,
      hint: 'ব্রহ্মপুত্র খোঙবালদা হৈবা চা মনা।'
    },
    {
      id: 'season',
      question: 'বসন্ত মতমদা নোংপোক থংবা লমদমদা হরাও-তয়াম্বগা লোয়ননা পাংথোকপা কুমহৈ অদু করিনো?',
      options: ['বিহু অমসুং য়েন্থোক কুমহৈ', 'শীৎলবা উনগী কুহ্মৈ', 'নপাহুম খোমজিনবা', 'নুমিদাংগী চাক-থকপা'],
      correct: 0,
      hint: 'ঢোল অমসুং পেঁপা শৈশকতা পাংথোকই।'
    },
    {
      id: 'evening',
      question: 'নুমিদাং ৱাইরমদা য়ুমদা শান্তিগীদমক তৌবা থবক অদু করিনো?',
      options: ['থাউমৈ থান্থোক্তুনা ঈশ্বর থৌনীবা', 'লম্বীদা য়েল য়ানবা', 'ব্ল্যাক কফি থকপা', 'শিং য়ানবা'],
      correct: 0,
      hint: 'য়ুমদা শান্তি অমসুং মঙ্গল পুরকই।'
    },
    {
      id: 'care',
      question: 'অয়ুক্কী হিদাক অসি করম্বা মতমদা চাবা ফবগে?',
      options: ['অয়ুক্কী চাক-ঈশিং চাৰবা মতুংদা', 'তুমলিঙৈ মরক্তা', 'ঈশিং থকপদা নত্তনা', 'চেল্লিঙৈ মতমদা'],
      correct: 0,
      hint: 'অয়ুক্কী চানবা চারবা মতুংদা ঈশিংগা চাবা।'
    }
  ],
  nag: [
    {
      id: 'tea',
      question: 'Bihanate Assam aru pahar laga ghor te kun garam chij bhal pora khaye?',
      options: ['Elachi thaka Garam Assam Milk Chai', 'Barf Lemon Soda', 'Thanda Apple Juice', 'Barf Rose Milk'],
      correct: 0,
      hint: 'Brahmaputra valley laga cha bagan pora ahe.'
    },
    {
      id: 'season',
      question: 'Spring mausam te North East te kun sundar kheti festival manaye?',
      options: ['Rongali Bihu aru Spring Festival', 'Thanda Snow Carnival', 'Shukha Pata Uthani', 'Dopahar Dhoop Feast'],
      correct: 0,
      hint: 'Dhol aru pepa bajai kena nachi gana kore.'
    },
    {
      id: 'evening',
      question: 'Sanjh time te ghor te shanti karne ki kora bhal?',
      options: ['Diya jolai kena shanti pora prarthana kora', 'Rasta te jor pora daura', 'Tin cup kadak black coffee khowa', 'Kathi kata'],
      correct: 0,
      hint: 'Ghor te shanti aru roshni aney.'
    },
    {
      id: 'care',
      question: 'Bihana laga dawai ketiya khowa bhal?',
      options: ['Bihana nasta khai kena pani logot', 'Bhal ghum te thaka time', 'Pani nakhai kena', 'Kheli thaka time te'],
      correct: 0,
      hint: 'Bihana nasta khowa pichete pani logot lobi.'
    }
  ]
};

// 5. Picture Recognition Landmarks
export const PICTURE_LANDMARKS = {
  en: [
    {
      id: 'kaziranga',
      name: 'Kaziranga National Park',
      state: 'Assam',
      clue: 'World heritage sanctuary on the banks of Brahmaputra, home to the majestic one-horned rhino.',
      icon: '🦏🌾',
      options: ['Kaziranga National Park', 'Sundarbans Forest', 'Corbett Valley', 'Gir Forest']
    },
    {
      id: 'majuli',
      name: 'Majuli River Island',
      state: 'Assam',
      clue: 'The serene world’s largest inhabited river island, famous for Vaishnavite Satras and mask-making art.',
      icon: '🏝️🎭',
      options: ['Majuli River Island', 'Andaman Island', 'Diu Fortress', 'Elephanta Caves']
    },
    {
      id: 'root_bridge',
      name: 'Living Root Bridges',
      state: 'Meghalaya',
      clue: 'Spectacular bridges handcrafted by the Khasi tribe from living rubber fig tree roots over rushing streams.',
      icon: '🌉🌿',
      options: ['Living Root Bridges', 'Howrah Cantilever', 'Pamban Bridge', 'Bandra Sea Link']
    },
    {
      id: 'loktak',
      name: 'Loktak Floating Lake',
      state: 'Manipur',
      clue: 'Only floating lake in the world with round green phumdis and the gentle dancing Sangai deer.',
      icon: '🌊🦌',
      options: ['Loktak Floating Lake', 'Dal Lake', 'Chilika Lagoon', 'Vembanad Lake']
    },
    {
      id: 'tawang',
      name: 'Tawang Monastery',
      state: 'Arunachal Pradesh',
      clue: 'Second largest Buddhist monastery in the world perched amidst misty snow-clad Himalayan peaks.',
      icon: '🏯🏔️',
      options: ['Tawang Monastery', 'Sanchi Stupa', 'Ajanta Monolith', 'Hemis Gompa']
    },
    {
      id: 'ujjayanta',
      name: 'Ujjayanta Palace',
      state: 'Tripura',
      clue: 'Magnificent white neoclassical palace in Agartala, surrounded by Mughal-style reflecting water gardens.',
      icon: '🏛️⛲',
      options: ['Ujjayanta Palace', 'Mysore Palace', 'Hawa Mahal', 'City Palace Udaipur']
    }
  ],
  as: [
    {
      id: 'kaziranga',
      name: 'কাজিৰঙা ৰাষ্ট্ৰীয় উদ্যান',
      state: 'অসম',
      clue: 'ব্ৰহ্মপুত্ৰৰ পাৰৰ বিশ্ব ঐতিহ্য ক্ষেত্ৰ, গৌৰৱান্বিত এশিঙীয়া গঁড়ৰ ঐতিহাসিক বাসস্থান।',
      icon: '🦏🌾',
      options: ['কাজিৰঙা ৰাষ্ট্ৰীয় উদ্যান', 'সুন্দৰবন বনাঞ্চল', 'কৰবেট উপত্যকা', 'গীৰ বনাঞ্চল']
    },
    {
      id: 'majuli',
      name: 'মাজুলী নদী দ্বীপ',
      state: 'অসম',
      clue: 'পৃথিৱীৰ সৰ্ববৃহৎ জনবসতিপূৰ্ণ নদী দ্বীপ, মহাপুৰুষীয়া সত্ৰীয়া সংস্কৃতি আৰু মুখা শিল্পৰ পুণ্যভূমি।',
      icon: '🏝️🎭',
      options: ['মাজুলী নদী দ্বীপ', 'আন্দামান দ্বীপপুঞ্জ', 'দীউ দুৰ্গ', 'এলিফেণ্টা গুহা']
    },
    {
      id: 'root_bridge',
      name: 'জীৱন্ত শিপাৰ দলং',
      state: 'মেঘালয়',
      clue: 'মেঘালয়ৰ খাচী লোকসকলে জীৱন্ত গছৰ শিপাৰে বৈ উলিওৱা বিস্ময়কৰ প্ৰাকৃতিক দলং।',
      icon: '🌉🌿',
      options: ['জীৱন্ত শিপাৰ দলং', 'হাওৰা দলং', 'পাম্বান সেতু', 'বান্দ্ৰা ছীলিংক']
    },
    {
      id: 'loktak',
      name: 'লোকটক হ্ৰদ আৰু ফুমদী',
      state: 'মণিপুৰ',
      clue: 'বিশ্বৰ একমাত্ৰ ভাসমান হ্ৰদ, য’ত ঘূৰণীয়া সেউজীয়া ফুমদী আৰু নাচনী চাংগাই হৰিণা বাস কৰে।',
      icon: '🌊🦌',
      options: ['লোকটক ভাসমান হ্ৰদ', 'দাল হ্ৰদ', 'চিল্কা হ্ৰদ', 'ভেম্বানাড হ্ৰদ']
    },
    {
      id: 'tawang',
      name: 'টাৱাং বৌদ্ধ মঠ',
      state: 'অৰুণাচল প্ৰদেশ',
      clue: 'হিমালয়ৰ বৰফাবৃত শৃংগৰ মাজত অৱস্থিত ভাৰত তথা বিশ্বৰ দ্বিতীয় বৃহত্তম ঐতিহাসিক বৌদ্ধ মঠ।',
      icon: '🏯🏔️',
      options: ['টাৱাং বৌদ্ধ মঠ', 'সাঁচী স্তূপ', 'অজন্তা গুহা', 'হেমীচ গুম্ফা']
    },
    {
      id: 'ujjayanta',
      name: 'উজ্জয়ন্ত প্ৰাসাদ',
      state: 'ত্ৰিপুৰা',
      clue: 'আগৰতলাৰ মনোৰম বগা ৰাজপ্ৰাসাদ, যাৰ সন্মুখত আছে মোগল শৈলীৰ সুন্দৰ জল উদ্যান।',
      icon: '🏛️⛲',
      options: ['উজ্জয়ন্ত প্ৰাসাদ', 'মহীশূৰ ৰাজপ্ৰাসাদ', 'হাওয়া মহল', 'উদয়পুৰ ৰাজপ্রাসাদ']
    }
  ],
  bn: [
    {
      id: 'kaziranga',
      name: 'কাজিরাঙা জাতীয় উদ্যান',
      state: 'আসাম',
      clue: 'ব্রহ্মপুত্র নদের তীরে বিশ্ব ঐতিহ্য ক্ষেত্র, বিখ্যাত একশৃঙ্গ গণ্ডারের আবাসস্থল।',
      icon: '🦏🌾',
      options: ['কাজিরাঙা জাতীয় উদ্যান', 'সুন্দরবন বনাঞ্চল', 'করবেট ভ্যালি', 'গির অভয়ারণ্য']
    },
    {
      id: 'majuli',
      name: 'মাজুলী নদী দ্বীপ',
      state: 'আসাম',
      clue: 'বিশ্বের বৃহত্তম নদী দ্বীপ, বৈষ্ণব সত্র সংস্কৃতি এবং ঐতিহ্যবাহী মুখোশ শিল্পের কেন্দ্র।',
      icon: '🏝️🎭',
      options: ['মাজুলী নদী দ্বীপ', 'আন্দামান দ্বীপপুঞ্জ', 'দিউ দুর্গ', 'এলিফ্যান্টা গুহা']
    },
    {
      id: 'root_bridge',
      name: 'জীবন্ত গাছের শিকড়ের সেতু',
      state: 'মেঘালয়',
      clue: 'মেঘালয়ের খাসি জনজাতির বোনা প্রাকৃতিক গাছের জীবন্ত শিকড়ের অপূর্ব সেতু।',
      icon: '🌉🌿',
      options: ['জীবন্ত শিকড়ের সেতু', 'হাওড়া ব্রিজ', 'পাম্বান সেতু', 'বান্দ্রা সী লিংক']
    },
    {
      id: 'loktak',
      name: 'লোকটাক ভাসমান হ্রদ',
      state: 'মণিপুর',
      clue: 'বিশ্বের একমাত্র ভাসমান হ্রদ, যেখানে রয়েছে বৃত্তাকার ফুমদি এবং নৃত্যরত সাঙ্গাই হরিণ।',
      icon: '🌊🦌',
      options: ['লোকটাক ভাসমান হ্রদ', 'ডাল লেক', 'চিল্কা হ্রদ', 'ভেম্বানাদ হ্রদ']
    },
    {
      id: 'tawang',
      name: 'তাওয়াং বৌদ্ধ মঠ',
      state: 'অরুণাচল প্রদেশ',
      clue: 'হিমালয়ের বরফ ঢাকা শৃঙ্গে অবস্থিত ভারতের বৃহত্তম ঐতিহাসিক বৌদ্ধ মঠ।',
      icon: '🏯🏔️',
      options: ['তাওয়াং বৌদ্ধ মঠ', 'সাঁচি স্তূপ', 'অজন্তা গুহা', 'হেমিস মনাস্ট্রি']
    },
    {
      id: 'ujjayanta',
      name: 'উজ্জয়ন্ত প্রাসাদ',
      state: 'ত্রিপুরা',
      clue: 'আগরতলার শুভ্র সুন্দর ঐতিহাসিক রাজপ্রাসাদ, যা মুঘল বাগিচা ও ফোয়ারা দ্বারা পরিবেষ্টিত।',
      icon: '🏛️⛲',
      options: ['উজ্জয়ন্ত প্রাসাদ', 'মহীশূর রাজপ্রাসাদ', 'হাওয়া মহল', 'সিটি প্যালেস উদয়পুর']
    }
  ],
  mni: [
    {
      id: 'kaziranga',
      name: 'কাজিরঙ্গা নেস্নেল পার্ক',
      state: 'অসাম',
      clue: 'ব্রহ্মপুত্র খোঙবালদা লৈবা বিশ্ব ঐতিহ্য লমদম, শামু য়াইরোইবা (গণ্ডার) গী মফম।',
      icon: '🦏🌾',
      options: ['কাজিরঙ্গা নেস্নেল পার্ক', 'সুন্দরবন উমং', 'করবেট পার্ক', 'গীর উমং']
    },
    {
      id: 'majuli',
      name: 'মাজুলী তুরেল ঈথৎ',
      state: 'অসাম',
      clue: 'মালেমগী খ্বাইদগী চাউবা তুরেল ঈথৎ, সত্রীয়া নাৎ অমসুং শমুক্কী মফম।',
      icon: '🏝️🎭',
      options: ['মাজুলী তুরেল ঈথৎ', 'আন্দামান ঈথৎ', 'দিউ কোন্নুং', 'এলিফ্যান্টা সুরং']
    },
    {
      id: 'root_bridge',
      name: 'হিংলিবা মরী থোং',
      state: 'মেঘালয়',
      clue: 'মেঘালয়গী খাসী কাংলুপনা উপাম্বীগী মরীনচংনা শাবা মহৌশাগী অচৌবা থোং।',
      icon: '🌉🌿',
      options: ['হিংলিবা মরী থোং', 'হাওড়া থোং', 'পাম্বান থোং', 'বান্দ্রা সীলিংক']
    },
    {
      id: 'loktak',
      name: 'লোকতাক ভাসমান পাত',
      state: 'মণিপুর',
      clue: 'মালেমগী অমত্তা ঙাইরবা ফুমদী লৈবা পাত অমসুং নুংশিজরবা সংগাই সজগুম্বা মফম।',
      icon: '🌊🦌',
      options: ['লোকতাক ভাসমান পাত', 'দাল পাত', 'চিল্কা পাত', 'ভেম্বানাদ পাত']
    },
    {
      id: 'tawang',
      name: 'তৱাং বৌদ্ধ গোম্পা',
      state: 'অরুণাচল প্রদেশ',
      clue: 'হিমালয়গী উননা কুপ্লবা চিংদোলদা লৈবা ভারতকী খ্বাইদগী চাউবা বৌদ্ধ লাইশং।',
      icon: '🏯🏔️',
      options: ['তৱাং বৌদ্ধ গোম্পা', 'সাঁচী স্তূপ', 'অজন্তা সুরং', 'হেমিস গোম্পা']
    },
    {
      id: 'ujjayanta',
      name: 'উজ্জয়ন্ত কোনুং',
      state: 'ত্রিপুরা',
      clue: 'আগরতলাগী অঙৌবা নীংথৌ কোনুং, ঈশিং ফাউন্টেন অমসুং বাগান্না কোয়শিনবা।',
      icon: '🏛️⛲',
      options: ['উজ্জয়ন্ত কোনুং', 'মহীশূর কোনুং', 'হাওয়া মহল', 'উদয়পুর কোনুং']
    }
  ],
  nag: [
    {
      id: 'kaziranga',
      name: 'Kaziranga National Park',
      state: 'Assam',
      clue: 'Brahmaputra nodi kinar te ek-seeng thaka rhino laga bhal jagah.',
      icon: '🦏🌾',
      options: ['Kaziranga National Park', 'Sundarbans Forest', 'Corbett Valley', 'Gir Forest']
    },
    {
      id: 'majuli',
      name: 'Majuli River Island',
      state: 'Assam',
      clue: 'Duniya laga sobse bhal nodi island, satra culture aru mask making karne namkora.',
      icon: '🏝️🎭',
      options: ['Majuli River Island', 'Andaman Island', 'Diu Fortress', 'Elephanta Caves']
    },
    {
      id: 'root_bridge',
      name: 'Living Root Bridge',
      state: 'Meghalaya',
      clue: 'Meghalaya te Khasi log pora gachh laga jinda jor pora bonowa pul.',
      icon: '🌉🌿',
      options: ['Living Root Bridge', 'Howrah Bridge', 'Pamban Bridge', 'Bandra Sea Link']
    },
    {
      id: 'loktak',
      name: 'Loktak Floating Lake',
      state: 'Manipur',
      clue: 'Duniya te ekla floating lake jote phumdi aru Sangai horin thake.',
      icon: '🌊🦌',
      options: ['Loktak Floating Lake', 'Dal Lake', 'Chilika Lagoon', 'Vembanad Lake']
    },
    {
      id: 'tawang',
      name: 'Tawang Monastery',
      state: 'Arunachal Pradesh',
      clue: 'Barf pahar te bana Bharat laga sobse bhal Buddhist mandir.',
      icon: '🏯🏔️',
      options: ['Tawang Monastery', 'Sanchi Stupa', 'Ajanta Monolith', 'Hemis Gompa']
    },
    {
      id: 'ujjayanta',
      name: 'Ujjayanta Palace',
      state: 'Tripura',
      clue: 'Agartala te thaka sada sundar raja laga palace.',
      icon: '🏛️⛲',
      options: ['Ujjayanta Palace', 'Mysore Palace', 'Hawa Mahal', 'City Palace Udaipur']
    }
  ]
};

// 6. Simple Language Recall Word Pairs
export const LANGUAGE_RECALL_PAIRS = {
  en: [
    {
      language: 'Assamese (অসমীয়া)',
      nativeWord: 'নমস্কাৰ (Namaskar)',
      meaning: 'Respectful Greeting',
      options: ['Respectful Greeting', 'Cold Mountain Breeze', 'Evening Dinner', 'Morning Walk'],
      correct: 'Respectful Greeting'
    },
    {
      language: 'Meitei / Manipuri (মৈতৈলোন্)',
      nativeWord: 'খুরুমজরি (Khurumjari)',
      meaning: 'Humble Salutations & Warm Welcome',
      options: ['Humble Salutations & Warm Welcome', 'Red Silk Ribbon', 'Bamboo Flute', 'Sweet Rice Cake'],
      correct: 'Humble Salutations & Warm Welcome'
    },
    {
      language: 'Khasi (Ka Ktien Khasi)',
      nativeWord: 'Khublei Shibun',
      meaning: 'Blessings & Many Thanks',
      options: ['Blessings & Many Thanks', 'Thunderstorm in Hills', 'Hot Black Tea', 'Fast Running Stream'],
      correct: 'Blessings & Many Thanks'
    },
    {
      language: 'Mizo (Mizo ṭawng)',
      nativeWord: 'Chibai',
      meaning: 'Peaceful Hello & Good Wishes',
      options: ['Peaceful Hello & Good Wishes', 'Heavy Rain Shower', 'Wooden Loom', 'Wild Orchid'],
      correct: 'Peaceful Hello & Good Wishes'
    },
    {
      language: 'Bengali (বাংলা)',
      nativeWord: 'সুপ্রভাত (Suprobhat)',
      meaning: 'Good Morning & Peaceful Dawn',
      options: ['Good Morning & Peaceful Dawn', 'Midnight Stars', 'Heavy Brass Pot', 'Winter Blanket'],
      correct: 'Good Morning & Peaceful Dawn'
    }
  ],
  as: [
    {
      language: 'অসমীয়া',
      nativeWord: 'নমস্কাৰ (Namaskar)',
      meaning: 'শ্ৰদ্ধাপূৰ্ণ সম্ভাষণ',
      options: ['শ্ৰদ্ধাপূৰ্ণ সম্ভাষণ', 'শীতল পাহাৰীয়া বতাহ', 'ৰাতিৰ আহাৰ', 'পুৱাৰ খোজ কঢ়া'],
      correct: 'শ্ৰদ্ধাপূৰ্ণ সম্ভাষণ'
    },
    {
      language: 'মৈতৈ / মণিপুৰী',
      nativeWord: 'খুরুমজরি (Khurumjari)',
      meaning: 'বিনম্ৰ প্ৰণাম আৰু আন্তৰিক স্বাগতম',
      options: ['বিনম্ৰ প্ৰণাম আৰু আন্তৰিক স্বাগতম', 'ৰঙা পাটৰ ফিটা', 'বাঁহৰ সুৰীয়া বাঁহী', 'মিঠা পিঠা'],
      correct: 'বিনম্ৰ প্ৰণাম আৰু আন্তৰিক স্বাগতম'
    },
    {
      language: 'খাচী (Ka Ktien Khasi)',
      nativeWord: 'Khublei Shibun',
      meaning: 'ঈশ্বৰৰ আশীৰ্বাদ আৰু অশেষ ধন্যবাদ',
      options: ['ঈশ্বৰৰ আশীৰ্বাদ আৰু অশেষ ধন্যবাদ', 'পাহাৰৰ বিজুলী ধুমুহা', 'গৰম ৰঙা চাহ', 'পাহাৰীয়া জুৰি'],
      correct: 'ঈশ্বৰৰ আশীৰ্বাদ আৰু অশেষ ধন্যবাদ'
    },
    {
      language: 'মিজো (Mizo ṭawng)',
      nativeWord: 'Chibai',
      meaning: 'শান্তিময় শুভ সম্ভাষণ',
      options: ['শান্তিময় শুভ সম্ভাষণ', 'ধাৰাষাৰ বৰষুণ', 'শালৰ কাঠ', 'বনৰীয়া কপৌফুল'],
      correct: 'শান্তিময় শুভ সম্ভাষণ'
    },
    {
      language: 'বাংলা',
      nativeWord: 'সুপ্রভাত (Suprobhat)',
      meaning: 'শুভ প্ৰভাত আৰু সুন্দৰ পুৱা',
      options: ['শুভ প্ৰভাত আৰু সুন্দৰ পুৱা', 'মাজনিশাৰ আকাশৰ তৰা', 'পিতলৰ গধুৰ কলহ', 'শীতৰ উমাল কম্বল'],
      correct: 'শুভ প্ৰভাত আৰু সুন্দৰ পুৱা'
    }
  ],
  bn: [
    {
      language: 'অসমীয়া',
      nativeWord: 'নমস্কাৰ (Namaskar)',
      meaning: 'শ্রদ্ধাপূর্ণ সম্ভাষণ',
      options: ['শ্রদ্ধাপূর্ণ সম্ভাষণ', 'পাহাড়ি ঠান্ডা বাতাস', 'রাতের খাবার', 'সকালের প্রাতঃভ্রমণ'],
      correct: 'শ্রদ্ধাপূর্ণ সম্ভাষণ'
    },
    {
      language: 'মৈতৈ / মণিপুরী',
      nativeWord: 'খুরুমজরি (Khurumjari)',
      meaning: 'বিনম্র শ্রদ্ধা ও উষ্ণ অভ্যর্থনা',
      options: ['বিনম্র শ্রদ্ধা ও উষ্ণ অভ্যর্থনা', 'লাল রেশমী ফিতে', 'বাঁশের মধুর বাঁশি', 'মিষ্টি চালের পিঠে'],
      correct: 'বিনম্র শ্রদ্ধা ও উষ্ণ অভ্যর্থনা'
    },
    {
      language: 'খাসি (Ka Ktien Khasi)',
      nativeWord: 'Khublei Shibun',
      meaning: 'ঈশ্বরের আশীর্বাদ ও অজস্র ধন্যবাদ',
      options: ['ঈশ্বরের আশীর্বাদ ও অজস্র ধন্যবাদ', 'পাহাড়ের মেঘের গর্জন', 'গরম লাল চা', 'পাহাড়ি ঝরনা ধারা'],
      correct: 'ঈশ্বরের আশীর্বাদ ও অজস্র ধন্যবাদ'
    },
    {
      language: 'মিজো (Mizo ṭawng)',
      nativeWord: 'Chibai',
      meaning: 'শান্তিপূর্ণ শুভ সম্ভাষণ',
      options: ['শান্তিপূর্ণ শুভ সম্ভাষণ', 'ঝমঝম প্রবল বৃষ্টি', 'কাঠের তাঁতযন্ত্র', 'বুনো অর্কিড ফুল'],
      correct: 'শান্তিপূর্ণ শুভ সম্ভাষণ'
    },
    {
      language: 'বাংলা',
      nativeWord: 'সুপ্রভাত (Suprobhat)',
      meaning: 'শুভ সকাল ও শান্তিময় প্রভাত',
      options: ['শুভ সকাল ও শান্তিময় প্রভাত', 'মধ্যরাতের শুকতারা', 'ভারী পিতলের পাত্র', 'শীতের গরম চাদর'],
      correct: 'শুভ সকাল ও শান্তিময় প্রভাত'
    }
  ],
  mni: [
    {
      language: 'অসমীয়া',
      nativeWord: 'নমস্কাৰ (Namaskar)',
      meaning: 'ইকায় খুম্নরবা খুরুমজবা',
      options: ['ইকায় খুম্নরবা খুরুমজবা', 'শীৎলবা বতাহ', 'নুমিদাংগী চাক', 'অয়ুক্কী খোঙচৎ'],
      correct: 'ইকায় খুম্নরবা খুরুমজবা'
    },
    {
      language: 'মৈতৈলোন',
      nativeWord: 'খুরুমজরি (Khurumjari)',
      meaning: 'তরাম্না ওকচবা অমসুং খুরুমজবা',
      options: ['তরাম্না ওকচবা অমসুং খুরুমজবা', 'অঙাংবা ফী ফিদম', 'ৱাগী শুরন্দা', 'চাকহাওগী অহাওবা পিঠা'],
      correct: 'তরাম্না ওকচবা অমসুং খুরুমজবা'
    },
    {
      language: 'খাসী',
      nativeWord: 'Khublei Shibun',
      meaning: 'থৌজান অমসুং থাগৎচবা',
      options: ['থৌজান অমসুং থাগৎচবা', 'চিংগী নোংথিং', 'অশাংবা চা', 'তুরেল ঈচেল'],
      correct: 'থৌজান অমসুং থাগৎচবা'
    },
    {
      language: 'মিজো',
      nativeWord: 'Chibai',
      meaning: 'শান্তিগী খুরুমজবা',
      options: ['শান্তিগী খুরুমজবা', 'অকনবা নোংজু', 'উগী ফী শাফম', 'উমংগী লৈরাং'],
      correct: 'শান্তিগী খুরুমজবা'
    },
    {
      language: 'বাংলা',
      nativeWord: 'সুপ্রভাত (Suprobhat)',
      meaning: 'নুংশিরবা অয়ুক অমসুং মঙ্গল পুরকপা',
      options: ['নুংশিরবা অয়ুক অমসুং মঙ্গল পুরকপা', 'থৱানমিচাক', 'কাহাগী পুখম', 'শীতকী ফী'],
      correct: 'নুংশিরবা অয়ুক অমসুং মঙ্গল পুরকপা'
    }
  ],
  nag: [
    {
      language: 'Assamese',
      nativeWord: 'নমস্কাৰ (Namaskar)',
      meaning: 'Respect Laga Salam',
      options: ['Respect Laga Salam', 'Thanda Hawa', 'Rati Khana', 'Bihana Berabole'],
      correct: 'Respect Laga Salam'
    },
    {
      language: 'Manipuri',
      nativeWord: 'খুরুমজরি (Khurumjari)',
      meaning: 'Pyar Bhara Swagat',
      options: ['Pyar Bhara Swagat', 'Lal Fita', 'Bansuri', 'Mitha Pitha'],
      correct: 'Pyar Bhara Swagat'
    },
    {
      language: 'Khasi',
      nativeWord: 'Khublei Shibun',
      meaning: 'Ashirwad aru Dhanyavad',
      options: ['Ashirwad aru Dhanyavad', 'Toofan Hawa', 'Garam Cha', 'Pani Chara'],
      correct: 'Ashirwad aru Dhanyavad'
    },
    {
      language: 'Mizo',
      nativeWord: 'Chibai',
      meaning: 'Shanti Hello',
      options: ['Shanti Hello', 'Bhal Boroshun', 'Weaving Loom', 'Wild Phool'],
      correct: 'Shanti Hello'
    },
    {
      language: 'Bengali',
      nativeWord: 'সুপ্রভাত (Suprobhat)',
      meaning: 'Shubh Bihana',
      options: ['Shubh Bihana', 'Raat Laga Tara', 'Pitol Bartan', 'Thanda Kambal'],
      correct: 'Shubh Bihana'
    }
  ]
};

export const WEAVE_PATTERNS = {
  en: [
    {
      id: 'gamosa',
      title: 'Assamese Gamosa Border Motif',
      state: 'Assam',
      description: 'The iconic Kingkhap flower pattern woven in red and white muga silk.',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'Manipuri Phanek Stripe Rhythm',
      state: 'Manipur',
      description: 'Traditional Meitei horizontal border stripes woven on loin looms.',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'Mizo Puanchei Geometry',
      state: 'Mizoram',
      description: 'Festive ceremonial shawl with rhythmic diamond and triangle weaves.',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'Khasi Jainsem Floral Sequence',
      state: 'Meghalaya',
      description: 'Graceful hill flower motifs woven on fine mulberry silk.',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ],
  as: [
    {
      id: 'gamosa',
      title: 'অসমীয়া গামোচাৰ ফুল আৰু পাৰি',
      state: 'অসম',
      description: 'বগা আৰু ৰঙা সূতাৰে বোৱা কিংখাপ ফুলৰ ক্ৰম।',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'মণিপুৰী ফানেকৰ বয়ন আৰ্হি',
      state: 'মণিপুৰ',
      description: 'মৈতৈ পৰম্পৰাগত ৰং আৰু ফুলৰ ক্ৰম।',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'মিজো পুয়ানচেই জ্যামিতি',
      state: 'মিজোৰাম',
      description: 'উৎসৱৰ সাজ-পোছাকৰ ধুনীয়া জ্যামিতিক বয়ন।',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'খাচী জৈনসেমৰ ফুলৰ আৰ্হি',
      state: 'মেঘালয়',
      description: 'পাটৰ কাপোৰত পাহাৰীয়া ফুলৰ ক্ৰম।',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ],
  bn: [
    {
      id: 'gamosa',
      title: 'আসামের গামোছার পাড় নকশা',
      state: 'আসাম',
      description: 'লাল ও সাদা সুতোয় বোনা ঐতিহ্যবাহী ফুল।',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'মণিপুরী ফানেকের রেখা নকশা',
      state: 'মণিপুর',
      description: 'মৈতৈ জনজাতির ঐতিহ্যবাহী পাড়ের নকশা।',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'মিজো পুয়ানচেই জ্যামিতিক নকশা',
      state: 'মিজোরাম',
      description: 'উৎসবের পোষাকে জ্যামিতিক নকশার রূপ।',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'খাসি জৈনসেম নকশা',
      state: 'মেঘালয়',
      description: 'রেশমে বোনা পাহাড়ি বুনন ক্রম।',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ],
  brx: [
    {
      id: 'gamosa',
      title: 'गामोसा बिबार आरो फारि',
      state: 'आसाम',
      description: 'गोजा आरो गुफुर खुदुमजों दानाय बिबारनि फारि।',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'मनिपुरि फानेक दानाय महर',
      state: 'मनिपुर',
      description: 'मैतै हारिनि दानाय गाब आरो बिबारनि फारि।',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'मिजो पुवान दानाय महर',
      state: 'मिजोराम',
      description: 'साहा-सान्जा हारिमुनि समायना दानाय महर।',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'खासि जैनसेम बिबार फारि',
      state: 'मेघालय',
      description: 'हाजोनि बिबारनि समायना दानाय फारि।',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ],
  mni: [
    {
      id: 'gamosa',
      title: 'অসামগী গামোচাগী য়াইরোল',
      state: 'অসাম',
      description: 'অঙাংবা অমসুং অঙৌবা ময়াইনা শাবা লৈগী পরিং।',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'মণিপুরী ফনেক মায়েক পরিং',
      state: 'মণিপুর',
      description: 'মৈতৈ লৈহাও অমসুং মচুগী বয়ন পরিং।',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'মিজো পুয়ানচেই মায়েক',
      state: 'মিজোরাম',
      description: 'হরাও কুমহৈগী চিন্নবা জ্যামিতিগী শাবা।',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'খাসী জেইনসেম লৈ মায়েক',
      state: 'মেঘালয়',
      description: 'চিংগী লৈগী ফজরবা শাবা পরিং।',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ],
  kha: [
    {
      id: 'gamosa',
      title: 'Ka Dak Jain Gamosa',
      state: 'Assam',
      description: 'Ka jingthain tynrai saw bad lieh ha ka sopti.',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'Ka Dak Jain Phanek',
      state: 'Manipur',
      description: 'Ka jingthain tynrai Meitei ha ka shuki bad rong.',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'Ka Dak Puanchei Mizo',
      state: 'Mizoram',
      description: 'Ka jingthain sopti lehkmen ba itynnat bha.',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'Ka Dak Jainsem Khasi',
      state: 'Meghalaya',
      description: 'Ka jingthain tynrai tiew lulum ha ka jainsem.',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ],
  lus: [
    {
      id: 'gamosa',
      title: 'Gamosa Parzia Hriatpuina',
      state: 'Assam',
      description: 'A sen leh a var nena tah, Assamese gamosa parzia.',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'Manipur Phanek Tial',
      state: 'Manipur',
      description: 'Meitei hnam puan tial mawi leh duhawm tak.',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'Mizo Puanchei Tial Mawi',
      state: 'Mizoram',
      description: 'Kut laia kan inbel thin Puanchei tial mawi indawt.',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'Khasi Jainsem Parzia',
      state: 'Meghalaya',
      description: 'Tlangpar mawi tak tak jainsem puan tah indawt.',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ],
  grt: [
    {
      id: 'gamosa',
      title: 'Gamosa Ba·ra Rinoka',
      state: 'Assam',
      description: 'Gitchak aro gipok kildingchi dokgimin gamosa.',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'Phanek Ba·ra Rinoka',
      state: 'Manipur',
      description: 'Meitei a·chik manderangni dokgimin ba·ra.',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'Mizo Puan Ba·ra',
      state: 'Mizoram',
      description: 'Mani a·bao kanani nitoe dokgimin puan ba·ra.',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'Khasi Jainsem Bibal',
      state: 'Meghalaya',
      description: 'A·brini nitoa bibalrangchi dokgimin ba·ra.',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ],
  trp: [
    {
      id: 'gamosa',
      title: 'Gamosa Risa mwng',
      state: 'Assam',
      description: 'Kwchak tei kwphur ri barani mwng tei sairok.',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'Phanek Ri Daung',
      state: 'Manipur',
      description: 'Meitei hoda ni daung tei rang mwng.',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'Mizo Puanchei Ri Daung',
      state: 'Mizoram',
      description: 'Kotor salo gan-chumo daung kaham.',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'Khasi Jainsem Mwng',
      state: 'Meghalaya',
      description: 'Hathai ni baror mwng bumu ri daung.',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ],
  nag: [
    {
      id: 'gamosa',
      title: 'Assam Gamosa Flower Pattern',
      state: 'Assam',
      description: 'Lal aru shada sutate buna bhal flower sequence.',
      sequence: ['🌺', '💠', '🌺', '💠', '🌺'],
      options: ['💠', '🍃', '⭐', '🥁'],
      correct: '💠'
    },
    {
      id: 'phanek',
      title: 'Manipur Phanek Stripe Pattern',
      state: 'Manipur',
      description: 'Meitei tradition laga border pattern aru colour.',
      sequence: ['🟩', '🟨', '🟩', '🟨', '🟩'],
      options: ['🟨', '🟦', '⬛', '🟥'],
      correct: '🟨'
    },
    {
      id: 'mizo_puan',
      title: 'Mizo Puanchei Shawl Design',
      state: 'Mizoram',
      description: 'Festival time laga sundar weaving design sequence.',
      sequence: ['🔺', '🔹', '🔺', '🔹', '🔺'],
      options: ['🔹', '🔸', '🟢', '🔺'],
      correct: '🔹'
    },
    {
      id: 'khasi_jainsem',
      title: 'Khasi Jainsem Silk Flower Pattern',
      state: 'Meghalaya',
      description: 'Hill flower sequence buna laga silk pattern.',
      sequence: ['🌸', '🍃', '🌸', '🍃', '🌸'],
      options: ['🍃', '🍂', '🌾', '🌸'],
      correct: '🍃'
    }
  ]
};

/**
 * Main Content Resolver for any game and language code
 */
export function getGameContent(gameId, langCode = 'en') {
  const lang = (langCode || 'en').toLowerCase();

  switch (gameId) {
    case 'memory-match': {
      const cards = MEMORY_MATCH_CARDS[lang] || MEMORY_MATCH_CARDS.en;
      return Array.isArray(cards) ? cards : MEMORY_MATCH_CARDS.en;
    }
    case 'sequence-recall': {
      const drums = DRUMS_DATA[lang] || DRUMS_DATA.en;
      return Array.isArray(drums) ? drums : DRUMS_DATA.en;
    }
    case 'object-recall': {
      const items = OBJECT_RECALL_ITEMS[lang] || OBJECT_RECALL_ITEMS.en;
      return Array.isArray(items) ? items : OBJECT_RECALL_ITEMS.en;
    }
    case 'daily-recall': {
      const questions = DAILY_RECALL_QUESTIONS[lang] || DAILY_RECALL_QUESTIONS.en;
      return Array.isArray(questions) ? questions : DAILY_RECALL_QUESTIONS.en;
    }
    case 'picture-recognition': {
      const landmarks = PICTURE_LANDMARKS[lang] || PICTURE_LANDMARKS.en;
      return Array.isArray(landmarks) ? landmarks : PICTURE_LANDMARKS.en;
    }
    case 'language-recall': {
      const pairs = LANGUAGE_RECALL_PAIRS[lang] || LANGUAGE_RECALL_PAIRS.en;
      return Array.isArray(pairs) ? pairs : LANGUAGE_RECALL_PAIRS.en;
    }
    case 'pattern-recognition': {
      const patterns = WEAVE_PATTERNS[lang] || WEAVE_PATTERNS.en;
      return Array.isArray(patterns) ? patterns : WEAVE_PATTERNS.en;
    }
    default:
      return null;
  }
}

/**
 * Get localized metadata for game cards
 */
export function getGameMetadata(gameId, langCode = 'en') {
  const meta = GAME_METADATA[gameId];
  if (!meta) return null;
  const lang = (langCode || 'en').toLowerCase();
  return meta[lang] || meta.en || null;
}
