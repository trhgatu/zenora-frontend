const ROUTERS = {
    ADMIN: {
        root: "/admin",
        auth: {
          root: "/admin/auth",
          login : "/admin/auth/login"
        },
        user: {
            root: "/admin/users",
            create: "/admin/users/create",
            show: (id: string) => `/admin/users/detail/${id}`,
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
        category: {
            root: "/admin/categories",
            create: "/admin/categories/create"
        },
        dashboard: "/admin/dashboard",
        facility: {
            root: "/admin/facilities",
            create: "/admin/facilities/create",
            edit: (id: string) => `/admin/facilities/edit/${id}`,
        },
        promotion: {
            root: "/admin/promotions",
            create: "/admin/promotions/create",
            edit: (id: string) => `/admin/promotions/edit/${id}`,
            show: (id: string) => `/admin/promotions/detail/${id}`,
        },
        role: {
            root: "/admin/roles",
            create: "/admin/roles/create",
            edit: (id: string) => `/admin/roles/edit/${id}`,
            show: (id: string) => `/admin/roles/detail/${id}`,
        },

    },
}
export default ROUTERS;