import { checkUser } from "@/lib/checkUser";
import HeaderNavigation from "@/components/header-navigation";

export default async function Header() {
  await checkUser();
  return <HeaderNavigation />;
}
