// import {
//   BarChart3,
//   ChevronRight,
//   ClipboardCheck,
//   CreditCard,
//   Home,
//   Settings,
//   Users,
//   UtensilsCrossed,
// } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import collegeLogo from "../../assets/logo-vector.png";
// import { useAuth } from "../../context/AuthContext";

// interface SidebarProps {
//   isCollapsed: boolean;
//   onToggle: () => void;
// }

// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/",
//     icon: Home,
//     permission: "view_dashboard",
//   },
//   {
//     name: "Students",
//     href: "/students",
//     icon: Users,
//     permission: "view_students",
//   },
//   {
//     name: "Attendance",
//     href: "/attendance",
//     icon: ClipboardCheck,
//     permission: "view_attendance",
//   },
//   {
//     name: "Chat",
//     href: "/chat",
//     icon: ClipboardCheck,
//     permission: "use_chat",
//   },
//   // {
//   //   name: "Meal Planning",
//   //   href: "/meals",
//   //   icon: UtensilsCrossed,
//   //   permission: "view_meals",
//   // },
//   // {
//   //   name: "Finance",
//   //   href: "/finance",
//   //   icon: CreditCard,
//   //   permission: "view_finance",
//   // },
//   // {
//   //   name: "Reports",
//   //   href: "/reports",
//   //   icon: BarChart3,
//   //   permission: "view_reports",
//   // },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: Settings,
//     permission: "manage_settings",
//   },
// ];

// export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
//   const { user, logout, hasPermission } = useAuth();

//   const filteredNavigation = navigation.filter((item) =>
//     hasPermission(item.permission)
//   );

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case "admin":
//         return "bg-red-600";
//       case "warden":
//         return "bg-blue-600";
//       case "accountant":
//         return "bg-green-600";
//       case "kitchen":
//         return "bg-orange-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   const getRoleLabel = (role: string) => {
//     switch (role) {
//       case "admin":
//         return "Administrator";
//       case "warden":
//         return "Warden";
//       case "accountant":
//         return "Accountant";
//       case "kitchen":
//         return "Kitchen Staff";
//       default:
//         return role;
//     }
//   };

//   return (
//     <div
//       className={`fixed inset-y-0 left-0 z-50 bg-gray-900 text-white transform transition-all duration-300 ease-in-out flex flex-col ${
//         isCollapsed ? "w-16" : "w-64"
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 flex-shrink-0 relative">
//         {/* Logo and Title */}
//         <div
//           className={`flex items-center transition-opacity duration-300 min-w-0 ${
//             isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
//           }`}
//         >
//           {/* <Building2 className="h-8 w-8 text-blue-400 flex-shrink-0" /> */}
//           {/* <div className="">
//             <img
//               src={collegeLogo}
//               alt="Ananda College Logo"
//               className="h-12 w-20 object-cover" // or object-contain
//             />
//           </div> */}
//           <span className="ml-0 text-xl font-bold truncate">Ananda Hostel</span>
//         </div>

//         {/* Collapsed Logo - Centered */}
//         {isCollapsed && (
//           <div className=" flex items-center justify-center">
//             {/* <Building2 className="h-8 w-8 text-blue-400" /> */}
//             {/* <div className="p-1 bg-white rounded-full shadow-sm">
//               <img 
//                 src={collegeLogo} 
//                 alt="Ananda College Logo" 
//                 className="h-12 w-20 object-cover" // or object-contain
//               />
//             </div> */}
//           </div>
//         )}

