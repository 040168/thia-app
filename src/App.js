import React, { useState, useEffect, useRef, useCallback } from 'react';

// List of Major Arcana Tarot Cards for simulated recognition (Rider-Waite specific)
const majorArcanaTarotCards = [
    { id: "0", en: "The Fool", ka: "სულელი" },
    { id: "I", en: "The Magician", ka: "მოგვი" },
    { id: "II", en: "The High Priestess", ka: "ქურუმი ქალი" },
    { id: "III", en: "The Empress", ka: "იმპერატორი ქალი" },
    { id: "IV", en: "The Emperor", ka: "იმპერატორი" },
    { id: "V", en: "The Hierophant", ka: "ქურუმი" },
    { id: "VI", en: "The Lovers", ka: "შეყვარებულები" },
    { id: "VII", en: "The Chariot", ka: "ეტლი" },
    { id: "VIII", en: "Strength", ka: "ძალა" }, // Rider-Waite order
    { id: "IX", en: "The Hermit", ka: "განდეგილი" },
    { id: "X", en: "Wheel of Fortune", ka: "ბორბალი" },
    { id: "XI", en: "Justice", ka: "სამართლიანობა" }, // Rider-Waite order
    { id: "XII", en: "The Hanged Man", ka: "ჩამოკიდებული კაცი" },
    { id: "XIII", en: "Death", ka: "სიკვდილი" },
    { id: "XIV", en: "Temperance", ka: "ზომიერება" },
    { id: "XV", en: "The Devil", ka: "ეშმაკი" },
    { id: "XVI", en: "The Tower", ka: "კოშკი" },
    { id: "XVII", en: "The Star", ka: "ვარსკვლავი" },
    { id: "XVIII", en: "The Moon", ka: "მთვარე" },
    { id: "XIX", en: "The Sun", ka: "მზე" },
    { id: "XX", en: "Judgement", ka: "განკითხვა" },
    { id: "XXI", en: "The World", ka: "სამყარო" }
];

// Extracted "first line" descriptions based on the PDF snippet and common Rider-Waite meanings for missing ones.
// The key will be the English name of the card for easy lookup.
const cardDescriptions = {
    "The Fool": {
        en: "Taking a risk, A new beginning. The Fool represents the beginning of one's spiritual journey.",
        ka: "რისკის გაწევა, ახალი დასაწყისი. სულელი განასახიერებს სულიერი მოგზაურობის დასაწყისს."
    },
    "The Magician": {
        en: "Skill, confidence, will. The Magician is a powerful manifester.",
        ka: "უნარი, თავდაჯერებულობა, ნება. მოგვი ძლიერი მანიფესტორია."
    },
    "The High Priestess": {
        en: "Secrets, mystery, insight, intuition, wisdom. Divine feminine energy.",
        ka: "საიდუმლოებები, მისტიკა, გამჭრიახობა, ინტუიცია, სიბრძნე. ღვთაებრივი ქალური ენერგია."
    },
    "The Empress": {
        en: "Fruitfulness, Mothering energy, nurturing and love, Fertility.",
        ka: "ნაყოფიერება, დედობრივი ენერგია, აღზრდა და სიყვარული, ნაყოფიერება."
    },
    "The Emperor": {
        en: "Stability, power, aid, protection, conviction, reason. An opportunity.",
        ka: "სტაბილურობა, ძალა, დახმარება, დაცვა, დარწმუნება, გონიერება. შესაძლებლობა."
    },
    "The Hierophant": {
        en: "Marriage alliance. Find comfort in a group membership or as part of an institution. Learning.",
        ka: "ქორწინების ალიანსი. კომფორტის პოვნა ჯგუფის წევრობაში ან ინსტიტუტის ნაწილად. სწავლა."
    },
    "The Lovers": {
        en: "Love, union, partnership, choice, harmony.",
        ka: "სიყვარული, გაერთიანება, პარტნიორობა, არჩევანი, ჰარმონია."
    },
    "The Chariot": {
        en: "Control, willpower, victory, determination.",
        ka: "კონტროლი, ნებისყოფა, გამარჯვება, განსაზღვრულობა."
    },
    "Strength": {
        en: "Courage, inner strength, compassion, patience.",
        ka: "გამბედაობა, შინაგანი ძალა, თანაგრძნობა, მოთმინება."
    },
    "The Hermit": {
        en: "Solitude, introspection, guidance, soul-searching.",
        ka: "განმარტოება, ინტროსპექცია, ხელმძღვანელობა, სულის ძიება."
    },
    "Wheel of Fortune": {
        en: "Good luck, destiny, change, cycles, turning points.",
        ka: "წარმატება, ბედისწერა, ცვლილება, ციკლები, გარდამტეხი მომენტები."
    },
    "Justice": {
        en: "Fairness, truth, law, cause and effect, clarity.",
        ka: "სამართლიანობა, სიმართლე, კანონი, მიზეზი და შედეგი, სიცხადე."
    },
    "The Hanged Man": {
        en: "Suspension, surrender, new perspectives, sacrifice.",
        ka: "შეჩერება, დანებება, ახალი პერსპექტივები, მსხვერპლი."
    },
    "Death": {
        en: "Endings, beginnings, transformation, transition.",
        ka: "დასასრულები, დასაწყისები, ტრანსფორმაცია, გარდამავალი პერიოდი."
    },
    "Temperance": {
        en: "Balance, moderation, patience, purpose.",
        ka: "ბალანსი, ზომიერება, მოთმინება, მიზანი."
    },
    "The Devil": {
        en: "Bondage, addiction, materialism, shadow self.",
        ka: "დამოკიდებულება, მატერიალიზმი, ჩრდილოვანი მე."
    },
    "The Tower": {
        en: "Disaster, upheaval, sudden change, revelation.",
        ka: "კატასტროფა, არეულობა, უეცარი ცვლილება, გამოცხადება."
    },
    "The Star": {
        en: "Hope, inspiration, serenity, spirituality.",
        ka: "იმედი, შთაგონება, სიმშვიდე, სულიერება."
    },
    "XVIII The Moon": {
        en: "Illusion, intuition, subconscious, dreams.",
        ka: "ილუზია, ინტუიცია, ქვეცნობიერი, სიზმრები."
    },
    "The Sun": {
        en: "Joy, success, celebration, optimism.",
        ka: "სიხარული, წარმატება, ზეიმი, ოპტიმიზმი."
    },
    "Judgement": {
        en: "Reckoning, awakening, inner calling, absolution.",
        ka: "ანგარიშსწორება, გამოღვიძება, შინაგანი მოწოდება, განთავისუფლება."
    },
    "The World": {
        en: "Completion, integration, accomplishment, travel.",
        ka: "დასრულება, ინტეგრაცია, მიღწევა, მოგზაურობა."
    }
};

