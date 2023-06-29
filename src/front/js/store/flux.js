const getState = ({ getStore, getActions, setStore }) => {
  const backendUrl = process.env.BACKEND_URL;

  return {
    store: {
      message: null,
      isLoggedIn: !!localStorage.getItem("token"), // Inicializa com base no token no localStorage
      categories: [],
      subcategories: [],
      serviceCategories: [],
      serviceSubcategories: [],
      

      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },

      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },

      storeToken: (token) => {
        localStorage.setItem("token", token);
      },

      loginUser: async (email, password, navigate, onSuccess) => {
        try {
          const backendUrl = process.env.BACKEND_URL;

          // Fazendo uma chamada de API para autenticar o usuário
          const response = await fetch(`${backendUrl}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (response.ok) {
            const data = await response.json();
            // Atualizando o estado global com as informações do usuário logado
            setStore({
              isLoggedIn: true,
              authToken: data.access_token,
            });
            // Armazenando o token na local storage
            localStorage.setItem("token", data.access_token);
            // Chama a função de callback onSuccess
            if (onSuccess) {
              onSuccess();
            }
            // Redirecionando o usuário para a página de perfil
            navigate("/profile");
          } else {
            // Mostrando um alerta para o usuário
            alert(
              "The user does not exist. Make sure you are inserting correct values."
            );
          }
        } catch (error) {
          // Tratando erros de rede ou outros erros inesperados aqui
          console.error("Ocorreu um erro ao fazer login", error);
        }
      },

      logoutUser: (onLogout) => {
        localStorage.removeItem("token");
        setStore({ isLoggedIn: false });

        // Chama a função de callback onLogout
        if (onLogout) {
          onLogout();
        }
      },

      // define o estado de login
      setLoginState: (loggedIn) => {
        setStore({ isLoggedIn: loggedIn });
      },

      getCategories: async function () {
        try {
          const response = await fetch(`${backendUrl}/api/product-categories`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setStore({ categories: data });
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },

      getSubcategories: async function (categoryId) {
        try {
          const response = await fetch(
            `${backendUrl}/api/product-subcategories?category_id=${categoryId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Subcategories data:", data);
          setStore({ subcategories: data });
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      },

      getServiceCategories: async function () {
        try {
          const response = await fetch(`${backendUrl}/api/service-categories`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setStore({ serviceCategories: data });
        } catch (error) {
          console.error("Error fetching service categories:", error);
        }
      },

      getServiceSubcategories: async function (categoryId) {
        try {
          const response = await fetch(
            `${backendUrl}/api/service-subcategories?category_id=${categoryId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Service subcategories data:", data);
          setStore({ serviceSubcategories: data });
        } catch (error) {
          console.error("Error fetching service subcategories:", error);
        }
      },

      
      

      registerUser: (email, password) => {
        const backendUrl = process.env.BACKEND_URL;
        return fetch(`${backendUrl}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.access_token) {
              // Armazenar o token de acesso na local storage
              localStorage.setItem("token", data.access_token);
              // Atualizar o estado global para refletir que o usuário está logado
              setStore({ isLoggedIn: true });
              return true; // Indica sucesso
            } else if (data.msg) {
              alert(data.msg);
            }
            return false; // Indica falha
          })
          .catch((error) => {
            console.error("Error:", error);
            return false; // Indica falha
          });
      },
    },
  };
};

export default getState;
