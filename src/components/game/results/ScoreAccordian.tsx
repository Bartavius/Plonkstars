import Table from '@/components/table/table';
import './results.css';
import ScoreBox from '@/components/game/summary/ScoreBox';
import UserIcon from "@/components/user/UserIcon";

export default function ScoreAccordion({
    open,
    className,
    guesses,
    user,
}: {
    open: boolean;
    className?: string;
    guesses: any[];
    user?: any;
}) {
    console.log(guesses);
    const headers = {
        total: 'Total',
        guess: 'Guess',
    };

    console.log(guesses);

    const data = guesses.map((guess) => {
        return {
            total: <ScoreBox data={guess}/>,
            guess: <ScoreBox data={guess.guess}/>,
            heading: (
                <div className="round-rank-box">
                  <div className="round-rank-number-text">#{guess.rank}<UserIcon data={guess.user.user_cosmetics} className="round-leaderboard-avatar"/></div>
                  
                  <div className="round-user-name-text">{guess.user.username}</div>
                </div>
            ),
            style: user && guess.user.username === user.username && "round-highlight-self-row",
        };
    });
    return (
        <div className={`${className} leaderboard-accordion`}>
            {open && (
                <div className="accordion-content">
                    <Table data={data} headers={headers} rowHeader="heading" className='w-full'/>
                </div>
            )}
        </div>
    );
}