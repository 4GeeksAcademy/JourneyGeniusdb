import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const MyInfo = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    username: '',
    gender: '',
    birth_date: '',
    phone: '',
    location: ''
});

const handleChange = (e) => {
    setUserInfo({
        ...userInfo,
        [e.target.name]: e.target.value
    });
};

const handleSubmit = (e) => {
  e.preventDefault();

  // Recuperar o token JWT do localStorage
  const token = localStorage.getItem('token');

  // Configurar os cabeçalhos da solicitação para incluir o token JWT
  const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  });

  // Enviar uma solicitação PUT para atualizar as informações do usuário
  fetch('/api/user/me', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(userInfo)
  })
  .then(response => {
      // Verificar se a solicitação foi bem-sucedida
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      // Aqui podemos mostrar uma mensagem de sucesso.
      console.log('User information updated successfully:', data);
      navigate('/profile');
  })
  .catch(error => console.error('There was a problem with the fetch operation:', error));
};

return (
    <div>
        <h1>My Info</h1>
        <form onSubmit={handleSubmit}>
            <label>
                First Name:
                <input
                    type="text"
                    name="first_name"
                    value={userInfo.first_name}
                    onChange={handleChange}
                />
            </label><br/>
            <label>
                Last Name:
                <input
                    type="text"
                    name="last_name"
                    value={userInfo.last_name}
                    onChange={handleChange}
                />
            </label><br/>
            <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={userInfo.username}
                    onChange={handleChange}
                />
            </label><br/>
            <label>
                Gender:
                <input
                    type="text"
                    name="gender"
                    value={userInfo.gender}
                    onChange={handleChange}
                />
            </label><br/>
            <label>
                Birth Date:
                <input
                    type="date"
                    name="birth_date"
                    value={userInfo.birth_date}
                    onChange={handleChange}
                />
            </label><br/>
            <label>
                Phone:
                <input
                    type="text"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleChange}
                />
            </label><br/>
            <label>
                Location:
                <input
                    type="text"
                    name="location"
                    value={userInfo.location}
                    onChange={handleChange}
                />
            </label><br/>
            <button type="submit">Update Info</button>
        </form>
    </div>
);
};

export default MyInfo;