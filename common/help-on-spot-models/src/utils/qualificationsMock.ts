
interface Qualification {
  key: string;
  name: string;
}

export const qualificationMock: Qualification[] = [
  {
    key: "driversLicence",
    name: "Führerschein"
  },
  {
    key: "physicallyFit",
    name: "körperlich fit"
  },
  {
    key: "medicalEducation",
    name: "medizinische Grundausbildung"
  }
]