//         {/* Toggle Button - Always positioned on the right */}
//         <button
//           onClick={onToggle}
//           className={`p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 z-10 ${
//             isCollapsed ? "mr-4 bg-gray-800" : ""
//           }`}
//           title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           <ChevronRight
//             className={`h-5 w-5 duration-200 ${
//               !isCollapsed ? "rotate-180" : ""
//             }`}
//           />
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
//         {filteredNavigation.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.href}
//             className={({ isActive }) =>
//               `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative min-w-0 ${
//                 isActive
//                   ? "bg-rose-800 text-white"
//                   : "text-gray-300 hover:bg-gray-800 hover:text-white"
//               }`
//             }
//             title={isCollapsed ? item.name : ""}
//           >
//             <item.icon
//               className={`h-5 w-5 flex-shrink-0 ${
//                 isCollapsed ? "mx-auto" : "mr-3"
//               }`}
//             />

//             {!isCollapsed && <span className="truncate">{item.name}</span>}

//             {/* Tooltip for collapsed state */}
//             {isCollapsed && (
//               <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                 {item.name}
//               </div>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* User Profile */}
//       <div className="p-6 h-[160px]">
//         <img
//           src={collegeLogo}
//           className={`${
//             isCollapsed ? "opacity-0" : "opacity-50 "
//           } transition-opacity duration-200 `}
//         />
//       </div>
//     </div>
//   );
// }

// import { ChevronRight } from "lucide-react";
// import { Icon } from "@iconify/react";
// import { NavLink } from "react-router-dom";
// import collegeLogo from "../../assets/logo-vector.png";
// import { useAuth } from "../../context/AuthContext";

// interface SidebarProps {
//   isCollapsed: boolean;
//   onToggle: () => void;
// }


// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/",
//     icon: "material-symbols:dashboard-outline-rounded",
//     permission: "view_dashboard",
    
//   },
//   {
//     name: "Students",
//     href: "/students",
//     icon: "ph:student-duotone",
//     permission: "view_students",
//   },
//   {
//     name: "Attendance",
//     href: "/attendance",
//     icon: "material-symbols:how-to-reg-outline-rounded",
//     permission: "view_attendance",
//   },
//   {
//     name: "Chat",
//     href: "/chat",
//     icon: "material-symbols:chat-bubble-outline-rounded",
//     permission: "use_chat",
//   },
//   {
//     name: "Meal Planning",
//     href: "/meals",
//     icon: "material-symbols:menu-book-2-outline-rounded",
//     permission: "view_meals",
//   },
//   {
//     name: "Finance",
//     href: "/finance",
//     icon: "material-symbols:account-balance-wallet-outline-rounded",
//     permission: "view_finance",
//   },
//   {
//     name: "Reports",
//     href: "/reports",
//     icon: "material-symbols:analytics-outline-rounded",
//     permission: "view_reports",
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: "material-symbols:settings-outline-rounded",
//     permission: "manage_settings",
//   },
// ];

// export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
//   const { user, logout, hasPermission } = useAuth();

//   const filteredNavigation = navigation.filter((item) =>
//     hasPermission(item.permission)
//   );

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case "admin":
//         return "bg-red-600";
//       case "warden":
//         return "bg-blue-600";
//       case "accountant":
//         return "bg-green-600";
//       case "kitchen":
//         return "bg-orange-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   const getRoleLabel = (role: string) => {
//     switch (role) {
//       case "admin":
//         return "Administrator";
//       case "warden":
//         return "Warden";
//       case "accountant":
//         return "Accountant";
//       case "kitchen":
//         return "Kitchen Staff";
//       default:
//         return role;
//     }
//   };

//   return (
//     <div
//       className={`fixed inset-y-0 left-0 z-50 bg-gray-900 text-white transform transition-all duration-300 ease-in-out flex flex-col ${
//         isCollapsed ? "w-16" : "w-64"
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 flex-shrink-0 relative">
//         {/* Logo and Title */}
//         <div
//           className={`flex items-center transition-opacity duration-300 min-w-0 ${
//             isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
//           }`}
//         >
//           <Icon 
//             icon="material-symbols:school-outline-rounded" 
//             className="h-8 w-8 text-amber-600 flex-shrink-0" 
//           />
//           <span className="ml-3 text-xl font-bold truncate">Ananda Hostel</span>
//         </div>

