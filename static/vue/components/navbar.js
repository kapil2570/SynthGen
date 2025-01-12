const Navbar = Vue.component('navbar', {
  template: `
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">
    PwC
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" exact>Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item" v-if="role === 'admin'">
          <router-link to="/admin" class="nav-link" active-class="active">Admin</router-link>
        </li>
      </ul>
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ username }}
          </a>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li><router-link to="/profile" class="dropdown-item">Profile</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
  `,
  data() {
    return {
      role: localStorage.getItem("role"),
      is_login: localStorage.getItem("auth-token"),
      id: localStorage.getItem("id"),
      username: localStorage.getItem("username") || "User",
      inactivityTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
      inactivityTimer: null,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("username");
      this.$router.push({ path: "/login" });
    },
    handleUserActivity() {
      localStorage.setItem("lastActivityTimestamp", Date.now().toString());
    },
    checkInactivity() {
      const lastActivityTimestamp = localStorage.getItem("lastActivityTimestamp");
      const currentTime = Date.now();

      if (lastActivityTimestamp && currentTime - lastActivityTimestamp > this.inactivityTimeout) {
        this.clearLocalStorage();
      }
    },
    clearLocalStorage() {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("username");
      this.$router.push({ path: "/login" });
    },
    startInactivityTimer() {
      this.inactivityTimer = setInterval(() => {
        this.checkInactivity();
      }, 60000); // Check every minute
    },
    stopInactivityTimer() {
      clearInterval(this.inactivityTimer);
    },
  },
  mounted() {
    document.addEventListener("mousemove", this.handleUserActivity);
    document.addEventListener("keydown", this.handleUserActivity);
    this.startInactivityTimer();
  },
  beforeDestroy() {
    document.removeEventListener("mousemove", this.handleUserActivity);
    document.removeEventListener("keydown", this.handleUserActivity);
    this.stopInactivityTimer();
  },
});

export default Navbar;