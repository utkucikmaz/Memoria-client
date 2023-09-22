import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AddEvent from "../components/AddEvent";
import AddGroupMember from "../components/AddGoupMember";



const API_URL = "http://localhost:5005";

function GroupDetailsPage(props) {
    const [group, setGroup] = useState(null);
    const { groupId } = useParams();

    const getGroup = () => {
        axios
            .get(`${API_URL}/api/groups/${groupId}`)
            .then((response) => {
                const oneGroup = response.data;
                setGroup(oneGroup);
                console.log(group.members)
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getGroup();
    }, []);

    return (
        <div className="GroupDetails w-full p-10">
            <div className="flex items-end gap-10">
                {group && (
                    <>
                        <h1>{group.name}</h1>
                        <p>{group.description}</p>
                    </>
                )}
            </div>
            

            <div className="flex p-10 gap-10">
                <div className="flex-col w-1/2 justify-start border ">
                    {group?.members
                        ? group.members.map((member) => { return (<p key={member._id}>{member.name}</p>) })
                        : null
                    }
                    <br />
                    

                    <AddGroupMember members={group?.members} fnUpdate={getGroup} />
                    
                </div>
                <div className="flex flex-col border">
                    <AddEvent refreshGroup={getGroup} groupId={groupId} />
                    {group &&
                        group.events.map((event) => (
                            <li className="EventCard card" key={event._id}>
                                <h3>{event.title}</h3>
                                <h4>Description:</h4>
                                <p>{event.description}</p>
                            </li>
                        ))}

                    
                </div>
                


            </div>
            <Link to="/groups">
                        <button>Back to Groups</button>
                    </Link>
                    <Link to={`/groups/edit/${groupId}`}>
                        <button>Edit Group</button>
                    </Link>











        </div>
    );
}

export default GroupDetailsPage;
