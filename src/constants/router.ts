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
        auth: {
          root: "/admin/auth",
          login : "/admin/auth/login"
        },
        user: {
            root: "/admin/users",
            create: "/admin/users/create",
            edit: (id: string) => `/admin/users/edit/${id}`,
        },
        service: {
            root: "/admin/services",
            create: "/admin/services/create",
            edit: (id: string) => `/admin/services/edit/${id}`,
        },
        rank: {
            root: "/admin/ranks",
            create: "/admin/ranks/create",
            edit: (id: string) => `/admin/ranks/edit/${id}`,
            show: (id: string) => `/admin/ranks/detail/${id}`,
        },
        payment: {
            root: "/admin/payments",
            create: "/admin/payments/create",
            edit: (id: string) => `/admin/payments/edit/${id}`,
        },
        category: "/admin/categories",
        dashboard: "/admin/dashboard",
        facility: {
            root: "/admin/facilities",
            create: "/admin/facilities/create",
            edit: (id: string) => `/admin/facilities/edit/${id}`,
        },
        promotion: "/admin/promotions",
        role: {
            root: "/admin/roles",
            create: "/admin/roles/create",
            edit: (id: string) => `/admin/roles/edit/${id}`,
            show: (id: string) => `/admin/roles/detail/${id}`,
        },

    },
}
export default ROUTERS;