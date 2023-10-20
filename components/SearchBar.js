import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput !== '') router.push(`/search/${searchInput}`);
    setSearchInput('');
  };
  return (
    <Form className="search-bar" onSubmit={handleSubmit}>
      <FormControl type="text" placeholder="Search Members" size="sm" onChange={handleChange} value={searchInput} />
      <Button icon="fa-solid fa-magnifying-glass" type="submit" size="sm" variant="dark">🔎</Button>
    </Form>
  );
}
