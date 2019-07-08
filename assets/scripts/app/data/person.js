/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.user = (function() {

    /**
     * Namespace user.
     * @exports user
     * @namespace
     */
    var user = {};

    /**
     * Sex enum.
     * @name user.Sex
     * @enum {string}
     * @property {number} male=0 male value
     * @property {number} female=1 female value
     */
    user.Sex = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "male"] = 0;
        values[valuesById[1] = "female"] = 1;
        return values;
    })();

    user.LoveGame = (function() {

        /**
         * Properties of a LoveGame.
         * @memberof user
         * @interface ILoveGame
         * @property {string|null} [name] LoveGame name
         * @property {string|null} [type] LoveGame type
         */

        /**
         * Constructs a new LoveGame.
         * @memberof user
         * @classdesc Represents a LoveGame.
         * @implements ILoveGame
         * @constructor
         * @param {user.ILoveGame=} [properties] Properties to set
         */
        function LoveGame(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoveGame name.
         * @member {string} name
         * @memberof user.LoveGame
         * @instance
         */
        LoveGame.prototype.name = "";

        /**
         * LoveGame type.
         * @member {string} type
         * @memberof user.LoveGame
         * @instance
         */
        LoveGame.prototype.type = "";

        /**
         * Creates a new LoveGame instance using the specified properties.
         * @function create
         * @memberof user.LoveGame
         * @static
         * @param {user.ILoveGame=} [properties] Properties to set
         * @returns {user.LoveGame} LoveGame instance
         */
        LoveGame.create = function create(properties) {
            return new LoveGame(properties);
        };

        /**
         * Encodes the specified LoveGame message. Does not implicitly {@link user.LoveGame.verify|verify} messages.
         * @function encode
         * @memberof user.LoveGame
         * @static
         * @param {user.ILoveGame} message LoveGame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoveGame.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
            return writer;
        };

        /**
         * Encodes the specified LoveGame message, length delimited. Does not implicitly {@link user.LoveGame.verify|verify} messages.
         * @function encodeDelimited
         * @memberof user.LoveGame
         * @static
         * @param {user.ILoveGame} message LoveGame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoveGame.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoveGame message from the specified reader or buffer.
         * @function decode
         * @memberof user.LoveGame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {user.LoveGame} LoveGame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoveGame.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.user.LoveGame();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.type = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoveGame message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof user.LoveGame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {user.LoveGame} LoveGame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoveGame.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoveGame message.
         * @function verify
         * @memberof user.LoveGame
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoveGame.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            return null;
        };

        /**
         * Creates a LoveGame message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof user.LoveGame
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {user.LoveGame} LoveGame
         */
        LoveGame.fromObject = function fromObject(object) {
            if (object instanceof $root.user.LoveGame)
                return object;
            var message = new $root.user.LoveGame();
            if (object.name != null)
                message.name = String(object.name);
            if (object.type != null)
                message.type = String(object.type);
            return message;
        };

        /**
         * Creates a plain object from a LoveGame message. Also converts values to other types if specified.
         * @function toObject
         * @memberof user.LoveGame
         * @static
         * @param {user.LoveGame} message LoveGame
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoveGame.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.type = "";
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            return object;
        };

        /**
         * Converts this LoveGame to JSON.
         * @function toJSON
         * @memberof user.LoveGame
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoveGame.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LoveGame;
    })();

    user.UserInfo = (function() {

        /**
         * Properties of a UserInfo.
         * @memberof user
         * @interface IUserInfo
         * @property {string|null} [name] UserInfo name
         * @property {number|null} [age] UserInfo age
         * @property {Array.<user.ILoveGame>|null} [game] UserInfo game
         * @property {user.Sex|null} [sex] UserInfo sex
         */

        /**
         * Constructs a new UserInfo.
         * @memberof user
         * @classdesc Represents a UserInfo.
         * @implements IUserInfo
         * @constructor
         * @param {user.IUserInfo=} [properties] Properties to set
         */
        function UserInfo(properties) {
            this.game = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserInfo name.
         * @member {string} name
         * @memberof user.UserInfo
         * @instance
         */
        UserInfo.prototype.name = "";

        /**
         * UserInfo age.
         * @member {number} age
         * @memberof user.UserInfo
         * @instance
         */
        UserInfo.prototype.age = 0;

        /**
         * UserInfo game.
         * @member {Array.<user.ILoveGame>} game
         * @memberof user.UserInfo
         * @instance
         */
        UserInfo.prototype.game = $util.emptyArray;

        /**
         * UserInfo sex.
         * @member {user.Sex} sex
         * @memberof user.UserInfo
         * @instance
         */
        UserInfo.prototype.sex = 0;

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @function create
         * @memberof user.UserInfo
         * @static
         * @param {user.IUserInfo=} [properties] Properties to set
         * @returns {user.UserInfo} UserInfo instance
         */
        UserInfo.create = function create(properties) {
            return new UserInfo(properties);
        };

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link user.UserInfo.verify|verify} messages.
         * @function encode
         * @memberof user.UserInfo
         * @static
         * @param {user.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.age != null && message.hasOwnProperty("age"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.age);
            if (message.game != null && message.game.length)
                for (var i = 0; i < message.game.length; ++i)
                    $root.user.LoveGame.encode(message.game[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.sex != null && message.hasOwnProperty("sex"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.sex);
            return writer;
        };

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link user.UserInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof user.UserInfo
         * @static
         * @param {user.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @function decode
         * @memberof user.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {user.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.user.UserInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.age = reader.int32();
                    break;
                case 3:
                    if (!(message.game && message.game.length))
                        message.game = [];
                    message.game.push($root.user.LoveGame.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.sex = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof user.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {user.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserInfo message.
         * @function verify
         * @memberof user.UserInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.age != null && message.hasOwnProperty("age"))
                if (!$util.isInteger(message.age))
                    return "age: integer expected";
            if (message.game != null && message.hasOwnProperty("game")) {
                if (!Array.isArray(message.game))
                    return "game: array expected";
                for (var i = 0; i < message.game.length; ++i) {
                    var error = $root.user.LoveGame.verify(message.game[i]);
                    if (error)
                        return "game." + error;
                }
            }
            if (message.sex != null && message.hasOwnProperty("sex"))
                switch (message.sex) {
                default:
                    return "sex: enum value expected";
                case 0:
                case 1:
                    break;
                }
            return null;
        };

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof user.UserInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {user.UserInfo} UserInfo
         */
        UserInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.user.UserInfo)
                return object;
            var message = new $root.user.UserInfo();
            if (object.name != null)
                message.name = String(object.name);
            if (object.age != null)
                message.age = object.age | 0;
            if (object.game) {
                if (!Array.isArray(object.game))
                    throw TypeError(".user.UserInfo.game: array expected");
                message.game = [];
                for (var i = 0; i < object.game.length; ++i) {
                    if (typeof object.game[i] !== "object")
                        throw TypeError(".user.UserInfo.game: object expected");
                    message.game[i] = $root.user.LoveGame.fromObject(object.game[i]);
                }
            }
            switch (object.sex) {
            case "male":
            case 0:
                message.sex = 0;
                break;
            case "female":
            case 1:
                message.sex = 1;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof user.UserInfo
         * @static
         * @param {user.UserInfo} message UserInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.game = [];
            if (options.defaults) {
                object.name = "";
                object.age = 0;
                object.sex = options.enums === String ? "male" : 0;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.age != null && message.hasOwnProperty("age"))
                object.age = message.age;
            if (message.game && message.game.length) {
                object.game = [];
                for (var j = 0; j < message.game.length; ++j)
                    object.game[j] = $root.user.LoveGame.toObject(message.game[j], options);
            }
            if (message.sex != null && message.hasOwnProperty("sex"))
                object.sex = options.enums === String ? $root.user.Sex[message.sex] : message.sex;
            return object;
        };

        /**
         * Converts this UserInfo to JSON.
         * @function toJSON
         * @memberof user.UserInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UserInfo;
    })();

    return user;
})();

module.exports = $root;
