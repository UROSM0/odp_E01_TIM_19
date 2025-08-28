import type { RezultatValidacije } from "../../../types/validation/ValidationResult";

export function validacijaPodatakaAuth(korisnickoIme?: string, lozinka?: string): RezultatValidacije {
  if (!korisnickoIme || !lozinka) {
    return { uspesno: false, poruka: 'Korisnicko ime i loznika su obavezni.' };
  }

  if (korisnickoIme.length < 3) {
    return { uspesno: false, poruka: 'Korisnicko ime mora imati najmanje 3 karaktera.' };
  }

  if (lozinka.length < 6) {
    return { uspesno: false, poruka: 'Lozinka mora imati najmanje 6 karaktera.' };
  }

  if (lozinka.length > 20) {
    return { uspesno: false, poruka: 'Lozinka moze imati najvise 20 karaktera' };
  }

  return { uspesno: true };
}
