import LogoutButton from "../components/LogOut/LogoutButton";

export default function SidebarWidget() {
  return (
    <div className="sidebar">
      {/* other sidebar items */}
      <div className="mt-auto"> {/* pushes to bottom */}
        <LogoutButton />
      </div>
    </div>
  );
}
