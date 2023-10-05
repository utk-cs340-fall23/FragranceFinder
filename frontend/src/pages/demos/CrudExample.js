import '../CSS/crudexample.css';
import {useEffect, useState} from "react";

function CrudExample() {
  const [data, setData] = useState(null);

  // Initialize empty form
  const [formState, setFormState] = useState({
    id: null,
    title: '',
    description: ''
  })

  // Request data from backend
  const getPosts = async () => {
    const response = await fetch('/api/posts/');
    const responseData = await response.json();
    setData(responseData);
  }


  // Load posts onto the page
  useEffect(function() {
    getPosts();
  }, []);


  // Handle changing values in form
  const handleFormChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    });
  }

  // Handle submission of form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // If there is an id, we're doing an update instead of a creation
    if (formState.id) {
      const response = await fetch(`/api/posts/${formState.id}`, {
        method: 'PUT',
        body: JSON.stringify(formState),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setFormState({
          id: null,
          title: '',
          description: ''
        });

        getPosts();
      }
    }

    // Creation
    else {
       // Send form state to backend
      const response = await fetch('/api/posts/', {
        method: 'POST',
        body: JSON.stringify(formState),
        headers: {
          "Content-Type": "application/json"
        }
      });

      // If successful, reload posts
      if (response.ok) {
        getPosts();
      }
    }
  }


  const handlePostDelete = async event => {
    const postId = event.target.value;
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      getPosts();
    }
  }

  const renderUpdate = async ({id, title, description}) => {
    setFormState({
      id: id,
      title: title,
      description: description
    });
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div className='rainbow' style={{
          margin: '20px',
          fontSize: '25px',
          fontStyle: 'italic',
          fontWeight: 'bold'
        }}>Lakelon Bailey Hello Plus Example:</div>
        <h2>Create Post</h2>
        <form onSubmit={handleFormSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          width: '500px',
        }}>
          <input onChange={handleFormChange} name='title' placeholder='Title' value={formState.title}></input>
          <textarea onChange={handleFormChange} name='description' placeholder='Description' rows='10' value={formState.description}></textarea>
          <button type='submit' style={{marginTop: '10px'}}>{formState.id ? 'Update' : 'Submit'}</button>
        </form>

        <h2>Posts</h2>
        <div>
          {data ? data.map((item, i) => (
            <div key={i}>
              <p><strong>{item.title}:</strong></p>
              <p style={{marginLeft: '8px'}}>{item.description}</p>
              <span>
                <button onClick={handlePostDelete} value={item.id}>Delete</button>
                <button onClick={() => renderUpdate(item)}>Update</button>
              </span>
            </div>
          )) : (<li>None</li>)}
        </div>
      </main>
    </div>
  );
}

export default CrudExample;