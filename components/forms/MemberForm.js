import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { createMember, updateMember } from '../../api/memberData';
import { getTeams } from '../../api/teamData';

const initialState = {
  name: '',
  role: '',
  image: '',
};

export default function MemberForm({ memberObj }) {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState({ ...initialState, uid: user.uid });
  const [teams, setTeams] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getTeams(user.uid).then(setTeams);
    if (memberObj.firebaseKey) setFormInput(memberObj);
  }, [memberObj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (memberObj.firebaseKey) {
      updateMember(formInput).then(() => router.push('/members'));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createMember(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateMember(patchPayload).then(() => router.push('/members'));
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'gold' }}>Team Member Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Team Member's Name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'gold' }}>Role</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Role"
            name="role"
            value={formInput.role}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'gold' }}>Photo</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter image URL"
            name="image"
            value={formInput.image}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Select
            aria-label="Team"
            name="teamId"
            onChange={handleChange}
            value={formInput.teamId}
            required
          >
            <option value="">Select a Team</option>
            {
            teams.map((team) => (
              <option
                key={team.firebaseKey}
                value={team.firebaseKey}
              >
                {team.name}
              </option>
            ))
          }
          </Form.Select>
        </Form.Group>
        <Button className="gold submit" variant="dark" type="submit">{memberObj.firebaseKey ? 'Update' : 'Create'} Member
        </Button>
      </Form>
    </>
  );
}

MemberForm.propTypes = {
  memberObj: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    image: PropTypes.string,
    firebaseKey: PropTypes.string,
    teamId: PropTypes.string,
  }),
};

MemberForm.defaultProps = {
  memberObj: initialState,
};
