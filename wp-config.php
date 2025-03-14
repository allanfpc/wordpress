<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wp' );

/** Database username */
define( 'DB_USER', 'allanfpc' );

/** Database password */
define( 'DB_PASSWORD', 'Coveroot' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '|oY!]2k>x(D3B!sppj5SP[,*p+Tzvu92mZ[ntKwGj|EEh6b+2BPVN/Ws?H7wg_m@');
define('SECURE_AUTH_KEY',  '-x_cWc{1H_JSr2|}I&t7}3yeC%mNe[M~+KXiQ6{/^i+j_C-SKIxns:@%gV8><[+I');
define('LOGGED_IN_KEY',    '0wP!O3-qj+Of<kGgq$f3V6(!iE27+-2O*?Q]jUgMoS|.cv E<3?62oVQE~=i:Phl');
define('NONCE_KEY',        '0iUm1C+NF6#ZeZ:1Z,8a<PdWl3k)?4q2$sdhFGE)>-,;!ot %@Gsh,fF~~aXDcB4');
define('AUTH_SALT',        'B-z_-^tlQd-p]ts3R.+4&]0lSMiC;t}V=k0D1+YVe[}x>66j XqVfue&6T09_;8S');
define('SECURE_AUTH_SALT', 'xCI}8sN3+swuR<c(}$W,3z>tf4b-h5DJlDr5`HC7fCd_:$P/(h0AWiQhtEHTudJ-');
define('LOGGED_IN_SALT',   'zjaVIy(hPWP3M/xD3MVpl[1*l#ENF.a$K.+bL9%B+4J!>.X=Hhu}5ybN=>;#htj|');
define('NONCE_SALT',       'M:Ta8t(lN~n@r$X<feuA8U)m)iOX-(#vmtc2t=KeGqF:Y(?l%IVJ{kLFzx7Z]DHZ');

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */

/* Open Route API Key */
define('OPEN_ROUTE_API_KEY', '5b3ce3597851110001cf62483c25fd55fd6f48428c63be3bc8bb9d22');

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
