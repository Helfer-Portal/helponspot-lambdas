interface Qualification {
    key: string
    name: string
    category?: QualificationCategory

}

enum QualificationCategory {
    LANGUAGE='LANGUAGE',
    DRIVERSLICENSE='DRIVERSLICENSE',
    MEDICAL_EMS='MEDICAL_EMS',
    MEDICAL_HOSPITAL='MEDICAL_HOSPITAL',
    MEDICAL_GERIATRIC='MEDICAL_GERIATRIC',
    LAB='LAB',
    PHARMACY='PHARMACY',
    SOCIAL='SOCIAL',
    CRAFT='CRAFT',
    IT='IT',
    ADMINISTRATION='ADMINISTRATION'
}


export const qualifications: Qualification[] =[
    // LANGUAGE
    {
        key: 'GERMAN',
        name: 'Deutsch',
        category: QualificationCategory.LANGUAGE
    },
    {
        key: 'ENGLISH',
        name: 'Englisch',
        category: QualificationCategory.LANGUAGE
    },
    {
        key: 'FRENCH',
        name: 'Französisch',
        category: QualificationCategory.LANGUAGE
    },
    {
        key: 'SPANISH',
        name: 'Spanisch',
        category: QualificationCategory.LANGUAGE
    },
    {
        key: 'ITALIEN',
        name: 'Italienisch',
        category: QualificationCategory.LANGUAGE
    },
    {
        key: 'TURKISH',
        name: 'Türkisch',
        category: QualificationCategory.LANGUAGE
    },
    {
        key: 'ARABIC',
        name: 'Arabisch',
        category: QualificationCategory.LANGUAGE
    },
    {
        key: 'RUSSIAN',
        name: 'Russisch',
        category: QualificationCategory.LANGUAGE
    },
    //DRIVERSLICENSE
    {
        key: 'B',
        name: 'Führerschein Klasse B',
        category: QualificationCategory.DRIVERSLICENSE
    },
    {
        key: 'B1',
        name: 'Führerschein Klasse B1',
        category: QualificationCategory.DRIVERSLICENSE
    },
    {
        key: 'C',
        name: 'Führerschein Klasse C',
        category: QualificationCategory.DRIVERSLICENSE
    },
    {
        key: 'C1',
        name: 'Führerschein Klasse C1',
        category: QualificationCategory.DRIVERSLICENSE
    },
    {
        key: 'BE',
        name: 'Führerschein Klasse BE',
        category: QualificationCategory.DRIVERSLICENSE
    },
    {
        key: 'D',
        name: 'Führerschein Klasse D',
        category: QualificationCategory.DRIVERSLICENSE
    },
    // MEDICAL (EMS)
    {
        key: 'EMT-B',
        name: 'Rettungshelfer:in',
        category: QualificationCategory.MEDICAL_EMS
    },
    {
        key: 'EMT-I',
        name: 'Rettungssanitäter:in',
        category: QualificationCategory.MEDICAL_EMS
    },
    {
        key: 'EMT-P',
        name: 'Rettungsassistent:in / Notfallsanitäter:in',
        category: QualificationCategory.MEDICAL_EMS
    },
    {
        key: 'EMERGENCY_DOCTOR',
        name: 'Notarzt:ärztin',
        category: QualificationCategory.MEDICAL_EMS
    },
    // Medical (hospital)
    {
        key: 'NURSE',
        name: 'Gesundheits- und Krankenpfleger:in',
        category: QualificationCategory.MEDICAL_HOSPITAL
    },
    {
        key: 'NURSE_ASSISTANT',
        name: 'Pflegehilfskraft',
        category: QualificationCategory.MEDICAL_HOSPITAL
    },
    {
        key: 'DOCTOR',
        name: 'Facharzt',
        category: QualificationCategory.MEDICAL_EMS
    },
    // Geriatic
    {
        key: 'GERIATRIC_NURSE',
        name: 'Altenpfleger:in',
        category: QualificationCategory.MEDICAL_GERIATRIC
    },
    {
        key: 'GERIATRIC_NURSE_ASSISTANT',
        name: 'Altenpfleger:in',
        category: QualificationCategory.MEDICAL_GERIATRIC
    },
    // LAB
    {
        key: 'MTA',
        name: 'MTA',
        category: QualificationCategory.LAB
    },
    {
        key: 'MTLA',
        name: 'MTLA',
        category: QualificationCategory.LAB
    },
    {
        key: 'LAB_ASSISTANT',
        name: 'Chemielaborant:in',
        category: QualificationCategory.LAB
    },
    {
        key: 'MOLECULAR_BIOLOGIST',
        name: 'Molekularbiologe:in',
        category: QualificationCategory.LAB
    },
    // PHARMACY
    {
        key: 'PHARMICIST',
        name: 'Aphotheker:in',
        category: QualificationCategory.PHARMACY
    },
    // SOCIAL
    {
        key: 'TEACHER_ELEMENTARY',
        name: 'Lehrer:in Grundschule',
        category: QualificationCategory.SOCIAL
    },
    {
        key: 'TEACHER',
        name: 'Lehrer:in',
        category: QualificationCategory.SOCIAL
    },
    {
        key: 'EDUCATOR',
        name: 'Erzieher:in',
        category: QualificationCategory.SOCIAL
    },
    // CRAFT
    {
        key: 'MECHANIC',
        name: 'Mechaniker:in',
        category: QualificationCategory.CRAFT
    },
    {
        key: 'CARPENTER',
        name: 'Schreiner:in',
        category: QualificationCategory.CRAFT
    },
    {
        key: 'BRICKLAYER',
        name: 'Maurer:in',
        category: QualificationCategory.CRAFT
    },
    {
        key: 'ELECTRICIAN',
        name: 'Elektriker:in',
        category: QualificationCategory.CRAFT
    },
    // IT
    {
        key: 'ADMIN',
        name: 'Administrator:in',
        category: QualificationCategory.IT
    },
    {
        key: 'IT_SPECIALIST',
        name: 'Fachinformatiker:in',
        category: QualificationCategory.IT
    },
    {
        key: 'COMPUTER_SCIENTIST',
        name: 'Informatiker:in (Hochschule)',
        category: QualificationCategory.IT
    },
    // ADMINISTRATION
    {
        key: 'ACCOUNTING',
        name: 'Buchhalter:in',
        category: QualificationCategory.ADMINISTRATION
    },
    {
        key: 'ACCOUNTING',
        name: 'Buchhalter:in',
        category: QualificationCategory.ADMINISTRATION
    },
    {
        key: 'MANAGEMENT',
        name: 'Projektleiter:in',
        category: QualificationCategory.ADMINISTRATION
    },
]




