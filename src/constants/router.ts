const ROUTERS = {
    USER: {
        home: "/",
        login: "/login",
        register: "/register",
        facility: "/facility",
        booking: "/booking",
        facilityDetail: "/facility/:id",
        serviceProvider: "/dang-ky-co-so-lam-dep",
        appointment: "/dat-lich",
        confirmAppointment: "/xac-nhan-dat-lich",
        profile: "/thong-tin-ca-nhan",
    },
    ADMIN: {
        root: "/admin",
        dashboard: "/admin/dashboard",
        facility: "/admin/facility",
    },
}
export default ROUTERS;