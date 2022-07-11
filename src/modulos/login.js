class Login {

    static async login (dataLogin) {

        let url = "https://blog-m2.herokuapp.com/users/login";

        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataLogin)
        }

        let response = await fetch(url, options)
        .then((res) => {return res.json()})
        .catch((err) => {console.log(err)});
        
        this.validarLogin(response);
    }

    static pegarDadosLogin () {

        const form = document.querySelector("#formLogin");

        let dadosUser = {};

        form.addEventListener("submit", async (event) => {

            event.preventDefault();

            [...event.target].forEach((input) => {

                if (input.value !== "") {

                    dadosUser[input.name] = input.value;
                }
            });
           
            await this.login(dadosUser);

        })
    }

    static validarLogin (response) {

        const modal = document.querySelector("#modalLogin");

        if(response.token) {
            localStorage.setItem("userId", response.userId);
            localStorage.setItem("token", response.token);
            modal.style.display = "none";
            window.location.href = "../../index.html"
        }else {
            modal.style.display = "flex";
            this.direcionarUser()
        }
    }

    static direcionarUser() {

        const login = document.querySelector("#direcionarLogin");
        const cadastro = document.querySelector("#direcionarCadastro");
        const modal = document.querySelector("#modalLogin");

        login.addEventListener("click", (event) => {
            event.preventDefault();
            modal.style.display = "none";
            window.location.reload();
        })

        cadastro.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "cadastro.html";
        })
    }

    static fecharLogin() {

        const fecharLogin = document.querySelector("#fecharLogin");

        fecharLogin.addEventListener("click", (event) => {

            event.preventDefault();
            window.location.href = "../../index.html"
        })
    }
}

Login.pegarDadosLogin();
Login.fecharLogin();