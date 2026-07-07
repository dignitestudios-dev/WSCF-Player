const registeredPlayersList: TournamentDetailsPlayer[] = [
  { id: "1", userId: "CHS10211", name: "Ethan Carter", rating: 1245 },
  { id: "2", userId: "CHS10222", name: "Liam Turner", rating: 1310 },
  { id: "3", userId: "CHS10233", name: "Olivia Brooks", rating: 1188 },
  { id: "4", userId: "CHS10244", name: "Liam Turner", rating: 1422 },
  { id: "5", userId: "CHS10255", name: "Sophia Mitchell", rating: 1276 },
  { id: "6", userId: "CHS10266", name: "Noah Bennett", rating: 1355 },
  { id: "7", userId: "CHS10277", name: "Ava Richardson", rating: 1214 },
  { id: "8", userId: "CHS10288", name: "Mason Cooper", rating: 1245 },
  { id: "9", userId: "CHS10299", name: "Isabella Reed", rating: 1299 },
  { id: "10", userId: "CHS10301", name: "Lucas Foster", rating: 1384 },
  { id: "11", userId: "CHS102512", name: "Ethan Carter", rating: 1276 },
  { id: "12", userId: "CHS10223", name: "Sophia Mitchell", rating: 1276 },
];

export const tournamentCatalog: TournamentDetails[] = [
  {
    id: "1",
    title: "USCF-Rated Scholastic May Summer Tournament",
    location: "Old Guard Games",
    date: "June 20, 2026",
    registeredCount: 12,
    players: registeredPlayersList,
  },
  {
    id: "2",
    title: "Professional Online Blitz Battle Championship",
    location: "Old Guard Games",
    date: "June 20, 2026",
    registeredCount: 12,
    players: registeredPlayersList,
  },
  {
    id: "3",
    title: "Wisconsin Spring Open Championship",
    location: "Old Guard Games",
    date: "July 12, 2026",
    registeredCount: 12,
    players: registeredPlayersList,
  },
  {
    id: "4",
    title: "Junior Rapid Chess Challenge",
    location: "Milwaukee Chess Center",
    date: "August 5, 2026",
    registeredCount: 12,
    players: registeredPlayersList,
  },
];

export function getTournamentById(id: string): TournamentDetails | undefined {
  return tournamentCatalog.find((tournament) => tournament.id === id);
}
