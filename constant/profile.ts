interface Name {
  full: string;
  first: string;
  last: string;
  /** Short brand / handle used for the logo wordmark and footer credits. */
  brand: string;
}

interface Work {
  /** English fallback used for /llms.txt and metadata; UI reads the i18n catalog. */
  title: string;
  company: string;
}

interface Location {
  city: string;
  state: string;
  country: string;
}

interface Education {
  uni: string;
  location: Location;
}

interface Profile {
  name: Name;
  email: string;
  work: Work;
  education: Education;
  curr_location: Location;
}

export const profile: Profile = {
  name: {
    full: "Pedro Teixeira",
    first: "Pedro",
    last: "Teixeira",
    brand: "pedrotx",
  },

  email: "contato@pedrotx.com.br",

  work: {
    title: "IT & Office Lead",
    company: "",
  },

  education: {
    uni: "Unopar",
    location: {
      city: "Palotina",
      state: "PR",
      country: "Brasil",
    },
  },

  curr_location: {
    city: "Assis Chateaubriand",
    state: "PR",
    country: "Brasil",
  },
};
