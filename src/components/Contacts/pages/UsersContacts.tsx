import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store"; // Import AppDispatch type
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Separator } from "../../ui/separator";
// import { useNavigate } from "react-router-dom";

interface Props {
  // define your props here
}

const UsersContacts: React.FC<Props> = () => {
  //   const navigate = useNavigate();
  const { userContacts } = useSelector(
    (UserContact: RootState) => UserContact.getUserContacts
  );

  return (
    <div className="p-1">
      {userContacts.map((item) => (
        <React.Fragment key={item._id}>
          <div className="text-sm flex flex-row items-center justify-between gap-5 ">
            <div className="flex flex-row items-center gap-2">
              <Avatar className="z-0">
                <AvatarImage
                  className="rounded-full w-10 "
                  src={item.contact_image}
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>{" "}
              <div className="flex flex-col">
                <p>{item.contact_name}</p>
                <p>{item.contact_email}</p>
              </div>
            </div>

            {/* <div>
              <Button className="bg-muted text-muted-foreground hover:text-black"></Button>
            </div> */}
          </div>
          <Separator className="my-2" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default UsersContacts;