//         {/* Collapsed Logo - Centered */}
//         {isCollapsed && (
//           <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
//             <Icon 
//               icon="material-symbols:school-outline-rounded" 
//               className="h-8 w-8 text-amber-800" 
//             />
//           </div>
//         )}

//         {/* Toggle Button - Always positioned on the right */}
//         <button
//           onClick={onToggle}
//           className={`p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 z-10 ${
//             isCollapsed ? "absolute right-2" : ""
//           }`}
//           title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           <ChevronRight
//             className={`h-5 w-5 duration-200 ${
//               !isCollapsed ? "rotate-180" : ""
//             }`}
//           />
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
//         {filteredNavigation.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.href}
//             className={({ isActive }) =>
//               `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative min-w-0 hover:scale-[1.02] ${
//                 isActive
//                   ? "bg-gradient-to-r from-rose-800 to-amber-600 text-white shadow-lg"
//                   : "text-gray-300 hover:bg-gray-800 hover:text-white"
//               }`
//             }
//             title={isCollapsed ? item.name : ""}
//           >
//             <Icon
//               icon={item.icon}
//               className={`h-6 w-6 flex-shrink-0 ${
//                 isCollapsed ? "mx-auto text-amber-800" : "mr-3 text-amber-600"
//               }`}
//             />

//             {!isCollapsed && <span className="truncate">{item.name}</span>}

//             {/* Tooltip for collapsed state */}
//             {isCollapsed && (
//               <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600">
//                 {item.name}
//                 <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-gray-600"></div>
//               </div>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* College Logo at Bottom */}
//       <div className="p-6 h-[160px]">
//          <img
//           src={collegeLogo}
//           className={`${
//              isCollapsed ? "opacity-0" : "opacity-50 "
//            } transition-opacity duration-200 `}
//          />
//        </div>
//     </div>
//   );
// }






// import { ChevronRight } from "lucide-react";
// import { Icon } from "@iconify/react";
// import { NavLink } from "react-router-dom";
// import collegeLogo from "../../assets/logo-vector.png";
// import { useAuth } from "../../context/AuthContext";

// interface SidebarProps {
//   isCollapsed: boolean;
//   onToggle: () => void;
// }

// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/",
//     icon: "solar:home-smile-angle-outline",
//     permission: "view_dashboard",
//   },
//   {
//     name: "Students",
//     href: "/students",
//     icon: "solar:users-group-rounded-outline",
//     permission: "view_students",
//   },
//   {
//     name: "Attendance",
//     href: "/attendance",
//     icon: "solar:clipboard-check-outline",
//     permission: "view_attendance",
//   },
//   {
//     name: "Chat",
//     href: "/chat",
//     icon: "solar:chat-round-outline",
//     permission: "use_chat",
//   },
//   {
//     name: "Meal Planning",
//     href: "/meals",
//     icon: "solar:chef-hat-outline",
//     permission: "view_meals",
//   },
//   {
//     name: "Finance",
//     href: "/finance",
//     icon: "solar:wallet-money-outline",
//     permission: "view_finance",
//   },
//   {
//     name: "Reports",
//     href: "/reports",
//     icon: "solar:chart-outline",
//     permission: "view_reports",
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: "solar:settings-outline",
//     permission: "manage_settings",
//   },
// ];

// export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
//   const { user, logout, hasPermission } = useAuth();

//   const filteredNavigation = navigation.filter((item) =>
//     hasPermission(item.permission)
//   );

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case "admin":
//         return "bg-red-600";
//       case "warden":
//         return "bg-blue-600";
//       case "accountant":
//         return "bg-green-600";
//       case "kitchen":
//         return "bg-orange-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   const getRoleLabel = (role: string) => {
//     switch (role) {
//       case "admin":
//         return "Administrator";
//       case "warden":
//         return "Warden";
//       case "accountant":
//         return "Accountant";
//       case "kitchen":
//         return "Kitchen Staff";
//       default:
//         return role;
//     }
//   };

