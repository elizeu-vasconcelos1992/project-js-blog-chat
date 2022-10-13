class Pagina {
  static userId = localStorage.getItem("userId");
  static token = localStorage.getItem("token");

  static async getInfoUser() {
    let url = "https://blog-m2.herokuapp.com/users/";

    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token} `,
      },
    };

    if (this.token) {
      let data = await fetch(`${url}${this.userId}`, options)
        .then(res => {
          return res.json();
        })
        .catch(err => {
          return err;
        });

      this.listarUser(data);
    }
  }

  static listarUser(data) {
    if (this.token != null) {
      const img = document.querySelector("#imgUser");
      img.src = data.avatarUrl;
      img.alt = "avatar do usuário";

      const h3 = document.querySelector("#nameUser");
      h3.innerText = data.username;

      const btn = document.querySelector("#btnLogout");
      btn.innerText = "Logout";
    } else {
      const img = document.querySelector("#imgUser");
      img.src = "../img/image 4.png";
      img.alt = "avatar do usuário";

      const h3 = document.querySelector("#nameUser");
      h3.innerText = "Entre para poder interagir";

      const btn = document.querySelector("#btnLogout");
      btn.innerText = "Login";

      window.location.reload();
    }
  }

  static logout() {
    const logout = document.querySelector("#btnLogout");

    logout.addEventListener("click", event => {
      event.preventDefault();

      if (logout.innerText == "Logout") {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");

        this.userId = localStorage.getItem("userId");
        this.token = localStorage.getItem("token");

        this.listarUser();
      } else {
        window.location.href = "./src/pages/login.html";
      }
    });
  }

  static async getPosts(page) {
    let url = `https://blog-m2.herokuapp.com/posts?page=${page}`;

    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token} `,
      },
    };

    if (this.token) {
      let response = await fetch(url, options)
        .then(res => {
          return res.json();
        })
        .catch(err => {
          return err;
        });

      let dados = response.data;

      dados.forEach(item => {
        this.criarCard(item);
      });

      return response;
    }
  }

  static criarCard(data) {
    const posts = document.querySelector("#posts");

    const divPost = document.createElement("div");
    divPost.id = "post";

    const img = document.createElement("img");
    img.src = data.user.avatarUrl;

    const divConteudo = document.createElement("div");
    divConteudo.id = "conteudoPost";

    const h4 = document.createElement("h4");
    h4.innerText = data.user.username;

    const p = document.createElement("p");
    p.innerText = data.content;

    divConteudo.append(h4, p);

    const divEdicao = document.createElement("div");
    divEdicao.id = "editarPost";

    let novaData = this.tratarData(data.createdAt);

    const span = document.createElement("span");
    span.innerText = novaData;

    divEdicao.append(span);

    if (parseInt(this.userId) == data.user.id) {
      h4.innerText = `${data.user.username} (Você)`;
      h4.style.color = "blue";

      const btnEditar = document.createElement("button");
      btnEditar.classList = "editar";
      btnEditar.innerText = "Editar";
      btnEditar.id = data.id;

      const btnApagar = document.createElement("button");
      btnApagar.classList = "apagar";
      btnApagar.innerText = "Apagar";
      btnApagar.id = data.id;

      divEdicao.append(btnEditar, btnApagar, span);

      divPost.append(img, divConteudo, divEdicao);

      posts.append(divPost);

      this.editarDadosPost();
      this.deletarDadosPost();
    } else {
      divPost.append(img, divConteudo, divEdicao);

      posts.append(divPost);
    }
  }

  static trocarPagina() {
    const btnDireita = document.querySelector("#direita");
    const btnEsquerda = document.querySelector("#esquerda");

    let posicao = 1;

    btnDireita.addEventListener("click", event => {
      event.preventDefault();

      posicao += 1;

      const posts = document.querySelector("#posts");
      posts.innerHTML = "";

      this.getPosts(posicao);
    });

    btnEsquerda.addEventListener("click", event => {
      event.preventDefault();

      if (posicao > 1) {
        posicao -= 1;

        const posts = document.querySelector("#posts");
        posts.innerHTML = "";

        this.getPosts(posicao);
      }
    });
  }

  static tratarData(dado) {
    let data = `${dado.split("")[8]}${dado.split("")[9]}/${
      dado.split("-")[1]
    }/${dado.split("-")[0]}`;

    return data;
  }

  static async fazerPost(data) {
    let url = "https://blog-m2.herokuapp.com/posts";

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token} `,
      },
      body: JSON.stringify(data),
    };

    if (this.token) {
      let response = await fetch(url, options)
        .then(res => {
          return res.json();
        })
        .catch(err => {
          return err;
        });

      if (response) {
        window.location.reload();
      }
    }
  }

  static pegarDadosPost() {
    const btnCommit = document.querySelector("#buttonCommit");
    const texto = document.querySelector("#texto");

    btnCommit.addEventListener("click", event => {
      event.preventDefault();

      if (texto.value != " " && texto.value != "") {
        let post = { content: `${texto.value}` };
        this.fazerPost(post);
      }
    });
  }

  static async editarPost(id, data) {
    let url = `https://blog-m2.herokuapp.com/posts/${id}`;

    let options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token} `,
      },
      body: JSON.stringify(data),
    };

    if (this.token) {
      let response = await fetch(url, options)
        .then(res => {
          return res.json();
        })
        .catch(err => {
          return err;
        });

      if (response) {
        window.location.reload();
      }

      return response;
    }
  }

  static editarDadosPost() {
    const btnEditar = document.querySelectorAll(".editar");

    btnEditar.forEach(btn => {
      btn.addEventListener("click", event => {
        event.preventDefault();

        let btnId = event.target.id;

        let post =
          event.target.parentElement.previousSibling.childNodes[1].innerText;

        const divEditar = document.querySelector("#modalEditar");
        const textarea = document.querySelector("#textareaEditar");
        const btnEditar = document.querySelector("#btnModalEditar");

        divEditar.style.display = "flex";

        textarea.innerText = post;

        btnEditar.addEventListener("click", event => {
          event.preventDefault();

          let postEditado = { content: textarea.value };

          this.editarPost(btnId, postEditado);

          divEditar.style.display = "none";

          return;
        });
      });
    });
  }

  static async deletarPost(id) {
    let url = `https://blog-m2.herokuapp.com/posts/${id}`;

    let options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token} `,
      },
    };

    if (this.token) {
      let response = await fetch(url, options)
        .then(res => {
          res.json();
        })
        .catch(err => {
          console.log(err);
        });

      window.location.reload();

      return response;
    }
  }

  static deletarDadosPost() {
    const btnApagar = document.querySelectorAll(".apagar");

    btnApagar.forEach(btn => {
      btn.addEventListener("click", event => {
        event.preventDefault();

        let btnId = event.target.id;

        const modalDeletar = document.querySelector("#modalApagar");
        const voltar = document.querySelector("#naoDeletarPost");
        const confirmar = document.querySelector("#btnModalApagar");

        modalDeletar.style.display = "flex";

        voltar.addEventListener("click", event => {
          event.preventDefault();

          modalDeletar.style.display = "none";
        });

        confirmar.addEventListener("click", event => {
          event.preventDefault();

          this.deletarPost(btnId);
        });
      });
    });
  }

  static fecharEdicao() {
    const fecharEdicao = document.querySelector("#fecharEditar");
    const modal = document.querySelector("#modalEditar");

    fecharEdicao.addEventListener("click", event => {
      event.preventDefault();

      modal.style.display = "none";
    });
  }
}

await Pagina.getInfoUser();

Pagina.logout();

await Pagina.getPosts();

Pagina.trocarPagina();

Pagina.pegarDadosPost();

Pagina.deletarDadosPost();

Pagina.fecharEdicao();