// Simplified Hexagram Names (for demonstration, a real I Ching app would have all 64)
const hexagramNames = {
    1: { en: "The Creative (Heaven)", ka: "შემოქმედებითი (ცის)" },
    2: { en: "The Receptive (Earth)", ka: "მიმღები (დედამიწის)" },
    3: { en: "Difficulty at the Beginning", ka: "სირთულე დასაწყისში" },
    4: { en: "Youthful Folly", ka: "ახალგაზრდული სისულელე" },
    5: { en: "Waiting", ka: "ლოდინი" },
    6: { en: "Conflict", ka: "კონფლიქტი" },
    7: { en: "The Army", ka: "არმია" },
    8: { en: "Holding Together", ka: "ერთად ყოფნა" },
    9: { en: "The Taming Power of the Small", ka: "პატარის მომთვინიერებელი ძალა" },
    10: { en: "Treading (Conduct)", ka: "ფეხის დადგმა (ქცევა)" },
    11: { en: "Peace", ka: "მშვიდობა" },
    12: { en: "Stagnation", ka: "სტაგნაცია" },
    13: { en: "Fellowship with Men", ka: "მეგობრობა ადამიანებთან" },
    14: { en: "Possession in Great Measure", ka: "დიდი ზომის ფლობა" },
    15: { en: "Modesty", ka: "მოკრძალება" },
    16: { en: "Enthusiasm", ka: "ენთუზიაზმი" },
    17: { en: "Following", ka: "მიმდევრობა" },
    18: { en: "Work on what has been spoiled (Decay)", ka: "მუშაობა გაფუჭებულზე (დაშლა)" },
    19: { en: "Approach", ka: "მიდგომა" },
    20: { en: "Contemplation (View)", ka: "განჭვრეტა (ხედვა)" },
    21: { en: "Biting Through", ka: "გაკვეთა" },
    22: { en: "Grace", ka: "მადლი" },
    23: { en: "Splitting Apart", ka: "განცალკევება" },
    24: { en: "Return (The Turning Point)", ka: "დაბრუნება (გარდამტეხი წერტილი)" },
    25: { en: "Innocence (The Unexpected)", ka: "უმანკოება (მოულოდნელი)" },
    26: { en: "The Taming Power of the Great", ka: "დიდის მომთვინიერებელი ძალა" },
    27: { en: "The Corners of the Mouth (Nourishment)", ka: "პირის კუთხეები (საკვები)" },
    28: { en: "Preponderance of the Great", ka: "დიდის უპირატესობა" },
    29: { en: "The Abysmal (Water)", ka: "უფსკრული (წყალი)" },
    30: { en: "The Clinging (Fire)", ka: "მიჯაჭვულობა (ცეცხლი)" },
    31: { en: "Influence (Wooing)", ka: "გავლენა (შეცდენა)" },
    32: { en: "Duration", ka: "ხანგრძლივობა" },
    33: { en: "Retreat", ka: "უკან დახევა" },
    34: { en: "The Power of the Great", ka: "დიდის ძალა" },
    35: { en: "Progress", ka: "პროგრესი" },
    36: { en: "Darkening of the Light", ka: "სინათლის დაბნელება" },
    37: { en: "The Family (The Clan)", ka: "ოჯახი (კლანი)" },
    38: { en: "Opposition", ka: "ოპოზიცია" },
    39: { en: "Obstruction", ka: "დაბრკოლება" },
    40: { en: "Deliverance", ka: "განთავისუფლება" },
    41: { en: "Decrease", ka: "შემცირება" },
    42: { en: "Increase", ka: "ზრდა" },
    43: { en: "Break-through (Resoluteness)", ka: "გარღვევა (გადაწყვეტილება)" },
    44: { en: "Coming to Meet", ka: "შესახვედრად მოსვლა" },
    45: { en: "Gathering Together (Massing)", ka: "შეკრება (მასირება)" },
    46: { en: "Pushing Upward", ka: "ზემოთ ასვლა" },
    47: { en: "Oppression (Exhaustion)", ka: "ჩაგვრა (გამოფიტვა)" },
    48: { en: "The Well", ka: "ჭა" },
    49: { en: "Revolution (Molting)", ka: "რევოლუცია (ცვლა)" },
    50: { en: "The Cauldron", ka: "ქვაბი" },
    51: { en: "The Arousing (Shock, Thunder)", ka: "გამოღვიძება (შოკი, ჭექა-ქუხილი)" },
    52: { en: "Keeping Still (Mountain)", ka: "უძრაობა (მთა)" },
    53: { en: "Development (Gradual Progress)", ka: "განვითარება (თანდათანობითი პროგრესი)" },
    54: { en: "The Marrying Maiden", ka: "გათხოვების ქალწული" },
    55: { en: "Abundance (Fullness)", ka: "სიუხვე (სისრულე)" },
    56: { en: "The Wanderer", ka: "მოხეტიალე" },
    57: { en: "The Gentle (The Penetrating, Wind)", ka: "ნაზი (შემღწევი, ქარი)" },
    58: { en: "The Joyous (Lake)", ka: "მხიარული (ტბა)" },
    59: { en: "Dispersion (Dissolution)", ka: "გაფანტვა (დაშლა)" },
    60: { en: "Limitation", ka: "შეზღუდვა" },
    61: { en: "Inner Truth", ka: "შინაგანი სიმართლე" },
    62: { en: "Preponderance of the Small", ka: "პატარას უპირატესობა" },
    63: { en: "After Completion", ka: "დასრულების შემდეგ" },
    64: { en: "Before Completion", ka: "დასრულებამდე" },
};