//   return (
//     <div
//       className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out flex flex-col shadow-lg ${
//         isCollapsed ? "w-16" : "w-64"
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 flex-shrink-0 relative bg-white">
//         {/* Logo and Title */}
//         <div
//           className={`flex items-center transition-opacity duration-300 min-w-0 ${
//             isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
//           }`}
//         >
//           <Icon 
//             icon="solar:buildings-3-outline" 
//             className="h-8 w-8 text-blue-600 flex-shrink-0" 
//           />
//           <span className="ml-3 text-xl font-bold truncate text-gray-800">Ananda Hostel</span>
//         </div>

//         {/* Collapsed Logo - Centered */}
//         {isCollapsed && (
//           <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
//             <Icon 
//               icon="solar:buildings-3-outline" 
//               className="h-8 w-8 text-blue-600" 
//             />
//           </div>
//         )}

//         {/* Toggle Button - Always positioned on the right */}
//         <button
//           onClick={onToggle}
//           className={`p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 z-10 ${
//             isCollapsed ? "absolute right-2" : ""
//           }`}
//           title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           <ChevronRight
//             className={`h-5 w-5 duration-200 text-gray-600 ${
//               !isCollapsed ? "rotate-180" : ""
//             }`}
//           />
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden bg-white">
//         {filteredNavigation.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.href}
//             className={({ isActive }) =>
//               `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative min-w-0 ${
//                 isActive
//                   ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
//                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//               }`
//             }
//             title={isCollapsed ? item.name : ""}
//           >
//             <Icon
//               icon={item.icon}
//               className={`h-5 w-5 flex-shrink-0 ${
//                 isCollapsed ? "mx-auto" : "mr-3"
//               }`}
//             />

//             {!isCollapsed && <span className="truncate">{item.name}</span>}

//             {/* Tooltip for collapsed state */}
//             {isCollapsed && (
//               <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
//                 {item.name}
//                 <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
//               </div>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* College Logo at Bottom */}
//       <div className="p-6 h-[160px] bg-white border-t border-gray-100">
//          <img
//           src={collegeLogo}
//           className={`${
//              isCollapsed ? "opacity-0" : "opacity-50"
//            } transition-opacity duration-200 `}
//          />
//        </div>
//     </div>
//   );
// }




import { ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import collegeLogo from "../../assets/logo-vector.png";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: "fluent:grid-kanban-20-filled",
    gradient: "from-violet-500 to-purple-600",
    permission: "view_dashboard",
  },
  {
    name: "Students",
    href: "/students", 
    icon: "fluent:people-team-20-filled",
    gradient: "from-blue-500 to-cyan-600",
    permission: "view_students",
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: "fluent:clipboard-checkmark-20-filled",
    gradient: "from-emerald-500 to-teal-600",
    permission: "view_attendance",
  },
  // {
  //   name: "Chat",
  //   href: "/chat",
  //   icon: "fluent:chat-bubbles-question-20-filled",
  //   gradient: "from-pink-500 to-rose-600",
  //   permission: "use_chat",
  // },
  {
    name: "Meal Planning",
    href: "/meals",
    icon: "fluent:food-20-filled",
    gradient: "from-orange-500 to-amber-600",
    permission: "view_meals",
  },
  // {
  //   name: "Finance",
  //   href: "/finance",
  //   icon: "fluent:money-20-filled",
  //   gradient: "from-green-500 to-emerald-600",
  //   permission: "view_finance",
  // },
  // {
  //   name: "Reports",
  //   href: "/reports",
  //   icon: "fluent:data-bar-vertical-20-filled",
  //   gradient: "from-indigo-500 to-blue-600",
  //   permission: "view_reports",
  // },
  {
    name: "Settings",
    href: "/settings",
    icon: "fluent:settings-20-filled",
    gradient: "from-slate-500 to-gray-600",
    permission: "manage_settings",
  },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();

  const filteredNavigation = navigation.filter((item) =>
    hasPermission(item.permission)
  );

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transform transition-all duration-500 ease-out flex flex-col backdrop-blur-xl border-r border-slate-700/50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#800000]/100 via-transparent to-amber-500/100 opacity-50"></div>
      
      {/* Header */}
      <div className="relative flex items-center justify-between h-20 px-6 border-b border-slate-700/50 flex-shrink-0">
        {/* Logo and Title */}
        <div
          className={`flex items-center transition-all duration-500 min-w-0 ${
            isCollapsed ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl blur-sm opacity-75"></div>
            <div className="relative bg-gradient-to-r from-amber-500 to-red-700 p-2 rounded-xl">
              <Icon 
                icon="fluent:building-home-20-filled" 
                className="h-6 w-6 text-white" 
              />
            </div>
          </div>
          <div className="ml-1">
            <span className="text-[1.099rem] font-bold text-white">Ananda Hostel</span>
            <div className="text-xs text-slate-400">Management System</div>
          </div>
        </div>

        {/* Collapsed Logo - Centered */}
        {isCollapsed && (
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl blur-sm opacity-75"></div>
              <div className="relative bg-gradient-to-r from-red-700 to-amber-500 p-2 rounded-xl">
                <Icon 
                  icon="fluent:building-home-20-filled" 
                  className="h-6 w-6 text-white" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className={`relative p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 z-10 group border border-slate-600/30 ${
            isCollapsed ? "absolute right-1" : "absolute left-4"
          }`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <ChevronRight
            className={`h-4 w-4 duration-500 text-slate-300 relative z-10 ${
              !isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-4 py-8 space-y-3 overflow-y-auto overflow-x-hidden">
        {filteredNavigation.map((item, index) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden transform hover:scale-[1.02] ${
                isActive
                  ? "bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
            title={isCollapsed ? item.name : ""}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* Background gradient for active/hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
            
            {/* Icon container */}
            <div className={`relative flex-shrink-0 ${isCollapsed ? "mx-auto" : "mr-4"}`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl blur-sm opacity-0 group-hover:opacity-60 transition-all duration-300`}></div>
              <div className={`relative bg-gradient-to-r ${item.gradient} p-1.5 rounded-xl transition-all duration-300 group-hover:scale-110`}>
                <Icon
                  icon={item.icon}
                  className="h-5 w-5 text-white"
                />
              </div>
            </div>

            {!isCollapsed && (
              <div className="relative">
                <span className="truncate font-semibold">{item.name}</span>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-1"></div>
              </div>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-4 py-3 bg-slate-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-slate-600/50 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-xl`}></div>
                <span className="relative font-semibold">{item.name}</span>
                <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-3 h-3 bg-slate-800 rotate-45 border-l border-b border-slate-600/50"></div>
              </div>
            )}

            {/* Active indicator */}
            <div className="absolute right-2 w-1 h-8 bg-gradient-to-b from-violet-400 to-cyan-400 rounded-full opacity-0 group-[.active]:opacity-100 transition-opacity duration-300"></div>
          </NavLink>
        ))}
      </nav>

      {/* College Logo at Bottom */}
      <div className="relative p-6 border-t border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        <img
          src={collegeLogo}
          className={`relative ${
            isCollapsed ? "opacity-400 scale-95" : "opacity-40 hover:opacity-80"
          } transition-all duration-300`}
          alt="College Logo"
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-1 h-32 bg-gradient-to-b from-violet-500/30 to-cyan-500/30 rounded-l-full"></div>
      <div className="absolute bottom-1/4 left-0 w-1 h-24 bg-gradient-to-t from-pink-500/30 to-orange-500/30 rounded-r-full"></div>
    </div>
  );
}