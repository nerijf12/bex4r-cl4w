<?php 
/*
* Plugin Name: Infographic Maker iList
* Plugin URI: https://wordpress.org/plugins/infographic-and-list-builder-iList
* Description: Infographics & elegant Lists with charts and graphs. Build HTML, Responsive infographics & elegant Text or Image Lists quickly.
* Version: 4.2.6
* Author: QuantumCloud
* Author URI: https://www.quantumcloud.com/
* Requires at least: 4.6
* Tested up to: 5.4
* Domain Path: /lang/
* License: GPL2
*/

 defined('ABSPATH') or die("No direct script access!");
 
 //Custom Constants
define('QCOPD_URL1', plugin_dir_url(__FILE__));
define('QCOPD_IMG_URL1', QCOPD_URL1 . "/assets/images");
define('QCOPD_ASSETS_URL1', QCOPD_URL1 . "/assets");

define('QCOPD_DIR1', dirname(__FILE__));
define('QCOPD_INC_DIR1', QCOPD_DIR1 . "/inc");


require_once( 'qc-project-ilist-frameworks.php' );
require_once( 'qc-project-ilist-post-type.php' );
require_once( 'qc-project-ilist-asset.php' );
require_once( 'qc-project-ilist-ajax.php' );
require_once( 'qc-project-ilist-shortcode.php' );
require_once( 'qc-project-ilist-hook.php' );
require_once( 'qc-project-ilist-chart.php' );
require_once( 'qc-project-ilist-fa.php' );
require_once('class-plugin-deactivate-feedback.php');
require_once('qc-support-promo-page/class-qc-support-promo-page.php');
require_once('class-qc-free-plugin-upgrade-notice.php');


function qcld_ilist_order_index_catalog_menu_page( $menu_ord )
{

 global $submenu;

 // Enable the next line to see a specific menu and it's order positions
 //echo '<pre>'; print_r( $submenu['edit.php?post_type=ilist'] ); echo '</pre>'; exit();

 // Sort the menu according to your preferences
 //Original order was 5,11,12,13,14,15

	$arr = array();

	@$arr[] = $submenu['edit.php?post_type=ilist'][5];
	@$arr[] = $submenu['edit.php?post_type=ilist'][10];
	@$arr[] = $submenu['edit.php?post_type=ilist'][11];
	@$arr[] = $submenu['edit.php?post_type=ilist'][12];
	@$arr[] = $submenu['edit.php?post_type=ilist'][250];
 
	if( isset($submenu['edit.php?post_type=ilist'][300]) ){
		$arr[] = $submenu['edit.php?post_type=ilist'][300];
	}

 $submenu['edit.php?post_type=ilist'] = $arr;

 return $menu_ord;

}

// add the filter to wordpress
add_filter( 'custom_menu_order', 'qcld_ilist_order_index_catalog_menu_page' );



add_action( 'admin_menu' , 'qcilist_help_link_submenu', 20 );
function qcilist_help_link_submenu(){
	global $submenu;
	
	$link_text = "Help";
	$submenu["edit.php?post_type=ilist"][250] = array( $link_text, 'activate_plugins' , admin_url('edit.php?post_type=ilist&page=ilist_settings#help') );
	ksort($submenu["edit.php?post_type=ilist"]);
	
	return ($submenu);
}