// Text content for different languages - MOVED OUTSIDE App COMPONENT
const texts = {
    en: {
        appTitle: 'THiA',
        tarotTitle: 'TaroT',
        palmistryTitle: 'HenD',
        iChingTitle: 'i ChinG',
        astronomyTitle: 'AstrO',
        tarotImageText: 'Tarot',
        palmistryImageText: 'Human Hand',
        iChingImageText: 'I Ching Coins',
        astronomyImageText: 'Stars and Planets',
        scanTarot: 'Scan Tarot Card',
        scanPalm: 'Scan Palm',
        tossCoins: 'Toss Coins',
        generatingReport: 'Generating Report...',
        reportTitle: 'Your Report',
        close: 'Close',
        tarotUpright: 'Upright',
        tarotReversed: 'Reversed',
        palmistryScanPrompt: `Analyze the provided left palm image for potential prognosis and the right palm image for the real situation. Provide a professional palmistry report (10-15 sentences) based on common interpretations of major lines (heart, head, life) for the current situation and predictions for the next 2-3 years. Also, analyze the differences between the left and right palms to interpret what should have been versus what changed based on events.`,
        iChingPrompt: (hexagramNum, hexagramName) => `Hexagram ${hexagramNum}: ${hexagramName}. Provide a professional I Ching report (5-10 sentences) based on its general meaning.`,
        tarotPrompt: (cardName, orientation, firstLineDescription) => `Provide a professional tarot report (10-15 sentences) for the ${cardName} card from the Rider-Waite Tarot deck, considering it is ${orientation}. Start the report with: "${firstLineDescription}". Then, include common interpretations for its meaning in love, career, and general life aspects, consistent with traditional Rider-Waite meanings.`,
        astronomyPrompt: (birthDate, birthTime, location) => `Generate an astrological report based on the birth date ${birthDate}${birthTime ? ` and time ${birthTime}` : ''}${location ? ` in ${location}` : ''}. Focus on predictions for the current week and the current year based on common astrological interpretations. Provide a professional report (10-15 sentences).`,
        reportError: 'Failed to generate report. Please try again.',
        uploadImage: 'Upload Image',
        selectImage: 'Select Image',
        reUploadImage: 'Re-upload Image',
        backToMainMenu: 'Back to Main Menu',
        imageInstructions: 'Upload an image of the card/hand for analysis.',
        cameraInstructions: 'Position the card/hand in front of the camera and capture a photo.',
        scanningSimulated: 'Note: Card/palm recognition is simulated. The report is generated based on a general prompt and randomly selected card/orientation.',
        yourHexagram: 'Your Hexagram:',
        hexagramNumber: 'Hexagram Number:',
        iChingImageInstructions: 'Analyze the provided image. If clear numbers (0-9) are present, interpret each even number as a Yin line and each odd number as a Yang line, forming a hexagram from bottom to top or left to right. If no explicit numbers, but clear horizontal lines are present, interpret them as hexagram lines (e.g., solid for Yang, broken for Yin) to form a hexagram. Then, provide a professional I Ching report (5-10 sentences) based on this derived hexagram. If neither numbers nor clear lines are detectable, interpret the image\'s general content in the context of an I Ching question and provide a report based on its potential connection to I Ching principles.',
        generateReport: 'Generate Report',
        scanWithCamera: 'Scan with Camera',
        reset: 'Reset',
        nextStep: 'Next Step',
        tossCoinStep: (step) => `Toss Coin (Step ${step} of 6)`,
        thinkOfCard: 'Think of a Card',
        cameraPermissionDenied: 'Camera access denied. Please enable camera permissions in your browser settings.',
        cameraNotAvailable: 'Camera not found or inaccessible.',
        selectCamera: 'Select Camera',
        capturePhoto: 'Capture Photo',
        retakePhoto: 'Retake Photo',
        birthDate: 'Birth Date',
        birthTime: 'Birth Time (Optional)',
        generateAstrologyReport: 'Generate Astrology Report',
        locationLabel: 'Location (City, Optional)',
        locationPlaceholder: 'e.g., Tbilisi, New York',
        cameraReady: 'Camera is ready to capture photo.',
        selectCard: 'Select Card',
        cardName: 'Card Name',
        orientation: 'Orientation',
        uploadLeftPalm: 'Upload Left Palm',
        uploadRightPalm: 'Upload Right Palm',
        reUploadLeftPalm: 'Re-upload Left Palm',
        reUploadRightPalm: 'Re-upload Right Palm',
        palmistryInstructions: 'Upload images of your left and right palms for a comprehensive analysis.',
        bothPalmsRequired: 'Please upload images for both left and right palms to generate the report.',
    },
    ka: {
        appTitle: 'THiA',
        tarotTitle: 'TaroT',
        palmistryTitle: 'HenD',
        iChingTitle: 'i ChinG',
        astronomyTitle: 'AstrO',
        tarotImageText: 'ტარო',
        palmistryImageText: 'ხელისგული',
        iChingImageText: 'I Ching Coins',
        astronomyImageText: 'ვარსკვლავები და პლანეტები',
        scanTarot: 'ტაროს კარტის დასკანერება',
        scanPalm: 'ხელისგულის დასკანერება',
        tossCoins: 'მონეტების აგდება',
        generatingReport: 'რეპორტის გენერირება...',
        reportTitle: 'თქვენი რეპორტი',
        close: 'დახურვა',
        tarotUpright: 'სწორად',
        tarotReversed: 'ამოტრიალებული',
        palmistryScanPrompt: `გაანალიზეთ მოწოდებული მარცხენა ხელისგულის სურათი პოტენციური პროგნოზისთვის და მარჯვენა ხელისგულის სურათი რეალური სიტუაციისთვის. მოგვაწოდეთ პროფესიონალური ქირომანტიის რეპორტი (10-15 წინადადება) ძირითადი ხაზების (გულის, თავის, სიცოცხლის) საერთო ინტერპრეტაციების საფუძველზე მიმდინარე სიტუაციისთვის და პროგნოზებზე უახლოესი 2-3 წლისთვის. ასევე, გაანალიზეთ განსხვავებები მარცხენა და მარჯვენა ხელისგულებს შორის, რათა ინტერპრეტაცია გაუკეთოთ, თუ რა უნდა ყოფილიყო და რა შეიცვალა მოვლენების განვითარების საფუძველზე.`,
        iChingPrompt: (hexagramNum, hexagramName) => `ჰექსაგრამა ${hexagramNum}: ${hexagramName}. მოგვაწოდეთ პროფესიონალური იძინის რეპორტი (5-10 წინადადება) მისი ზოგადი მნიშვნელობის გათვალისწინებით.`,
        tarotPrompt: (cardName, orientation, firstLineDescription) => `მოგვაწოდეთ პროფესიონალური ტაროს რეპორტი (10-15 წინადადება) კარტისთვის "${cardName}" რაიდერ-უეიტის ტაროს კოლოდიდან, იმის გათვალისწინებით, რომ იგი ${orientation}. დაიწყეთ რეპორტით: "${firstLineDescription}". შემდეგ, მოიცავით მისი მნიშვნელობის საერთო ინტერპრეტაციები სიყვარულში, კარიერაში და ზოგად ცხოვრებისეულ ასპექტებში, ტრადიციული რაიდერ-უეიტის მნიშვნელობების შესაბამისად.`,
        astronomyPrompt: (birthDate, birthTime, location) => `შექმენით ასტროლოგიური რეპორტი დაბადების თარიღის ${birthDate}${birthTime ? ` და დროის ${birthTime}` : ''}${location ? ` ქალაქ ${location}-ში` : ''} საფუძველზე. ფოკუსირება მოახდინეთ მიმდინარე კვირისა და მიმდინარე წლის პროგნოზებზე, საერთო ასტროლოგიური ინტერპრეტაციების მიხედვით. მოგვაწოდეთ პროფესიონალური რეპორტი (10-15 წინადადება).`,
        reportError: 'რეპორტის გენერირება ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა.',
        uploadImage: 'სურათის ატვირთვა',
        selectImage: 'სურათის არჩევა',
        reUploadImage: 'სურათის ხელახლა ატვირთვა',
        backToMainMenu: 'მთავარ მენიუში დაბრუნება',
        imageInstructions: 'ატვირთეთ კარტის/ხელის სურათი ანალიზისთვის.',
        cameraInstructions: 'მოათავსეთ კარტი/ხელი კამერის წინ და გადაიღეთ ფოტო.',
        scanningSimulated: 'შენიშვნა: კარტის/ხელის ამოცნობა სიმულირებულია. რეპორტი გენერირდება ზოგადი მოთხოვნის საფუძველზე და შემთხვევით არჩეული კარტის/ორიენტაციის მიხედვით.',
        yourHexagram: 'თქვენი ჰექსაგრამა:',
        hexagramNumber: 'ჰექსაგრამა ნომერი:',
        iChingImageInstructions: 'გაანალიზეთ მოწოდებული სურათი. თუ სურათზე მკაფიო რიცხვებია (მაგ. 0-9), ნებისმიერი ლუწი რიცხვი აღიქვით როგორც ინი (Yin) ხაზი და ნებისმიერი კენტი რიცხვი როგორც იანი (Yang) ხაზი, რათა ჩამოყალიბდეს ჰექსაგრამა ქვემოდან ზემოთ ან მარცხნიდან მარჯვნივ. თუ მკაფიო რიცხვები არ არის, მაგრამ მკაფიო ჰორიზონტალური ხაზებია, მაშინ ისინი აღიქვით როგორც ჰექსაგრამის ხაზები (მაგ. მყარი იანგისთვის, წყვეტილი ინისთვის), რათა ჩამოყალიბდეს ჰექსაგრამა. შემდეგ, მოგვაწოდეთ პროფესიონალური იძინის რეპორტი (5-10 წინადადება) ამ მიღებული ჰექსaგრამის საფუძველზე. თუ არც რიცხვები და არც მკაფიო ხაზები არ არის აღმოჩენილი, მაშინ სურათის ზოგადი შინაარსი გაანალიზეთ იძინის შეკითხვის კონტექსტში და მოგვაწოდეთ რეპორტი იძინის პრინციპებთან მისი პოტენციური კავშირის საფუძველზე.',
        generateReport: 'რეპორტის გენერირება',
        scanWithCamera: 'კამერით სკანირება',
        reset: 'გადატვირთვა',
        nextStep: 'შემდეგი ნაბიჯი',
        tossCoinStep: (step) => `მონეტის აგდება (ნაბიჯი ${step} 6-დან)`,
        thinkOfCard: 'ჩაიფიქრე',
        cameraPermissionDenied: 'კამერაზე წვდომა აკრძალულია. გთხოვთ, ჩართოთ კამერის ნებართვები თქვენი ბრაუზერის პარამეტრებში.',
        cameraNotAvailable: 'კამერა ვერ მოიძებნა ან მიუწვდომელია.',
        selectCamera: 'კამერის არჩევა',
        capturePhoto: 'ფოტოს გადაღება',
        retakePhoto: 'ხელახლა გადაღება',
        birthDate: 'დაბადების თარიღი',
        birthTime: 'დაბადების დრო (არასავალდებულო)',
        generateAstrologyReport: 'ასტროლოგიური რეპორტის გენერირება',
        locationLabel: 'მდებარეობა (ქალაქი, არასავალდებულო)',
        locationPlaceholder: 'მაგ., თბილისი, ნიუ-იორკი',
        cameraReady: 'კამერა მზადაა ფოტოს გადასაღებად.',
        selectCard: 'კარტი',
        cardName: 'კარტის სახელი',
        orientation: 'ორიენტაცია',
        uploadLeftPalm: 'მარცხენა ხელისგულის ატვირთვა',
        uploadRightPalm: 'მარჯვენა ხელისგულის ატვირთვა',
        reUploadLeftPalm: 'მარცხენა ხელისგულის ხელახლა ატვირთვა',
        reUploadRightPalm: 'მარჯვენა ხელისგულის ხელახლა ატვირთვა',
        palmistryInstructions: 'ატვირთეთ მარცხენა და მარჯვენა ხელისგულების სურათები ყოვლისმომცველი ანალიზისთვის.',
        bothPalmsRequired: 'რეპორტის გენერირებისთვის ატვირთეთ როგორც მარცხენა, ასევე მარჯვენა ხელისგული.',
    },
};


