export interface RegisterPharmacyDto {
  name: string;
  latitude: number;
  longitude: number;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  password: string;
}
