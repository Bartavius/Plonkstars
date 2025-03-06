import ProfileCard from "@/components/profileCard/ProfileCard";

export default function Contacts() {
  const persons = [
    {
      name: "Patrick Zhang",
      image: "profile/patrick.png",
      title: "Backend Developer",
      body: "Patrick is a such big fan of rice, in fact, his phone's wallpaper is rice.",
      linkedin: "https://linkedin.com/in/patrick--zhang",
      github: "https://github.com/pzhang345",
    },
    {
      name: `Bart Lojanarungsiri`,
      title: "Full-stack Developer",
      image: "profile/bart.png",
      body: "Bart plays Plonkstars so much he can probably guess where you are by looking at the dirt.",
      linkedin: "https://linkedin.com/in/jlojanarungsiri",
      github: "https://github.com/Bartavius",
    },
    {
      name: `Yuval Ailon`,
      title: "Frontend and Art :)",
      image: "profile/yuval.png",
      body: "Yuval is probably messing with Plonkstars code (maliciously) or ballroom dancing right now.",
      linkedin: "https://www.linkedin.com/in/yuval-ailon/",
      github: "https://github.com/YuvalAilon",
    },
  ];

  return (
    <div>
      <div className="contacts-container grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 p-6 justify-items-center">

  
      {persons.map((person, number) => (
        <div key={number}>
        <ProfileCard
          image={person.image}
          name={person.name}
          title={person.title}
          body={person.body}
          linkedin={person.linkedin}
          github={person.github}
        /></div>
      ))}
    </div></div>
  );
}