// Main App Component
function App() {
    // State for current language ('ka' for Georgian, 'en' for English)
    const [language, setLanguage] = useState('ka');
    // State for current view: 'mainMenu', 'tarotScan', 'palmScan', 'iChingGame', 'astronomy'
    const [currentView, setCurrentView] = useState('mainMenu');
    // State for the generated report text
    const [reportText, setReportText] = useState('');
    // State for showing/hiding the report modal
    const [isLoading, setIsLoading] = useState(false);
    // State for showing/hiding the report modal
    const [showReportModal, setShowReportModal] = useState(false);

    // Console log for App's currentView state
    console.log("App currentView:", currentView);


    // Function to handle language change
    const toggleLanguage = (lang) => {
        setLanguage(lang);
    };

    // Function to generate report using LLM
    const generateLLMReport = async (prompt, images = []) => { // images is now an array of { data: base64, description: string }
        setIsLoading(true);
        setReportText(''); // Clear previous report
        try {
            let parts = [{ text: prompt }];

            // Add image parts if provided
            images.forEach(img => {
                if (img.data) {
                    const mimeTypeMatch = img.data.match(/^data:(.*?);base64,/);
                    const actualMimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/png";
                    parts.push({ text: img.description }); // Add a text part describing the image
                    parts.push({
                        inlineData: {
                            mimeType: actualMimeType,
                            data: img.data.split(',')[1]
                        }
                    });
                }
            });

            const payload = { contents: [{ role: "user", parts: parts }] };
            // IMPORTANT: Replace "" with your actual Gemini API Key.
            // You can get one from Google AI Studio: https://aistudio.google.com/app/apikey
            const apiKey = "AIzaSyBSa-CMW27Pf0HJVIWeunVn-KSMP61SI6c"; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            console.log("Sending request to LLM API:", { payload, apiUrl }); // Log the request payload

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log("LLM API Response Status:", response.status, response.statusText); // Log response status

            const result = await response.json();
            console.log("LLM API Response Body:", result); // Log the full response body

            if (response.ok && result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setReportText(text);
                setShowReportModal(true);
            } else {
                // More specific error message if response is not OK or expected structure is missing
                const errorMessage = result.error && result.error.message ? result.error.message : texts[language].reportError;
                setReportText(`Error: ${errorMessage}`);
                setShowReportModal(true);
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setReportText(`${texts[language].reportError} ${error.message || ''}`);
            setShowReportModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Header Component
    const Header = () => (
        <header className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-indigo-800 text-white shadow-lg rounded-b-xl">
            <h1 className="text-3xl font-extrabold font-inter tracking-wide">{texts[language].appTitle}</h1>
            <div className="flex space-x-2">
                <button
                    onClick={() => toggleLanguage('ka')}
                    className={`p-2 rounded-full transition-all duration-300 ${language === 'ka' ? 'bg-purple-700 ring-2 ring-white' : 'bg-purple-500 hover:bg-purple-600'}`}
                    aria-label="Switch to Georgian"
                >
                    <span role="img" aria-label="Georgia flag">🇬🇪</span>
                </button>
                <button
                    onClick={() => toggleLanguage('en')}
                    className={`p-2 rounded-full transition-all duration-300 ${language === 'en' ? 'bg-purple-700 ring-2 ring-white' : 'bg-purple-500 hover:bg-purple-600'}`}
                    aria-label="Switch to English"
                >
                    <span role="img" aria-label="USA flag">🇺🇸</span>
                </button>
            </div>
        </header>
    );

    // SVG for Tarot Card Silhouette
    const TarotCardSVG = () => (
        <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="16" width="80" height="96" rx="8" fill="#8a2be2"/>
            <rect x="24" y="16" width="80" height="96" rx="8" stroke="#ffffff" strokeWidth="4"/>
        </svg>
    );

    // SVG for Hand Silhouette (simplified)
    const HandSVG = () => (
        <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64 16 C44 16 28 32 28 52 C28 72 44 88 64 88 C84 88 100 72 100 52 C100 32 84 16 64 16Z" fill="#8a2be2"/>
            <path d="M64 16 C44 16 28 32 28 52 C28 72 44 88 64 88 C84 88 100 72 100 52 C100 32 84 16 64 16Z" stroke="#ffffff" strokeWidth="4"/>
            {/* Simplified fingers */}
            <rect x="58" y="80" width="12" height="24" rx="4" fill="#8a2be2" stroke="#ffffff" strokeWidth="2"/>
            <rect x="42" y="76" width="12" height="28" rx="4" fill="#8a2be2" stroke="#ffffff" strokeWidth="2"/>
            <rect x="74" y="76" width="12" height="28" rx="4" fill="#8a2be2" stroke="#ffffff" strokeWidth="2"/>
            <rect x="88" y="80" width="12" height="24" rx="4" fill="#8a2be2" stroke="#ffffff" strokeWidth="2"/>
            <rect x="28" y="70" width="12" height="20" rx="4" transform="rotate(-30 28 70)" fill="#8a2be2" stroke="#ffffff" strokeWidth="2"/>
        </svg>
    );

    // SVG for Three Coins Silhouette
    const CoinsSVG = () => (
        <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="64" cy="40" r="20" fill="#8a2be2" stroke="#ffffff" strokeWidth="4"/>
            <circle cx="40" cy="80" r="20" fill="#8a2be2" stroke="#ffffff" strokeWidth="4"/>
            <circle cx="88" cy="80" r="20" fill="#8a2be2" stroke="#ffffff" strokeWidth="4"/>
        </svg>
    );

    // SVG for Astronomy (simplified star/planet)
    const AstronomySVG = () => (
        <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="64" cy="64" r="40" fill="#8a2be2"/>
            <path d="M64 24L72 48L96 56L72 64L64 88L56 64L32 56L56 48L64 24Z" fill="#ffffff"/>
            <circle cx="90" cy="38" r="8" fill="#ffffff"/>
            <circle cx="38" cy="90" r="6" fill="#ffffff"/>
        </svg>
    );


    // Main Menu Component
    const MainMenu = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 max-w-6xl mx-auto">
            {/* Tarot Card */}
            <button
                onClick={() => setCurrentView('tarotScan')}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-300 hover:border-purple-500 group"
            >
                <div className="w-32 h-32 mb-4 flex items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                    <TarotCardSVG />
                </div>
                {/* Text directly on the button */}
                <span className="text-2xl font-bold text-purple-800 group-hover:text-purple-900 transition-colors duration-300">{texts[language].tarotTitle}</span>
            </button>

            {/* Palmistry */}
            <button
                onClick={() => setCurrentView('palmScan')}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-300 hover:border-purple-500 group"
            >
                <div className="w-32 h-32 mb-4 flex items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                    <HandSVG />
                </div>
                {/* Text directly on the button */}
                <span className="text-2xl font-bold text-purple-800 group-hover:text-purple-900 transition-colors duration-300">{texts[language].palmistryTitle}</span>
            </button>

            {/* I Ching */}
            <button
                onClick={() => setCurrentView('iChingGame')}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-300 hover:border-purple-500 group"
            >
                <div className="w-32 h-32 mb-4 flex items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                    <CoinsSVG />
                </div>
                {/* Text directly on the button */}
                <span className="text-2xl font-bold text-purple-800 group-hover:text-purple-900 transition-colors duration-300">{texts[language].iChingTitle}</span>
            </button>

            {/* Astronomy - New Button */}
            <button
                onClick={() => setCurrentView('astronomy')}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-300 hover:border-purple-500 group"
            >
                <div className="w-32 h-32 mb-4 flex items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                    <AstronomySVG />
                </div>
                <span className="text-2xl font-bold text-purple-800 group-hover:text-purple-900 transition-colors duration-300">{texts[language].astronomyTitle}</span>
            </button>
        </div>
    );

    // Common component for Camera/Upload functionality (Camera parts remain for potential future use by other modules, but Palmistry will not use it)
    const MediaInputComponent = ({ type, onComplete, onBack, instructions, simulatedNote, scanMethod, setScanMethod }) => {
        const videoRef = useRef(null);
        const canvasRef = useRef(null);
        const fileInputRef = useRef(null);

        const [stream, setStream] = useState(null);
        const [capturedImage, setCapturedImage] = useState(null);
        const [mediaError, setMediaError] = useState(''); // Unified error state for camera/upload
        const [videoDevices, setVideoDevices] = useState([]); // List of available cameras
        const [selectedDeviceId, setSelectedDeviceId] = useState(''); // Currently selected camera
        const [isCameraReady, setIsCameraReady] = useState(false); // New state for camera readiness

        // Console log for MediaInputComponent's state
        console.log("MediaInputComponent scanMethod:", scanMethod, "isCameraReady:", isCameraReady, "mediaError:", mediaError, "stream:", !!stream);


        // --- Camera Functions ---
        const startCamera = useCallback(async (deviceIdToUse) => {
            console.log("startCamera: Function called with deviceId:", deviceIdToUse);
            setMediaError('');
            setCapturedImage(null); // Clear any previous captured image
            setIsCameraReady(false); // Reset camera ready state
            if (stream) { // Stop existing stream if any
                console.log("startCamera: Stopping existing stream.");
                stream.getTracks().forEach(track => track.stop());
                setStream(null); // Clear stream state to ensure new stream is set
            }

            // Check if mediaDevices API is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                const errorMsg = texts[language].cameraNotAvailable + " (API not supported in this browser/environment).";
                setMediaError(errorMsg);
                console.error("startCamera Error:", errorMsg);
                return;
            }

            console.log("startCamera: Attempting to get user media...");
            try {
                const constraints = {
                    video: deviceIdToUse ? { deviceId: { exact: deviceIdToUse } } : true
                };
                console.log("startCamera: Calling getUserMedia with constraints:", constraints);
                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                console.log("startCamera: getUserMedia successful, stream obtained.");
                setStream(mediaStream); // Set stream state here
            } catch (err) {
                console.error('startCamera Error: getUserMedia failed.', err);
                // Ensure camera resources are released on error
                if (stream) { // Check if stream exists before trying to stop
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
                let errorMessageDetail = err.message || err.name;
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setMediaError(texts[language].cameraPermissionDenied + " " + errorMessageDetail);
                    console.error("startCamera Error: Permission denied.", err);
                } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
                    setMediaError(texts[language].cameraNotAvailable + `: ${errorMessageDetail}`);
                    console.error("startCamera Error: Camera not found or constraints not met.", err);
                } else if (err.name === 'NotReadableError') {
                    setMediaError(texts[language].reportError + " (კამერა უკვე გამოიყენება სხვა აპლიკაციის მიერ ან მიუწვდომელია). " + errorMessageDetail);
                    console.error("startCamera Error: Camera already in use or hardware error.", err);
                } else {
                    setMediaError(texts[language].reportError + `: ${errorMessageDetail}`);
                    console.error("startCamera Error: Unknown getUserMedia error.", err);
                }
            }
        }, [stream, language, setMediaError, setCapturedImage, setStream]); // eslint-disable-next-line react-hooks/exhaustive-deps

        const stopCamera = useCallback(() => {
            console.log("stopCamera: Stopping camera stream.");
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null); // Clear stream state
            }
            setIsCameraReady(false); // Reset camera ready state on stop
        }, [stream]);

        const capturePhoto = () => {
            console.log("capturePhoto: Attempting to capture photo.");
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;

                // Check if video is ready and has valid dimensions
                // readyState 2: HAVE_CURRENT_DATA - enough data to play current frame
                // readyState 3: HAVE_FUTURE_DATA - enough data to play current and future frames
                // readyState 4: HAVE_ENOUGH_DATA - enough data to play to the end without interruption
                if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
                    console.error("capturePhoto Error: Video stream not ready or has invalid dimensions. readyState:", video.readyState, "width:", video.videoWidth, "height:", video.videoHeight);
                    setMediaError(texts[language].reportError + " (კამერის ნაკადი არ არის მზად ან არასწორი ზომები აქვს. სცადეთ ხელახლა).");
                    return;
                }

                const context = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/png');
                setCapturedImage(imageData);
                stopCamera();
                console.log("capturePhoto: Photo captured and stream stopped.");
            } else {
                console.warn("capturePhoto Warning: videoRef or canvasRef not ready.");
                setMediaError(texts[language].reportError + " (კამერის კომპონენტები არ არის მზად).");
            }
        };

        const retakePhoto = () => {
            console.log("retakePhoto: Retaking photo.");
            setCapturedImage(null);
            setMediaError('');
            setIsCameraReady(false); // Reset camera ready state
            startCamera(selectedDeviceId);
        };

        // Effect to enumerate cameras
        const getCameras = useCallback(async () => {
            console.log("getCameras: Enumerating camera devices.");
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
                setVideoDevices(videoInputDevices);
                console.log("getCameras: Found video input devices:", videoInputDevices);
                if (videoInputDevices.length > 0) {
                    // Try to select a 'back' camera first, then 'front', otherwise the first one
                    const backCamera = videoInputDevices.find(device =>
                        device.label.toLowerCase().includes('back') ||
                        device.label.toLowerCase().includes('environment')
                    );
                    const frontCamera = videoInputDevices.find(device =>
                        device.label.toLowerCase().includes('front') ||
                        device.label.toLowerCase().includes('user')
                    );

                    if (backCamera) {
                        setSelectedDeviceId(backCamera.deviceId);
                        console.log("getCameras: Selected back camera:", backCamera.label);
                    } else if (frontCamera) {
                        setSelectedDeviceId(frontCamera.deviceId);
                        console.log("getCameras: Selected front camera:", frontCamera.label);
                    } else {
                        setSelectedDeviceId(videoInputDevices[0].deviceId);
                        console.log("getCameras: Selected first camera:", videoInputDevices[0].label);
                    }
                } else {
                    // If no devices found by enumerateDevices, still try to start camera with generic constraints
                    setMediaError(texts[language].cameraNotAvailable + " (არცერთი კამერა არ მოიძებნა).");
                    console.warn("getCameras Warning: No video input devices found. Attempting generic camera access.");
                    // Do NOT set selectedDeviceId here, keep it empty to trigger generic getUserMedia
                }
            } catch (err) {
                console.error('getCameras Error: Error enumerating devices:', err);
                setMediaError(texts[language].cameraNotAvailable + `: ${err.message || err.name}`);
            }
        }, [language]); // eslint-disable-next-line react-hooks/exhaustive-deps


        useEffect(() => {
            if (scanMethod === 'camera') { // Only enumerate if camera method is chosen
                console.log("MediaInputComponent useEffect (scanMethod): scanMethod is camera.");
                // Always try to get cameras first to populate dropdown, then start camera
                getCameras();
            }
            return () => {
                console.log("MediaInputComponent useEffect (cleanup): Cleaning up camera stream on unmount or scanMethod change.");
                stopCamera();
            };
        }, [scanMethod, stopCamera, getCameras]);

        // Effect to start camera when selectedDeviceId changes or if no specific device is selected
        useEffect(() => {
            // Start camera if a device is selected, OR if no specific device is selected but we are in camera mode (fallback)
            if (scanMethod === 'camera' && (selectedDeviceId || videoDevices.length === 0)) {
                console.log("MediaInputComponent useEffect (selectedDeviceId/fallback): selectedDeviceId changed or no devices found, attempting to start camera.");
                startCamera(selectedDeviceId); // selectedDeviceId will be empty string if no specific device was found by enumerateDevices
            }
        }, [selectedDeviceId, videoDevices.length, scanMethod, startCamera]);


        // UPDATED useEffect for video element management (attaching stream and playing)
        useEffect(() => {
            const videoElement = videoRef.current;
            
            // If video element is not available or no stream, do cleanup and exit.
            if (!videoElement) {
                console.log("useEffect [videoRef, stream]: videoElement is null or not ready.");
                // Ensure any existing stream is stopped if the ref becomes null unexpectedly
                if (stream) {
                    console.log("useEffect [videoRef, stream]: videoElement null, stopping active stream.");
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
                setIsCameraReady(false);
                return;
            }

            // If a stream exists, try to attach and play it.
            if (stream) {
                console.log("useEffect [videoRef, stream]: Stream is available, attempting to attach and play.");
                videoElement.srcObject = stream;
                videoElement.muted = true;
                videoElement.playsInline = true; // Important for mobile autoplay

                // Attempt to play the video. This returns a Promise.
                const playPromise = videoElement.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Playback started successfully
                        console.log("useEffect [videoRef, stream]: Video playback started successfully.");
                        setIsCameraReady(true);
                    }).catch(error => {
                        // Playback failed (e.g., autoplay policy, user gesture required)
                        console.error("useEffect [videoRef, stream] Error: Video playback failed.", error);
                        setMediaError(texts[language].reportError + ` (ვიდეოს დაკვრა დაბლოკილია. სცადეთ ხელახლა ან შეამოწმეთ ბრაუზერის პარამეტრები: ${error.message || error.name})`);
                        // Stop the stream to release camera resources if playback fails
                        if (stream) {
                            console.log("useEffect [videoRef, stream]: Playback failed, stopping stream.");
                            stream.getTracks().forEach(track => track.stop());
                            setStream(null); // Clear stream state
                        }
                        setIsCameraReady(false);
                    });
                } else {
                    // Fallback for browsers that don't return a Promise from play() (very old, unlikely)
                    console.warn("useEffect [videoRef, stream]: videoElement.play() did not return a Promise. Assuming immediate play.");
                    setIsCameraReady(true); // Assume it's ready if no promise
                }
            } else {
                // If stream is null, ensure video element is completely reset
                console.log("useEffect [videoRef, stream]: Stream is null, ensuring video element is reset.");
                if (videoElement.srcObject) {
                    console.log("useEffect [videoRef, stream]: Clearing existing srcObject.");
                    videoElement.srcObject.getTracks().forEach(track => track.stop());
                    videoElement.srcObject = null;
                }
                setIsCameraReady(false);
            }

            // Cleanup function for when this effect re-runs or component unmounts
            return () => {
                console.log("useEffect [videoRef, stream] cleanup: Running cleanup for video element.");
                // Ensure video element is stopped and srcObject is cleared
                if (videoElement && videoElement.srcObject) {
                    console.log("useEffect [videoRef, stream] cleanup: Stopping tracks and clearing srcObject.");
                    videoElement.srcObject.getTracks().forEach(track => track.stop());
                    videoElement.srcObject = null;
                }
                // Also ensure the stream state is cleared if it's still set
                if (stream) {
                    console.log("useEffect [videoRef, stream] cleanup: Clearing stream state.");
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
                setIsCameraReady(false);
            };
        }, [videoRef, stream, language, setMediaError, setStream]); // eslint-disable-next-line react-hooks/exhaustive-deps


        // --- Upload Functions ---
        const handleFileChange = (event) => {
            console.log("handleFileChange: File input changed.");
            const file = event.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    setMediaError('Please upload an image file (e.g., JPEG, PNG).');
                    setCapturedImage(null);
                    console.warn("handleFileChange Warning: Non-image file selected.");
                    return;
                }
                setMediaError('');
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCapturedImage(reader.result);
                    console.log("handleFileChange: Image loaded from file.");
                };
                reader.onerror = () => {
                    setMediaError('Failed to read image file.');
                    setCapturedImage(null);
                    console.error("handleFileChange Error: Failed to read image file.");
                };
                reader.readAsDataURL(file);
            } else {
                setCapturedImage(null);
                console.log("handleFileChange: No file selected.");
            }
        };

        const triggerFileInput = () => {
            console.log("triggerFileInput: Triggering file input click.");
            fileInputRef.current.click();
        };

        const reUploadImage = () => {
            console.log("reUploadImage: Re-uploading image.");
            setCapturedImage(null);
            setMediaError('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        // --- Render Logic ---
        const renderCameraScan = () => (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl max-w-lg mx-auto my-8 w-full">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{type === 'tarot' ? texts[language].tarotTitle : texts[language].palmistryTitle}</h2>
                <p className="text-lg text-gray-700 mb-4 text-center">{texts[language].cameraInstructions}</p>
                <p className="text-sm text-gray-500 mb-6 text-center italic">{simulatedNote}</p>

                {mediaError && (
                    <div className="text-red-600 mb-4 text-center font-semibold">{mediaError}</div>
                )}

                {/* New: Camera Ready message */}
                {!capturedImage && !mediaError && isCameraReady && (
                    <div className="text-green-600 mb-4 text-center font-semibold animate-pulse">
                        {texts[language].cameraReady}
                    </div>
                )}

                {/* Only show camera selection if more than one camera is detected */}
                {videoDevices.length > 1 && (
                    <div className="mb-4 w-full max-w-xs">
                        <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700 mb-2">
                            {texts[language].selectCamera}:
                        </label>
                        <select
                            id="camera-select"
                            value={selectedDeviceId}
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        >
                            {videoDevices.map(device => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Camera ${device.deviceId.substring(0, 8)}...`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Video element is now hidden */}
                <video ref={videoRef} className="w-full h-auto rounded-lg shadow-md mb-4 bg-gray-200" autoPlay playsInline muted controls style={{ display: 'none' }}></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* Hidden canvas for capturing image */}

                {!capturedImage ? (
                    <button
                        onClick={capturePhoto}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
                        disabled={isLoading || !!mediaError || !stream || !isCameraReady} // Disable if not ready
                    >
                        {texts[language].capturePhoto}
                    </button>
                ) : (
                    <>
                        <img src={capturedImage} alt="Captured Media" className="w-full h-auto rounded-lg shadow-md mb-4 border-2 border-purple-400" />
                        <div className="flex space-x-4 mb-4">
                            <button
                                onClick={retakePhoto}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {texts[language].retakePhoto}
                            </button>
                            <button
                                onClick={() => onComplete(capturedImage, 'camera')} // Pass image data and method to onComplete
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? texts[language].generatingReport : texts[language].generateReport}
                            </button>
                        </div>
                    </>
                )}
                
                <button
                    onClick={() => { setScanMethod('initial'); stopCamera(); setCapturedImage(null); setMediaError(''); }}
                    className="mt-6 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].backToMainMenu}
                </button>
            </div>
        );

        const renderUploadScan = () => (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl max-w-lg mx-auto my-8 w-full">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{type === 'tarot' ? texts[language].tarotTitle : texts[language].palmistryTitle}</h2>
                <p className="text-lg text-gray-700 mb-4 text-center">{texts[language].imageInstructions}</p>
                <p className="text-sm text-gray-500 mb-6 text-center italic">{simulatedNote}</p>

                {mediaError && (
                    <div className="text-red-600 mb-4 text-center font-semibold">{mediaError}</div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" // Hide the default file input
                />

                {!capturedImage ? (
                    <button
                        onClick={triggerFileInput}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
                        disabled={isLoading}
                    >
                        {texts[language].selectImage}
                    </button>
                ) : (
                    <>
                        <img src={capturedImage} alt="Uploaded Media" className="w-full h-auto rounded-lg shadow-md mb-4 border-2 border-purple-400" />
                        <div className="flex space-x-4 mb-4">
                            <button
                                onClick={reUploadImage}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {texts[language].reUploadImage}
                            </button>
                            <button
                                onClick={() => onComplete(capturedImage, 'upload')} // Pass image data and method to onComplete
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? texts[language].generatingReport : texts[language].generateReport}
                            </button>
                        </div>
                    </>
                )}
                
                <button
                    onClick={() => { setScanMethod('initial'); setCapturedImage(null); setMediaError(''); }}
                    className="mt-6 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].backToMainMenu}
                </button>
            </div>
        );

        if (scanMethod === 'camera') {
            return renderCameraScan();
        } else if (scanMethod === 'upload') {
            return renderUploadScan();
        }
        // Initial choice is handled by the parent component (TarotScanner/PalmScanner)
        return null;
    };


    // Tarot Scanner Component (now uses MediaInputComponent)
    const TarotScanner = () => {
        const [tarotScanMode, setTarotScanMode] = useState('initial'); // 'initial', 'upload', 'think', 'manualInput'
        const [manualCardName, setManualCardName] = useState('');
        const [manualOrientation, setManualOrientation] = useState('upright'); // 'upright' or 'reversed'

        const handleGenerateTarotReport = (imageData = null, method = 'think') => {
            let prompt;
            if (method === 'think') {
                const randomCardData = majorArcanaTarotCards[Math.floor(Math.random() * majorArcanaTarotCards.length)];
                const randomCardNameEn = randomCardData.en;
                const randomCardNameKa = randomCardData.ka;
                const isUpright = Math.random() > 0.5;
                const orientation = isUpright ? texts[language].tarotUpright : texts[language].tarotReversed;
                const firstLineDescription = cardDescriptions[randomCardNameEn][language];
                prompt = texts[language].tarotPrompt(
                    language === 'en' ? randomCardNameEn : randomCardNameKa,
                    orientation,
                    firstLineDescription
                );
                generateLLMReport(prompt, []); // No image for 'think'
            } else if (method === 'manualInput') {
                if (!manualCardName) {
                    setReportText(language === 'en' ? 'Please enter a card name.' : 'გთხოვთ, შეიყვანოთ კარტის სახელი.');
                    setShowReportModal(true);
                    return;
                }
                const selectedCardEn = majorArcanaTarotCards.find(card =>
                    card.en.toLowerCase() === manualCardName.toLowerCase() ||
                    card.ka.toLowerCase() === manualCardName.toLowerCase()
                );

                const cardDisplayName = selectedCardEn ? (language === 'en' ? selectedCardEn.en : selectedCardEn.ka) : manualCardName;
                const firstLineDesc = selectedCardEn ? cardDescriptions[selectedCardEn.en][language] : (language === 'en' ? `The card you selected, ${manualCardName},` : `თქვენს მიერ არჩეული კარტი, ${manualCardName},`);

                prompt = texts[language].tarotPrompt(
                    cardDisplayName,
                    manualOrientation === 'upright' ? texts[language].tarotUpright : texts[language].tarotReversed,
                    firstLineDesc
                );
                generateLLMReport(prompt, []); // No image for manual input
            }
            else if (imageData) {
                // For image-based Tarot, we'll ask the LLM to identify the card and its meaning.
                // This is a simplification; a real app would use image recognition.
                prompt = language === 'en'
                    ? "Analyze the provided image of a Tarot card. Describe the card you see and provide a professional tarot reading (10-15 sentences) for it, including its meaning in love, career, and general life aspects. If you can determine its orientation (upright/reversed), include that in your analysis."
                    : "გაანალიზეთ ტაროს კარტის მოწოდებული სურათი. აღწერეთ კარტი, რომელსაც ხედავთ და მოგვაწოდეთ პროფესიონალური ტაროს განმარტება (10-15 წინადადება), მათ შორის მისი მნიშვნელობა სიყვარულში, კარიერაში და ზოგად ცხოვრებისეულ ასპექტებში. თუ შეგიძლიათ მისი ორიენტაციის დადგენა (სწორად/ამოტრიალებული), ჩართეთ ეს თქვენს ანალიზში.";
                generateLLMReport(prompt, [{ data: imageData, description: 'Tarot card image' }]); // Pass image data as an array
            } else {
                setReportText(texts[language].reportError);
                setShowReportModal(true);
            }
        };

        const renderTarotInitialChoice = () => (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl max-w-lg mx-auto my-8 w-full">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{texts[language].tarotTitle}</h2>
                <div className="flex flex-col space-y-4 w-full max-w-xs">
                    {/* Removed "Scan with Camera" button */}
                    <button
                        onClick={() => setTarotScanMode('upload')}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        {texts[language].uploadImage}
                    </button>
                    <button
                        onClick={() => handleGenerateTarotReport()} // Directly generate report for "Think of a Card"
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? texts[language].generatingReport : texts[language].thinkOfCard}
                    </button>
                    {/* New "Card" button for manual input */}
                    <button
                        onClick={() => setTarotScanMode('manualInput')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        {texts[language].selectCard}
                    </button>
                </div>
                <button
                    onClick={() => { setCurrentView('mainMenu'); setTarotScanMode('initial'); }}
                    className="mt-6 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].backToMainMenu}
                </button>
            </div>
        );

        const renderManualInput = () => (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl max-w-lg mx-auto my-8 w-full">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{texts[language].tarotTitle}</h2>
                <p className="text-lg text-gray-700 mb-4 text-center">
                    {language === 'en' ? 'Enter the Tarot card name and its orientation.' : 'შეიყვანეთ ტაროს კარტის სახელი და მისი ორიენტაცია.'}
                </p>

                <div className="w-full max-w-xs mb-6">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                        {texts[language].cardName}:
                    </label>
                    <input
                        type="text"
                        id="cardName"
                        value={manualCardName}
                        onChange={(e) => setManualCardName(e.target.value)}
                        className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        placeholder={language === 'en' ? 'e.g., The Fool' : 'მაგ., სულელი'}
                        list="tarot-cards" // Add datalist for suggestions
                    />
                    <datalist id="tarot-cards">
                        {majorArcanaTarotCards.map(card => (
                            <option key={card.id} value={language === 'en' ? card.en : card.ka} />
                        ))}
                    </datalist>
                </div>

                <div className="w-full max-w-xs mb-8">
                    <label htmlFor="orientation" className="block text-sm font-medium text-gray-700 mb-2">
                        {texts[language].orientation}:
                    </label>
                    <select
                        id="orientation"
                        value={manualOrientation}
                        onChange={(e) => setManualOrientation(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                        <option value="upright">{texts[language].tarotUpright}</option>
                        <option value="reversed">{texts[language].tarotReversed}</option>
                    </select>
                </div>

                <button
                    onClick={() => handleGenerateTarotReport(null, 'manualInput')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
                    disabled={isLoading || !manualCardName}
                >
                    {isLoading ? texts[language].generatingReport : texts[language].generateReport}
                </button>

                <button
                    onClick={() => { setTarotScanMode('initial'); setManualCardName(''); setManualOrientation('upright'); }}
                    className="mt-6 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].backToMainMenu}
                </button>
            </div>
        );


        if (tarotScanMode === 'initial') {
            return renderTarotInitialChoice();
        } else if (tarotScanMode === 'upload') {
            return (
                <MediaInputComponent
                    type="tarot"
                    onComplete={handleGenerateTarotReport}
                    onBack={() => setTarotScanMode('initial')}
                    instructions={texts[language].imageInstructions}
                    simulatedNote={texts[language].scanningSimulated}
                    scanMethod="upload" // Pass the method to MediaInputComponent
                    setScanMethod={setTarotScanMode} // Allow MediaInputComponent to change mode back to initial
                />
            );
        } else if (tarotScanMode === 'manualInput') {
            return renderManualInput();
        }
        return null;
    };

    // Palm Scanner Component (UPDATED for left/right palm upload only)
    const PalmScanner = () => {
        const [leftPalmImage, setLeftPalmImage] = useState(null);
        const [rightPalmImage, setRightPalmImage] = useState(null);
        const leftFileInputRef = useRef(null);
        const rightFileInputRef = useRef(null);
        const [mediaError, setMediaError] = useState(''); // Local error state for palmistry uploads

        // Handle file change for left palm
        const handleLeftFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    setMediaError('Please upload an image file (e.g., JPEG, PNG) for the left palm.');
                    setLeftPalmImage(null);
                    return;
                }
                setMediaError('');
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLeftPalmImage(reader.result);
                };
                reader.onerror = () => {
                    setMediaError('Failed to read left palm image file.');
                    setLeftPalmImage(null);
                };
                reader.readAsDataURL(file);
            } else {
                setLeftPalmImage(null);
            }
        };

        // Handle file change for right palm
        const handleRightFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    setMediaError('Please upload an image file (e.g., JPEG, PNG) for the right palm.');
                    setRightPalmImage(null);
                    return;
                }
                setMediaError('');
                const reader = new FileReader();
                reader.onloadend = () => {
                    setRightPalmImage(reader.result);
                };
                reader.onerror = () => {
                    setMediaError('Failed to read right palm image file.');
                    setRightPalmImage(null);
                };
                reader.readAsDataURL(file);
            } else {
                setRightPalmImage(null);
            }
        };

        // Trigger file input click for left palm
        const triggerLeftFileInput = () => {
            leftFileInputRef.current.click();
        };

        // Trigger file input click for right palm
        const triggerRightFileInput = () => {
            rightFileInputRef.current.click();
        };

        // Re-upload for left palm
        const reUploadLeftImage = () => {
            setLeftPalmImage(null);
            setMediaError('');
            if (leftFileInputRef.current) {
                leftFileInputRef.current.value = '';
            }
        };

        // Re-upload for right palm
        const reUploadRightImage = () => {
            setRightPalmImage(null);
            setMediaError('');
            if (rightFileInputRef.current) {
                rightFileInputRef.current.value = '';
            }
        };

        // Generate report for palmistry
        const handleGeneratePalmReport = () => {
            if (!leftPalmImage || !rightPalmImage) {
                setReportText(texts[language].bothPalmsRequired);
                setShowReportModal(true);
                return;
            }

            const prompt = texts[language].palmistryScanPrompt;
            const imagesToSend = [
                { data: leftPalmImage, description: language === 'en' ? 'Left palm image' : 'მარცხენა ხელისგულის სურათი' },
                { data: rightPalmImage, description: language === 'en' ? 'Right palm image' : 'მარჯვენა ხელისგულის სურათი' }
            ];
            generateLLMReport(prompt, imagesToSend);
        };

        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl max-w-lg mx-auto my-8 w-full">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{texts[language].palmistryTitle}</h2>
                <p className="text-lg text-gray-700 mb-4 text-center">{texts[language].palmistryInstructions}</p>
                <p className="text-sm text-gray-500 mb-6 text-center italic">{texts[language].scanningSimulated}</p>

                {mediaError && (
                    <div className="text-red-600 mb-4 text-center font-semibold">{mediaError}</div>
                )}

                {/* Left Palm Upload Section */}
                <div className="w-full max-w-xs mb-6">
                    <input
                        type="file"
                        accept="image/*"
                        ref={leftFileInputRef}
                        onChange={handleLeftFileChange}
                        className="hidden"
                    />
                    {!leftPalmImage ? (
                        <button
                            onClick={triggerLeftFileInput}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full"
                            disabled={isLoading}
                        >
                            {texts[language].uploadLeftPalm}
                        </button>
                    ) : (
                        <div className="flex flex-col items-center">
                            <img src={leftPalmImage} alt="Left Palm" className="w-48 h-auto rounded-lg shadow-md mb-2 border-2 border-blue-400" />
                            <button
                                onClick={reUploadLeftImage}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {texts[language].reUploadLeftPalm}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Palm Upload Section */}
                <div className="w-full max-w-xs mb-8">
                    <input
                        type="file"
                        accept="image/*"
                        ref={rightFileInputRef}
                        onChange={handleRightFileChange}
                        className="hidden"
                    />
                    {!rightPalmImage ? (
                        <button
                            onClick={triggerRightFileInput}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full"
                            disabled={isLoading}
                        >
                            {texts[language].uploadRightPalm}
                        </button>
                    ) : (
                        <div className="flex flex-col items-center">
                            <img src={rightPalmImage} alt="Right Palm" className="w-48 h-auto rounded-lg shadow-md mb-2 border-2 border-blue-400" />
                            <button
                                onClick={reUploadRightImage}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {texts[language].reUploadRightPalm}
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleGeneratePalmReport}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
                    disabled={isLoading || !leftPalmImage || !rightPalmImage}
                >
                    {isLoading ? texts[language].generatingReport : texts[language].generateReport}
                </button>
                
                <button
                    onClick={() => { setCurrentView('mainMenu'); setLeftPalmImage(null); setRightPalmImage(null); setMediaError(''); }}
                    className="mt-6 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].backToMainMenu}
                </button>
            </div>
        );
    };

    // I Ching Game Component
    const IChingGame = () => {
        const [hexagramLines, setHexagramLines] = useState(Array(6).fill(null)); // Stores each line result
        const [tossCount, setTossCount] = useState(0); // Tracks how many lines have been generated
        const [hexagramNumber, setHexagramNumber] = useState(null);
        const [iChingMethod, setIChingMethod] = useState('initial'); // 'initial', 'toss', 'upload'
        const fileInputRef = useRef(null);
        const [uploadedImage, setUploadedImage] = useState(null);
        const [uploadError, setUploadError] = useState('');

        // --- Upload Functions (specific to I Ching) ---
        const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    setUploadError('Please upload an image file (e.g., JPEG, PNG).');
                    setUploadedImage(null);
                    return;
                }
                setUploadError('');
                const reader = new FileReader();
                reader.onloadend = () => {
                    setUploadedImage(reader.result);
                };
                reader.onerror = () => {
                    setUploadError('Failed to read image file.');
                    setUploadedImage(null);
                };
                reader.readAsDataURL(file);
            } else {
                setUploadedImage(null);
            }
        };

        const triggerFileInput = () => {
            fileInputRef.current.click();
        };

        const reUploadImage = () => {
            setUploadedImage(null);
            setUploadError('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        // --- Toss Coins Functions ---
        const tossCoin = () => {
            let sum = 0;
            for (let i = 0; i < 3; i++) {
                sum += Math.random() > 0.5 ? 3 : 2; // Heads (3) or Tails (2)
            }
            return sum; // Returns 6, 7, 8, or 9
        };

        const handleTossStep = () => {
            if (tossCount < 6) {
                const newLines = [...hexagramLines];
                newLines[tossCount] = tossCoin(); // Add new line to the current position (bottom-up)
                setHexagramLines(newLines);
                setTossCount(tossCount + 1);
            }
        };

        // Determine hexagram number once all 6 lines are generated
        useEffect(() => {
            if (tossCount === 6) {
                // This is a simplified mapping. A real I Ching mapping is complex.
                // For now, we'll just generate a random number between 1 and 64 for the report.
                setHexagramNumber(Math.floor(Math.random() * 64) + 1);
            }
        }, [tossCount]);

        // This function is called when the "Generate Report" button is clicked for I Ching
        const handleGenerateIChingReport = () => {
            let prompt;
            let imagesToPass = []; // Changed to array

            if (iChingMethod === 'toss' && hexagramNumber) {
                const name = hexagramNames[hexagramNumber] ? hexagramNames[hexagramNumber][language] : (language === 'en' ? `Hexagram ${hexagramNumber}` : `ჰექსაგრამა ${hexagramNumber}`);
                prompt = texts[language].iChingPrompt(hexagramNumber, name);
            } else if (iChingMethod === 'upload' && uploadedImage) {
                prompt = language === 'en'
                    ? texts[language].iChingImageInstructions // Uses the updated prompt
                    : texts[language].iChingImageInstructions; // Uses the updated prompt
                imagesToPass = [{ data: uploadedImage, description: 'I Ching related image' }]; // Pass image data as an array
            } else {
                prompt = texts[language].reportError; // Fallback
            }
            generateLLMReport(prompt, imagesToPass); // Pass image data if available
        };

        const resetIChing = () => {
            setHexagramLines(Array(6).fill(null));
            setTossCount(0);
            setHexagramNumber(null);
            setUploadedImage(null);
            setUploadError('');
            setIChingMethod('initial');
        };

        const renderInitialChoice = () => (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl max-w-md mx-auto my-8">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{texts[language].iChingTitle}</h2>
                {/* Removed the imageInstructions paragraph */}
                <div className="flex flex-col space-y-4 w-full max-w-xs">
                    <button
                        onClick={() => setIChingMethod('toss')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        {texts[language].tossCoins}
                    </button>
                    <button
                        onClick={() => setIChingMethod('upload')}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        {texts[language].uploadImage}
                    </button>
                </div>
                <button
                    onClick={() => { setCurrentView('mainMenu'); resetIChing(); }}
                    className="mt-6 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].backToMainMenu}
                </button>
            </div>
        );

        const renderTossCoins = () => (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl max-w-md mx-auto my-8">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{texts[language].iChingTitle}</h2>
                <p className="text-lg text-gray-700 mb-8 text-center">
                    {texts[language].tossCoinStep(tossCount + 1)}
                </p>
                
                <div className="mt-6 text-center">
                    <p className="text-xl font-semibold text-gray-800 mb-2">
                        {texts[language].yourHexagram}
                    </p>
                    <div className="flex flex-col-reverse items-center space-y-1 my-4">
                        {/* Render hexagram lines based on toss results */}
                        {hexagramLines.map((lineValue, index) => (
                            <div key={index} className="text-4xl font-mono text-purple-700">
                                {lineValue === null ? '-' : // Placeholder for un-tossed lines
                                 lineValue === 6 ? '-- X --' : // Old Yin, changing
                                 lineValue === 7 ? '-----' : // Young Yang, unchanging
                                 lineValue === 8 ? '-- --' : // Young Yin, unchanging
                                 '-- O --' // Old Yang, changing
                                }
                            </div>
                        ))}
                    </div>
                    {tossCount === 6 && hexagramNumber && (
                        <p className="mt-4 text-lg text-gray-700">
                            {texts[language].hexagramNumber} <span className="font-bold text-purple-800">{hexagramNumber}</span>
                        </p>
                    )}
                </div>

                {tossCount < 6 ? (
                    <button
                        onClick={handleTossStep}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-6"
                        disabled={isLoading}
                    >
                        {texts[language].tossCoins}
                    </button>
                ) : (
                    <button
                        onClick={handleGenerateIChingReport}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? texts[language].generatingReport : texts[language].generateReport}
                            </button>
                )}
                
                <button
                    onClick={resetIChing}
                    className="mt-6 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].reset}
                </button>
                <button
                    onClick={() => { setCurrentView('mainMenu'); resetIChing(); }}
                    className="mt-2 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].backToMainMenu}
                </button>
            </div>
        );

        const renderUploadImage = () => (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl max-w-md mx-auto my-8">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{texts[language].iChingTitle}</h2>
                <p className="text-lg text-gray-700 mb-8 text-center">
                    {texts[language].iChingImageInstructions}
                </p>

                {uploadError && (
                    <div className="text-red-600 mb-4 text-center font-semibold">{uploadError}</div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {!uploadedImage ? (
                    <button
                        onClick={triggerFileInput}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
                        disabled={isLoading}
                    >
                        {texts[language].selectImage}
                    </button>
                ) : (
                    <>
                        <img src={uploadedImage} alt="Uploaded I Ching related" className="w-full h-auto rounded-lg shadow-md mb-4 border-2 border-purple-400" />
                        <div className="flex space-x-4 mb-4">
                            <button
                                onClick={reUploadImage}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {texts[language].reUploadImage}
                            </button>
                            <button
                                onClick={handleGenerateIChingReport} // Explicit report button
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? texts[language].generatingReport : texts[language].generateReport}
                            </button>
                        </div>
                    </>
                )}
                
                <button
                    onClick={() => { setIChingMethod('initial'); setUploadedImage(null); setUploadError(''); }}
                    className="mt-6 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].backToMainMenu}
                </button>
            </div>
        );

        if (iChingMethod === 'initial') {
            return renderInitialChoice();
        } else if (iChingMethod === 'toss') {
            return renderTossCoins();
        } else if (iChingMethod === 'upload') {
            return renderUploadImage();
        }
    };

    // New Astronomy Module Component
    const AstronomyModule = () => {
        const [birthDate, setBirthDate] = useState('');
        const [birthTime, setBirthTime] = useState(''); // Optional
        const [location, setLocation] = useState(''); // New state for location

        const handleGenerateAstrologyReport = () => {
            if (!birthDate) {
                setReportText(language === 'en' ? 'Please enter your birth date.' : 'გთხოვთ, შეიყვანოთ თქვენი დაბადების თარიღი.');
                setShowReportModal(true);
                return;
            }
            // Pass all relevant data to the prompt
            const prompt = texts[language].astronomyPrompt(birthDate, birthTime, location);
            generateLLMReport(prompt, []); // No images for astronomy
        };

        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-xl max-w-md mx-auto my-8">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{texts[language].astronomyTitle}</h2>
                <p className="text-lg text-gray-700 mb-8 text-center">
                    {language === 'en' ? 'Enter your birth details to get an astrological report.' : 'შეიყვანეთ თქვენი დაბადების მონაცემები ასტროლოგიური რეპორტის მისაღებად.'}
                </p>

                <div className="w-full max-w-xs mb-6">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                        {texts[language].birthDate}:
                    </label>
                    <input
                        type="date"
                        id="birthDate"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        required
                    />
                </div>

                <div className="w-full max-w-xs mb-6">
                    <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700 mb-2">
                        {texts[language].birthTime}:
                    </label>
                    <input
                        type="time"
                        id="birthTime"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        placeholder="HH:MM (24-hour)" // Added placeholder for 24-hour format
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {language === 'en' ? 'Providing time allows for a more precise prediction.' : 'დროის მითითება უფრო ზუსტი პროგნოზის გაკეთების საშუალებას იძლევა.'}
                    </p>
                </div>

                {/* New Location Input */}
                <div className="w-full max-w-xs mb-8">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        {texts[language].locationLabel}:
                    </label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        placeholder={texts[language].locationPlaceholder}
                    />
                </div>


                <button
                    onClick={handleGenerateAstrologyReport}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-4"
                    disabled={isLoading}
                >
                    {isLoading ? texts[language].generatingReport : texts[language].generateAstrologyReport}
                </button>

                <button
                    onClick={() => { setCurrentView('mainMenu'); setBirthDate(''); setBirthTime(''); setLocation(''); }}
                    className="mt-6 text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold"
                >
                    {texts[language].backToMainMenu}
                </button>
            </div>
        );
    };


    // Report Modal Component
    const ReportModal = ({ reportText, onClose, language, texts }) => (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                <h3 className="text-3xl font-bold text-purple-800 mb-6 border-b-2 pb-2 border-purple-200">{texts[language].reportTitle}</h3>
                <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">{reportText}</p>
                <button
                    onClick={onClose}
                    className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 block mx-auto"
                >
                    {texts[language].close}
                </button>
            </div>
        </div>
    );

    // Render based on current view
    const renderContent = () => {
        switch (currentView) {
            case 'mainMenu':
                return <MainMenu />;
            case 'tarotScan':
                return <TarotScanner />;
            case 'palmScan':
                return <PalmScanner />;
            case 'iChingGame':
                return <IChingGame />;
            case 'astronomy': // New case for astronomy module
                return <AstronomyModule />;
            default:
                return <MainMenu />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 font-inter text-gray-900">
            <Header />
            <main className="container mx-auto py-10">
                {renderContent()}
            </main>
            {showReportModal && (
                <ReportModal
                    reportText={reportText}
                    onClose={() => setShowReportModal(false)}
                    language={language}
                    texts={texts}
                />
            )}
        </div>
    );
}

export default App;