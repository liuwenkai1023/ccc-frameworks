import * as $protobuf from protobuf;
/** Namespace user. */
export namespace user {

    /** Sex enum. */
    enum Sex {
        male = 0,
        female = 1
    }

    /** Properties of a LoveGame. */
    interface ILoveGame {

        /** LoveGame name */
        name?: (string|null);

        /** LoveGame type */
        type?: (string|null);
    }

    /** Represents a LoveGame. */
    class LoveGame implements ILoveGame {

        /**
         * Constructs a new LoveGame.
         * @param [properties] Properties to set
         */
        constructor(properties?: user.ILoveGame);

        /** LoveGame name. */
        public name: string;

        /** LoveGame type. */
        public type: string;

        /**
         * Creates a new LoveGame instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoveGame instance
         */
        public static create(properties?: user.ILoveGame): user.LoveGame;

        /**
         * Encodes the specified LoveGame message. Does not implicitly {@link user.LoveGame.verify|verify} messages.
         * @param message LoveGame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: user.ILoveGame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoveGame message, length delimited. Does not implicitly {@link user.LoveGame.verify|verify} messages.
         * @param message LoveGame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: user.ILoveGame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoveGame message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoveGame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): user.LoveGame;

        /**
         * Decodes a LoveGame message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoveGame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): user.LoveGame;

        /**
         * Verifies a LoveGame message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoveGame message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoveGame
         */
        public static fromObject(object: { [k: string]: any }): user.LoveGame;

        /**
         * Creates a plain object from a LoveGame message. Also converts values to other types if specified.
         * @param message LoveGame
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: user.LoveGame, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoveGame to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a UserInfo. */
    interface IUserInfo {

        /** UserInfo name */
        name?: (string|null);

        /** UserInfo age */
        age?: (number|null);

        /** UserInfo game */
        game?: (user.ILoveGame[]|null);

        /** UserInfo sex */
        sex?: (user.Sex|null);
    }

    /** Represents a UserInfo. */
    class UserInfo implements IUserInfo {

        /**
         * Constructs a new UserInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: user.IUserInfo);

        /** UserInfo name. */
        public name: string;

        /** UserInfo age. */
        public age: number;

        /** UserInfo game. */
        public game: user.ILoveGame[];

        /** UserInfo sex. */
        public sex: user.Sex;

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserInfo instance
         */
        public static create(properties?: user.IUserInfo): user.UserInfo;

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link user.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: user.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link user.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: user.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): user.UserInfo;

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): user.UserInfo;

        /**
         * Verifies a UserInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserInfo
         */
        public static fromObject(object: { [k: string]: any }): user.UserInfo;

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @param message UserInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: user.UserInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