function ilist_options_instructions_example() {
    global $my_admin_page;
    $screen = get_current_screen();
    
    if ( is_admin() && ($screen->post_type == 'ilist') ) {

        ?>
        <div class="notice notice-info is-dismissible ilist-notice" style="display:none"> 
            <div class="ilist_info_carousel">

                <div class="ilist_info_item">**iList Pro Tip: Did you know that <strong style="color: yellow">75+</strong> template available in iList pro version? Upgrade to iList Pro.</div>
                
                <div class="ilist_info_item">**iList Pro Tip: After creating list you can display infographic with any of our <strong style="color: yellow">Available Templates</strong> by creating shortcode with <strong style="color: yellow">shortcode generator</strong>.</div>
                
                <div class="ilist_info_item">**iList Tip: You can create 3 types of list. Info Lists, Graphic Lists, Infographic Lists.</div>
                
				<div class="ilist_info_item">**iList Pro Tip: <strong style="color: yellow">Background color, Text color, Font size, Font family</strong> customization option is available in iList pro. Display infographic list in your way.</div>
				
				<div class="ilist_info_item">**iList Pro Tip: <strong style="color: yellow">Progress Bar option</strong> is available in Pro version that makes your infographic list more informative.</div>
				
				<div class="ilist_info_item">**iList Pro Tip: <strong style="color: yellow">Infographic List Compare</strong> option is available in Pro version that allow you to compare two lists in one template.</div>
				
				<div class="ilist_info_item">**iList Pro Tip: <strong style="color: yellow">Two Compare Template</strong> is available in Pro version.</div>
				
				<div class="ilist_info_item">**iList Pro Tip: <strong style="color: yellow">Awesome Boxed Layout</strong> is available in Pro version.</div>
				
				<div class="ilist_info_item">**iList Pro Tip: <strong style="color: yellow">Embed Option</strong> is available in Pro version that allow you to add your infographic lists any <strong style="color: yellow">Web Page</strong>. </div>
				
				<div class="ilist_info_item">**iList Pro Tip: iChart with advance 4 types of chart only available in pro version. <strong style="color: yellow">Radar, Polar Area, Pie, Doughnut</strong>.</div>
				
            </div>
            <script>
                jQuery(document).ready(function($){

                    $('.ilist-notice').show();
                    $('.ilist_info_carousel').slick({
                        dots: false,
                        infinite: true,
                        speed: 1200,
                        slidesToShow: 1,
                        autoplaySpeed: 11000,
                        autoplay: true,
                        slidesToScroll: 1,
                    });
                });
            </script>
        </div>
        <?php
    }
}

add_action( 'admin_notices', 'ilist_options_instructions_example' );


add_action( 'add_meta_boxes', 'ilist_meta_box_video' );
function ilist_meta_box_video()
{					                  // --- Parameters: ---
    add_meta_box( 'qc-sld-meta-box-id', // ID attribute of metabox
                  'Shortcode Generator for iList',       // Title of metabox visible to user
                  'ilist_meta_box_callback', // Function that prints box in wp-admin
                  'page',              // Show box for posts, pages, custom, etc.
                  'side',            // Where on the page to show the box
                  'high' );            // Priority of box in display order
}

function ilist_meta_box_callback( $post )
{
    ?>
    <p>
        <label for="sh_meta_box_bg_effect"><p>Click the button below to generate shortcode</p></label>
		<input type="button" id="ilist_shortcode_generator_meta" class="button button-primary button-large" value="Generate Shortcode" />
    </p>
    
    <?php
}

add_action( 'plugins_loaded', 'ilist_plugin_loaded_fnc' );
function ilist_plugin_loaded_fnc(){

	if(!get_option('ilist_ot_convrt')){
		$prevOptions = get_option('option_tree');		
		if(array_key_exists('sl_enable_rtl', $prevOptions)){
			
			foreach($prevOptions as $key=>$val){
				
				update_option( $key, $val);
			}
		}		
		add_option( 'ilist_ot_convrt', 'yes');
	}

}

function ilist_activation_redirect( $plugin ) {
    if( $plugin == plugin_basename( __FILE__ ) ) {
        exit( wp_redirect( admin_url( 'edit.php?post_type=ilist&page=ilist_settings#help') ) );
    }
}
add_action( 'activated_plugin', 'ilist_activation_redirect' );

if( function_exists('register_block_type') ){
	function qcopd_ilist_gutenberg_block() {
	    require_once plugin_dir_path( __FILE__ ).'/gutenberg/ilist-block/plugin.php';
	}
	add_action( 'init', 'qcopd_ilist_gutenberg_block' );
}
$ilist_feedback = new Wp_Usage_ilist_Feedback(
			__FILE__,
			'plugins@quantumcloud.com',
			false,
			true

		);