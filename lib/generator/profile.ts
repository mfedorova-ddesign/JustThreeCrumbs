import { UserProfile } from "@/types";

export function isProfileComplete(profile: UserProfile): boolean {
  return (
    profile.age > 0 &&
    profile.weight > 0 &&
    profile.height > 0 &&
    Boolean(profile.gender) &&
    Boolean(profile.condition) &&
    Boolean(profile.dietType) &&
    profile.allergies.length > 0
  );
}
