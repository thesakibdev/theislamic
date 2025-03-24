import {
  Angry,
  Calendar,
  Forward,
  Frown,
  Meh,
  Smile,
  SmilePlus,
} from "lucide-react";
import blogThumbnail from "../../../assets/index-page-banner.png";
import blogAvatar from "../../../assets/auth-profile-bg.png";
import { FaRegCommentDots, FaRegFolder } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ratingOptions = [
  {
    emoji: <Angry color="#FC5C65" />,
    value: 1,
    color: "#FC5C65",
    label: "Angry",
  },
  {
    emoji: <Frown color="#FA8231" />,
    value: 2,
    color: "#FA8231",
    label: "Average",
  },
  {
    emoji: <Meh color="#F7B731" />,
    value: 3,
    color: "#F7B731",
    label: "Normal",
  },
  {
    emoji: <Smile color="#45AAF2" />,
    value: 4,
    color: "#45AAF2",
    label: "Good",
  },
  {
    emoji: <SmilePlus color="#26DE81" />,
    value: 5,
    color: "#26DE81",
    label: "Excellent",
  },
];

export default function BlogDetails() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [rating, setRating] = useState(null);
  const [selecRating, setSelectRating] = useState({
    label: "",
    color: "",
  });

  const onSubmit = (data) => {
    data.rating = rating;
    console.log("Form Data:", data);
    reset();
    setRating(null);
  };

  return (
    <section className="pt-16 px-4 md:px-0">
      <div className="max-w-5xl mx-auto py-5">
        <div className="bg-primary-foreground/20 flex flex-col justify-center p-4 rounded-lg">
          <h2 className="text-3xl font-bold text-black mb-4">
            How to Spend the Perfect Day on Croatia’s Most Magical Island
          </h2>
          <div className="overflow-hidden rounded-lg max-h-[500px] object-center">
            <img
              src={blogThumbnail}
              alt="Blog Thumbnail"
              className="object-cover w-full rounded-lg "
            />
          </div>
        </div>
        <div className="flex justify-center items-center mt-3 gap-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 inline-block" />
            <span className="text-sm">July 14, 2021</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRegCommentDots className="w-6 h-6 inline-block" />
            <span className="text-sm">Comments: 12</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRegFolder className="w-6 h-6 inline-block" />
            <span className="text-sm">Category: It</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-5">
          <p className="font-semibold text-xl">
            Don’t wait. The purpose of our lives is to be happy!
          </p>
          <p className="text-justify text-lg font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
            repudiandae aut nihil, possimus placeat tenetur aperiam aliquam, ex
            suscipit alias, nam quibusdam culpa error! Amet perferendis quaerat,
            voluptate cumque autem quos fugiat assumenda ipsum neque eaque?
            Perferendis, blanditiis magnam doloribus molestias quos ex molestiae
            voluptates suscipit placeat incidunt maiores deleniti! Voluptatibus
            veniam hic eligendi, iusto, consectetur id tenetur laudantium
            aliquid harum, officiis autem minima ea. Delectus error eos numquam
            porro repudiandae ea illum perferendis, nihil, ipsum excepturi minus
            temporibus, aliquam amet. Atque, consequuntur omnis nihil dolores
            numquam sunt tempore distinctio ipsum laborum vero maxime.
            Temporibus quia commodi voluptas nobis eaque et minus fugit nihil
            odit quod nisi, voluptatum quas, aspernatur ipsa id deserunt? Autem
            velit molestiae quia delectus ex veritatis numquam culpa tenetur
            provident eius? Iusto iure perspiciatis dolores nemo tenetur
            consectetur, non architecto eos quis ad nesciunt aspernatur earum
            veritatis magni mollitia corrupti omnis illo debitis eius accusamus!
            Quos alias illum sapiente deserunt omnis explicabo nemo laudantium
            aperiam repellendus at, ad architecto animi facere quo ratione,
            fugit earum nam assumenda dicta non! Molestiae modi earum qui in,
            corrupti voluptas dolorem nihil dolor, ducimus magnam illo expedita
            optio? Quia eveniet ducimus ut distinctio enim nulla consectetur
            delectus. Reprehenderit cumque ipsa perferendis eos dicta
            recusandae, rem tempora officia aspernatur nam sapiente numquam
            explicabo, quisquam dolorum vitae quo nemo atque laboriosam nulla
            quos eligendi, corporis unde? Quos laudantium vero voluptas
            cupiditate sapiente enim totam veniam saepe accusantium dolorem
            ullam, eaque asperiores quidem nihil perferendis fugiat omnis
            laboriosam veritatis nesciunt doloremque minus animi? Rem provident
            illo magnam assumenda id quidem nam iure saepe nulla ipsa sint
            fugiat repellendus, eveniet pariatur quisquam neque explicabo at
            porro? Ab aspernatur reiciendis temporibus eius qui a consectetur
            repellendus. Aut fugit et laudantium.
          </p>
        </div>
        {/* comments */}
        <div className="my-4">
          <h2 className="text-2xl font-bold"> Comments</h2>
          {/* all comments */}
          <div className="mt-4">
            <div className="bg-slate-500/20 p-4 rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={blogThumbnail}
                    className="w-12 h-12 rounded-xl"
                    alt="avatar image"
                  />
                  <div>
                    <h2>John Doe</h2>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 inline-block" />
                      <span className="text-sm">July 14, 2021</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="flex bg-slate-400/50 hover:bg-slate-400 transition-all duration-300 text-xl capitalize p-2 rounded-lg">
                    <Forward />
                    reply
                  </button>
                </div>
              </div>
              <p className="text-lg text-justify mt-4 mb-10">
                When you are ready to indulge your sense of excitement, check
                out the range of water- sports opportunities at the resort’s
                on-site water-sports center. Want to leave your stress on the
                water? The resort has kayaks, paddleboards, or the low-key pedal
                boats.
              </p>
            </div>

            <div className="bg-white shadow-lg p-2 max-w-3xl mx-auto transform -translate-y-16 rounded-lg">
              <div className=" p-4 rounded-lg mt-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={blogAvatar}
                      className="w-12 h-12 rounded-xl"
                      alt="avatar image"
                    />
                    <div>
                      <h2>Petricia</h2>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 inline-block" />
                        <span className="text-sm">July 04, 2022</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-justify mt-4">
                  An island (or isle) is an isolated piece of habitat that is
                  surrounded by a dramatically different habitat, such as water.
                  Very small islands such as emergent land features on atolls
                  can be called islets, skerries, cays or keys.
                </p>
              </div>

              <div className=" p-4 rounded-lg mt-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={blogAvatar}
                      className="w-12 h-12 rounded-xl"
                      alt="avatar image"
                    />
                    <div>
                      <h2>Petricia</h2>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 inline-block" />
                        <span className="text-sm">July 04, 2022</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-justify mt-4">
                  An island (or isle) is an isolated piece of habitat that is
                  surrounded by a dramatically different habitat, such as water.
                  Very small islands such as emergent land features on atolls
                  can be called islets, skerries, cays or keys.
                </p>
              </div>
            </div>

            <div className="bg-slate-500/20 p-4 rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={blogAvatar}
                    className="w-12 h-12 rounded-xl"
                    alt="avatar image"
                  />
                  <div>
                    <h2>Petricia</h2>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 inline-block" />
                      <span className="text-sm">July 04, 2022</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="flex bg-slate-400/50 hover:bg-slate-400 transition-all duration-300 text-xl capitalize p-2 rounded-lg">
                    <Forward />
                    reply
                  </button>
                </div>
              </div>
              <p className="text-lg text-justify mt-4">
                An island (or isle) is an isolated piece of habitat that is
                surrounded by a dramatically different habitat, such as water.
                Very small islands such as emergent land features on atolls can
                be called islets, skerries, cays or keys.
              </p>
            </div>
          </div>

          {/* add comment */}
          <div className="p-6 bg-white">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add A Comment
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
                <div>
                  {/* Name Field */}
                  <div className="flex flex-col gap-2">
                    <label className="block font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className={`w-full p-2 border rounded-md focus:border-primary outline-none ${
                        errors.name && "border-red-500"
                      }`}
                    />
                  </div>

                  {/* Website Field */}
                  <div className="flex flex-col gap-2">
                    <label className="block font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="text"
                      {...register("website")}
                      className={`w-full p-2 border rounded-md focus:border-primary outline-none ${
                        errors.website && "border-red-500"
                      }`}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-2">
                    <label className="block font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Invalid email format",
                        },
                      })}
                      className={`w-full p-2 border rounded-md focus:border-primary outline-none ${
                        errors.email && "border-red-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Comment Field */}
                <div className="h-full flex flex-col gap-2">
                  <label className="block font-medium text-gray-700">
                    Comment
                  </label>
                  <textarea
                    {...register("comment", {
                      required: "Comment is required",
                    })}
                    className={`w-full p-2 border rounded-md focus:border-primary outline-none ${
                      errors.comment && "border-red-500"
                    }`}
                    placeholder="Your Comment Here"
                    rows="6"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                {/* Rating Section */}
                <div className="w-full bg-slate-300 px-3 py-2 rounded-lg flex items-center justify-between  gap-4">
                  <label className="block font-medium text-gray-700 ">
                    Rate The Usefulness Of The Article
                  </label>
                  <div className="flex space-x-2 ">
                    {ratingOptions.map((emoji) => (
                      <button
                        key={emoji.value}
                        type="button"
                        // onChange={() => setRating(emoji.label)}
                        className={`p-2 transition-all duration-300 flex items-center gap-1 text-2xl  bg-slate-200 rounded-lg`}
                        onClick={() => {
                          setRating(emoji.label);
                          setSelectRating({
                            label: emoji.label,
                            color: emoji.color,
                          });
                        }}
                      >
                        {emoji.emoji} {selecRating.label && selecRating.label === emoji.label && <span className="text-base">{selecRating.label}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="w-1/5 flex justify-end">
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    💬 Send Comment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
