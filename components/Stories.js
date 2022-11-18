import { faker } from '@faker-js/faker';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import StroyProfile from './StroyProfile';



function Stories() {
  const [suggestions, setSuggestions] = useState([]);
  const { data: session, status } = useSession();
  useEffect(() => {
    
    const suggestions = [...Array(20)].map((_, i) => ({
      userId: faker.datatype.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      birthdate: faker.date.birthdate(),
      registeredAt: faker.date.past(),
    }));
    setSuggestions(suggestions);
  }, []);
  


  return (
    <div className='flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black'>
      {session && (
        <StroyProfile
          username={session.user.username}
          avatar={session.user.image}
        />
      )}

      {suggestions.map(profile => (
        <StroyProfile
          key={profile.userId}
          avatar={profile.avatar}
          username={profile.username}
        />
      ))}
    </div>
  )
}

export default Stories
