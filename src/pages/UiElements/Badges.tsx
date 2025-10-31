// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import Badge from "../../components/ui/badge/Badge";
// import { PlusIcon } from "../../icons";
// import PageMeta from "../../components/common/PageMeta";
// import ComponentCard from "../../components/common/ComponentCard";

// export default function Badges() {
//   return (
//     <div>
//       <PageMeta
//         title="React.js Badges Dashboard | TailAdmin - React.js Admin Dashboard Template"
//         description="This is React.js Badges Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <PageBreadcrumb pageTitle="Badges" />
//       <div className="space-y-5 sm:space-y-6">
//         <ComponentCard title="With Light Background">
//           <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
//             {/* Light Variant */}
//             <Badge variant="light" color="primary">
//               Primary
//             </Badge>
//             <Badge variant="light" color="success">
//               Success
//             </Badge>{" "}
//             <Badge variant="light" color="error">
//               Error
//             </Badge>{" "}
//             <Badge variant="light" color="warning">
//               Warning
//             </Badge>{" "}
//             <Badge variant="light" color="info">
//               Info
//             </Badge>
//             <Badge variant="light" color="light">
//               Light
//             </Badge>
//             <Badge variant="light" color="dark">
//               Dark
//             </Badge>
//           </div>
//         </ComponentCard>
//         <ComponentCard title="With Solid Background">
//           <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
//             {/* Light Variant */}
//             <Badge variant="solid" color="primary">
//               Primary
//             </Badge>
//             <Badge variant="solid" color="success">
//               Success
//             </Badge>{" "}
//             <Badge variant="solid" color="error">
//               Error
//             </Badge>{" "}
//             <Badge variant="solid" color="warning">
//               Warning
//             </Badge>{" "}
//             <Badge variant="solid" color="info">
//               Info
//             </Badge>
//             <Badge variant="solid" color="light">
//               Light
//             </Badge>
//             <Badge variant="solid" color="dark">
//               Dark
//             </Badge>
//           </div>
//         </ComponentCard>
//         <ComponentCard title="Light Background with Left Icon">
//           <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
//             <Badge variant="light" color="primary" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Primary
//             </Badge>
//             <Badge variant="light" color="success" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Success
//             </Badge>{" "}
//             <Badge variant="light" color="error" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Error
//             </Badge>{" "}
//             <Badge variant="light" color="warning" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Warning
//             </Badge>{" "}
//             <Badge variant="light" color="info" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Info
//             </Badge>
//             <Badge variant="light" color="light" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Light
//             </Badge>
//             <Badge variant="light" color="dark" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Dark
//             </Badge>
//           </div>
//         </ComponentCard>
//         <ComponentCard title="Solid Background with Left Icon">
//           <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
//             <Badge variant="solid" color="primary" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Primary
//             </Badge>
//             <Badge variant="solid" color="success" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Success
//             </Badge>{" "}
//             <Badge variant="solid" color="error" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Error
//             </Badge>{" "}
//             <Badge variant="solid" color="warning" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Warning
//             </Badge>{" "}
//             <Badge variant="solid" color="info" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Info
//             </Badge>
//             <Badge variant="solid" color="light" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Light
//             </Badge>
//             <Badge variant="solid" color="dark" startIcon={<img src={PlusIcon} alt="plus" />}>
//               Dark
//             </Badge>
//           </div>
//         </ComponentCard>
//         <ComponentCard title="Light Background with Right Icon">
//           <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
//             <Badge variant="light" color="primary" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Primary
//             </Badge>
//             <Badge variant="light" color="success" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Success
//             </Badge>{" "}
//             <Badge variant="light" color="error" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Error
//             </Badge>{" "}
//             <Badge variant="light" color="warning" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Warning
//             </Badge>{" "}
//             <Badge variant="light" color="info" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Info
//             </Badge>
//             <Badge variant="light" color="light" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Light
//             </Badge>
//             <Badge variant="light" color="dark" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Dark
//             </Badge>
//           </div>
//         </ComponentCard>
//         <ComponentCard title="Solid Background with Right Icon">
//           <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
//             <Badge variant="solid" color="primary" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Primary
//             </Badge>
//             <Badge variant="solid" color="success" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Success
//             </Badge>{" "}
//             <Badge variant="solid" color="error" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Error
//             </Badge>{" "}
//             <Badge variant="solid" color="warning" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Warning
//             </Badge>{" "}
//             <Badge variant="solid" color="info" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Info
//             </Badge>
//             <Badge variant="solid" color="light" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Light
//             </Badge>
//             <Badge variant="solid" color="dark" endIcon={<img src={PlusIcon} alt="plus" />}>
//               Dark
//             </Badge>
//           </div>
//         </ComponentCard>
//       </div>
//     </div>
//   );
// }
