class Cadastro {

    static async cadastroApi(data) {

        let url = "https://blog-m2.herokuapp.com/users/register";

        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        let response =  await fetch(url, options)
        .then((res) => {return res.json()})
        .catch((err) => {return err});

        if(response.username === data.username) {
            window.location.href = "login.html"
        } else {
            console.log(response)
            this.direcionarUser(response)
        }
    }

    static cadastrarUser() {

        const form = document.querySelector("#formCadastro");

        const dataCadastro = {};

        form.addEventListener("submit", (event) => {

            event.preventDefault();

            [...event.target].forEach((input) => {
                
                if (input.value !== "") {

                    dataCadastro[input.name] = input.value;
                }
            });

            let resultado = this.validarDadosCadastro(dataCadastro);
            let validacao = Object.keys(resultado).length;
        
            if(validacao === 0) {
                
                this.cadastroApi(dataCadastro);
            }
            else {this.direcionarUser(resultado)}
        })  
    }

    static validarDadosCadastro(data) {

        const letraMaiuscula = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numeros =  "0123456789";

        let err = {};

        if(Object.keys(data).length < 4) {
            return "Preencha todos os campos"
        }

        if(data.username.length > 12) {
            err["name"] = "O nome de usuário pode ter até 12 caracteres";
        }

        if (!data.avatarUrl.includes(".jpeg") && !data.avatarUrl.includes(".jpg") && !data.avatarUrl.includes(".png")) {
            err["avatarUrl"] = "Insira uma imagem válida dos tipos JPEG JPG ou PNG"
        }

        let validarLetraMaiuscula = data.password.split("").some((elem) => {
            return letraMaiuscula.split("").some((letra) => {
                return elem === letra
            })
        });

        let validarNumero = data.password.split("").some((elem) => {
            return numeros.split("").some((numero) => {
                return elem === numero
            })
        });

        if(data.password.length < 6 || validarLetraMaiuscula === false || validarNumero === false) {
            err["password"] = "A senha precisa ter pelo menos 6 dígitos, 1 letra maiuscula e 1 número para ser válida"
        }
        
        return err
    }

    static direcionarUser(data) {

        const modal = document.querySelector("#modalCadastro");
        modal.style.display = "flex";

        const X = document.createElement("button");
        X.id = "fecharModalCadastro";
        X.innerText = "FECHAR";

        const div = document.querySelector("#divCadastro");

       if (data == "Preencha todos os campos"){
        
            const span = document.createElement("span");
            span.innerText = "Preencha todos os campos";
            div.append(span, X);
            this.fecharModalCadastro();
            return
       }

       if (data.message == "An user with the same username is already registered"){

            const span = document.createElement("span");
            span.innerText = "Nome de usuário já cadastrado";
            div.append(span, X);
            this.fecharModalCadastro();
            return
        }

        if(data.message == "An user with the same email is already registered"){

            const span = document.createElement("span");
            span.innerText = "email já cadastrado";
            div.append(span, X);
            this.fecharModalCadastro();
            return

        } 

       Object.keys(data).forEach((item) => {
      
            const span = document.createElement("span");
            span.innerText = data[item];
            div.append(span);
       })

       div.append(X);

       this.fecharModalCadastro();
    }


    static fecharModalCadastro() {

        const modal = document.querySelector("#modalCadastro");
        const fechar = document.querySelector("#fecharModalCadastro");

        fechar.addEventListener("click", (event) => {

            event.preventDefault();
            modal.style.display = "none";
            window.location.reload();
            return
        })
    }
}

Cadastro.cadastrarUser();