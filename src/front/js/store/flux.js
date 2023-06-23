const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ]
        },
        actions: {
            // Use getActions to call a function within a fuction
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getMessage: async () => {
                try{
                    // fetching data from the backend
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
                    const data = await resp.json()
                    setStore({ message: data.message })
                    // don't forget to return something, that is how the async resolves
                    return data;
                }catch(error){
                    console.log("Error loading message from backend", error)
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
                localStorage.setItem('token', token);
            },

            registerUser: (email, password) => {
                const backendUrl = process.env.BACKEND_URL;
                return fetch(`${backendUrl}/api/register`, {
                    method: 'POST',                    
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.msg) {
                        alert(data.msg);
                        return true; // Indica sucesso
                    }
                    return false; // Indica falha
                })
                .catch((error) => {
                    console.error('Error:', error);
                    return false; // Indica falha
                });
            }
        }
    };
};

export default getState;

