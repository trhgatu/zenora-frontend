const ROUTERS = {
    USER: {
        home: "/",
        login: "/login",
        register: "/register",
        facility: "/facility",
        facilityDetail: "/facility/:id",
        serviceProvider: "/dang-ky-co-so-lam-dep",
        appointment: "/dat-lich",
        confirmAppointment: "/xac-nhan-dat-lich",
        profile: "/thong-tin-ca-nhan",
    },
    ADMIN: {
        root: "/admin",
        user: "/admin/users",
        dashboard: "/admin/dashboard",
        facility: "/admin/facilities",
        promotion: "/admin/promotions",
        role: {
            root: "/admin/roles",
            create: "/admin/roles/create",
            edit: (id: string) => `/admin/roles/edit/${id}`,
        },

    },
}
export default ROUTERS;