import axios from "axios";

export const getAccountsByName = async (name, onSuccess) => {
    try {
        const response = await axios.get(`http://localhost:8080/twitter/name/${name}`);
        const options = response.data.map(o => ({
            id: o.id,
            label: o.name,
            followers: o.followers_count,
            image: o.profile_image_url
        }));

        if (onSuccess) {
            onSuccess(options)
        }

        return options;
    } catch (error) {
        return error;
    }
};

export const getFollowersById = async (id, cursor = -1, order, orderBy) => {
    try {
        const response = await axios.get(`http://localhost:8080/twitter/followers/${id}/${cursor}`, {
            params: {
                order,
                orderBy,
            }
        });
        const followers = response.data.followers.users.map(o => ({
            id: o.id,
            name: o.name,
            screen_name: o.screen_name,
            image: o.profile_image_url,
            description: o.description,
            location: o.location,
        }));
        const count = response.data.user.followers_count;
        const cursors = {
            next: response.data.followers.next_cursor,
            previous: response.data.followers.previous_cursor,
        };

        return { followers, count, cursors };
    } catch (error) {
        return error;
    }
};