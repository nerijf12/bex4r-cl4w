<?php 
//<--Registering custom post and Taxonomie for iList

function qcilist_custom_post_text() {
	//Registering Custom Post
		$qc_list_labels = array(
		'name'               => _x( 'Manage iList Items', 'qc-opd' ),
		'singular_name'      => _x( 'Manage iList Item', 'qc-opd' ),
		'add_new'            => _x( 'New iList', 'qc-opd' ),
		'add_new_item'       => __( 'Add New iList' ),
		'edit_item'          => __( 'Edit iList Item' ),
		'new_item'           => __( 'New iList Item' ),
		'all_items'          => __( 'Manage iList Items' ),
		'view_item'          => __( 'View iList Item' ),
		'search_items'       => __( 'Search List Item' ),
		'not_found'          => __( 'No List Item found' ),
		'not_found_in_trash' => __( 'No List Item found in the Trash' ), 
		'parent_item_colon'  => '',
		'menu_name'			 => __('iList')
		
	);
	
	$qc_list_args = array(
		'labels'        => $qc_list_labels,
		'description'   => 'This post type holds all posts for your directory items.',
		'public'        => true,
		'publicly_queryable' => false,  // you should be able to query it
		
		'exclude_from_search' => true,
		
		'show_in_menu' => true,
		'supports'      => array( 'title' ),
		'has_archive'   => true,
		'menu_icon' 	=> 'dashicons-editor-ol',
	);
	
	register_post_type( 'ilist', $qc_list_args );
// Registering Taxonomies
	// $labels = array(
	// 	'name'              => _x( 'iList Categories', 'iList Categories', 'qc-opd' ),
	// 	'singular_name'     => _x( 'Category', 'taxonomy singular name', 'qc-opd' ),
	// 	'search_items'      => __( 'Search iList Categories', 'qc-opd' ),
	// 	'all_items'         => __( 'All iList Categories', 'qc-opd' ),
	// 	'parent_item'       => __( 'Parent iList Categories', 'qc-opd' ),
	// 	'parent_item_colon' => __( 'Parent iList Category:', 'qc-opd' ),
	// 	'edit_item'         => __( 'Edit iList Category', 'qc-opd' ),
	// 	'update_item'       => __( 'Update iList Category', 'qc-opd' ),
	// 	'add_new_item'      => __( 'Add New iList Category', 'qc-opd' ),
	// 	'new_item_name'     => __( 'New iList Category Name', 'qc-opd' ),
	// 	'menu_name'         => __( 'iList Categories', 'qc-opd' ),
	// );

	// $args = array(
	// 	'hierarchical'      => true,
	// 	'labels'            => $labels,
	// 	'show_ui'           => true,
	// 	'show_admin_column' => true,
	// 	'query_var'         => true,
	// 	'rewrite'           => array( 'slug' => 'sl_cat' ),
	// );

	// register_taxonomy( 'sl_cat', array( 'ilist' ), $args );
}
add_action('init', 'qcilist_custom_post_text');
//End Custom Post and Taxonomie-->

//File Required for metabox

if(function_exists('is_plugin_active')){
	if(!is_plugin_active('CMB2/init.php')){
		require_once QCOPD_INC_DIR1 . '/CMB2/init.php';
	}
}else{
	include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
	if(!is_plugin_active('CMB2/init.php')){
		require_once QCOPD_INC_DIR1 . '/CMB2/init.php';
	}
}
require_once( QCOPD_INC_DIR1 . '/CMB2/cmb2-conditionals.php' );


//<--Registering repeatable group field metabox.

add_action( 'cmb2_admin_init', 'ilist_shortcode_register_appearance_metabox' );
function ilist_shortcode_register_appearance_metabox() {
	
	$cmb_shortcode = new_cmb2_box( array(
		'id'            => 'ilist_shortcode_conf',
		'title'         => esc_html__( 'Shortcode Settings', 'cmb2' ),
		'object_types'  => array( 'ilist' ), // Post type
		 'closed'     => true,
		 'classes'    => 'extra-class',
		 

	) );


	// shortcode feature...

	$cmb_shortcode->add_field( array(
		'name'    => __( 'Column', 'cmb2' ),
		'id'      => 'shortcode_column',
		'type'    => 'radio_inline',
		'options' => array(
			'1' => __( '1', 'cmb2' ),
			'2' => __( '2', 'cmb2' ),
		),
		'default' => '2',
	) );

	$cmb_shortcode->add_field( array(
		'name'    => __( 'Upvote', 'cmb2' ),
		'id'      => 'shortcode_upvote',
		'type'    => 'radio_inline',
		'options' => array(
			'on' => __( 'Yes', 'cmb2' ),
			'off' => __( 'No', 'cmb2' ),
		),
		'default' => 'on',
	) );

	$cmb_shortcode->add_field( array(
		'name'    => __( 'Lightbox', 'cmb2' ),
		'id'      => 'shortcode_disable_lightbox',
		'type'    => 'radio_inline',
		'options' => array(
			'true' => __( 'Yes', 'cmb2' ),
			'false' => __( 'No', 'cmb2' ),
		),
		'default' => 'true',
	) );


// shortcode feature...
//Code for create column
// $cmb2Grid = new \Cmb2Grid\Grid\Cmb2Grid($cmb_shortcode);
// // shortcode generate...
// $row = $cmb2Grid->addRow();
// $row->addColumns(array($shortcode_1, $shortcode_2,$shortcode_3));
// $row = $cmb2Grid->addRow();
// $row->addColumns(array($shortcode_4, $shortcode_5,$shortcode_6));
	



}

//<--Registering repeatable group field metabox.
add_action( 'cmb2_admin_init', 'qcilist_register_sl_repeatable_group_field_metabox' );
function qcilist_register_sl_repeatable_group_field_metabox(){

	$prefix = '_sl_';
	$cmb_group = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => esc_html__( 'List Elements', 'cmb2' ),
		'object_types' => array( 'ilist' ),
	) );
//Creating post type
	$cmb_group->add_field( array(
		'name'    => esc_html__( 'Select List Type', 'cmb2' ),
		'desc'    =>esc_html__( 'Please select list type.', 'cmb2' ),
		'id'      => 'post_type_radio_sl',
		'type'    => 'radio_inline',
		'options' => array(
			'textlist' => esc_html__( 'Info Lists', 'cmb2' ),
			'imagelist' => esc_html__( 'Graphic Lists', 'cmb2' ),
			'elegant' => esc_html__( 'Infographic Lists', 'cmb2' ),
		),
		'default' => 'elegant',
	) );
//<--Template Part goes here
// Template for Elegant
/*
$cmb_group->add_field( array(
		'name'             => esc_html__('Premium Templates'),
		'desc'    => esc_html__( '', 'cmb2' ),
		'id'               => 'qcld_sl_template_elegant',
		'type'             => 'select',
		'show_option_none' => true,
		    'default'          => '',
			'options'          => array(
				'premium-graphic-style-01' => esc_html__( 'Premium Style 01', 'cmb2' ),

			),
			'attributes' => array(
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => 'imagelist',
		)
		
	) );
	
$cmb_group->add_field( array(
		'name'             => esc_html__('Premium Templates'),
		'desc'    => esc_html__( '', 'cmb2' ),
		'id'               => 'qcld_sl_template_elegant1',
		'type'             => 'select',
		'show_option_none' => true,
		    'default'          => '',
			'options'          => array(
				'premium-info-01' => esc_html__( 'Premium Info 01', 'cmb2' ),
				'premium-info-02'   => esc_html__( 'Premium Info 02', 'cmb2' ),
				'premium-info-03'   => esc_html__( 'Premium Info 03', 'cmb2' ),
				'premium-info-04'   => esc_html__( 'Premium Info 04', 'cmb2' ),
				'premium-info-05'   => esc_html__( 'Premium Info 05', 'cmb2' ),
				'premium-info-06'   => esc_html__( 'Premium Info 06', 'cmb2' ),
				'premium-info-07'   => esc_html__( 'Premium Info 07', 'cmb2' ),
				
			),
			'attributes' => array(
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => 'textlist',
		)
		
	) );
	$cmb_group->add_field( array(
		'name'             => esc_html__('Premium Templates'),
		'desc'    => esc_html__( '', 'cmb2' ),
		'id'               => 'qcld_sl_template_elegant2',
		'type'             => 'select',
		'show_option_none' => true,
		    'default'          => '',
			'options'          => array(
			
				'chocolate-style-01' => esc_html__( 'Chocolate Style 01', 'cmb2' ),
				'chocolate-style-02'   => esc_html__( 'Chocolate Style 02', 'cmb2' ),
				'origami-style-04'   => esc_html__( 'Origami Style 04', 'cmb2' ),
				
				'origami-style-06'   => esc_html__( 'Origami Style 06', 'cmb2' ),
				'origami-style-07'   => esc_html__( 'Origami Style 07', 'cmb2' ),
				'origami-style-08'   => esc_html__( 'Origami Style 08', 'cmb2' ),
				'origami-style-09'   => esc_html__( 'Origami Style 09', 'cmb2' ),
				
				'premium-style-01'   => esc_html__( 'Premium Style 01', 'cmb2' ),
				'premium-style-02'   => esc_html__( 'Premium Style 02', 'cmb2' ),
				'premium-style-04'   => esc_html__( 'Premium Style 04', 'cmb2' ),
				'premium-style-05'   => esc_html__( 'Premium Style 05', 'cmb2' ),
				'premium-style-06'   => esc_html__( 'Premium Style 06', 'cmb2' ),
				'premium-style-07'   => esc_html__( 'Premium Style 07', 'cmb2' ),
				'premium-style-08'   => esc_html__( 'Premium Style 08', 'cmb2' ),
				'premium-style-09'   => esc_html__( 'Premium Style 09', 'cmb2' ),
				'premium-style-10'   => esc_html__( 'Premium Style 10', 'cmb2' ),
				'premium-style-11'   => esc_html__( 'Premium Style 11', 'cmb2' ),
				'premium-style-12'   => esc_html__( 'Premium Style 12', 'cmb2' ),
				'premium-style-13'   => esc_html__( 'Premium Style 13', 'cmb2' ),
				'premium-style-14'   => esc_html__( 'Premium Style 14', 'cmb2' ),
				'premium-style-15'   => esc_html__( 'Premium Style 15', 'cmb2' ),
				'premium-style-16'   => esc_html__( 'Premium Style 16', 'cmb2' ),
				
			),
			'attributes' => array(
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => 'elegant',
		)
		
	) );
	
// Template for Image list
$cmb_group->add_field( array(
		'name'             => esc_html__('Simple Templates'),
		'desc'    => esc_html__( '', 'cmb2' ),
		'id'               => 'qcld_sl_template_image',
		'type'             => 'select',
		'show_option_none' => true,
		    'default'          => '',
			'options'          => array(
				'image-template-one' => esc_html__( 'Image Template One', 'cmb2' ),
				'image-template-two'   => esc_html__( 'Image Template Two', 'cmb2' ),
				'image-template-three'   => esc_html__( 'Image Template Three', 'cmb2' ),
				'image-template-four'   => esc_html__( 'Image Template Four', 'cmb2' ),
				'image-template-five'   => esc_html__( 'Image Template Five', 'cmb2' ),
				
			),
		'attributes' => array(
			'required'               => true, // Will be required only if visible.
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => 'imagelist',
		)
		
	) );
//Template for iList
$cmb_group->add_field( array(
		'name'             => esc_html__('Simple Templates'),
		'desc'    => esc_html__( '', 'cmb2' ),
		'id'               => 'qcld_sl_template_text',
		'type'             => 'select',
		'show_option_none' => true,
		'default'		   => '',
		'options'          => array(
			'simple-list-one'          => esc_html__('Simple List Template One'),
			'simple-list-two'          => esc_html__('Simple List Template Two'),
			'simple-list-three'          => esc_html__('Simple List Template Three'),
			'simple-list-four'          => esc_html__('Simple List Template Four'),
			'infographic-template-five'   => esc_html__('Simple List Template Five'),
			'simple-list-six'   => esc_html__('Simple List Template Six'),
			
			
		),
		'attributes' => array(
			'required'               => true, // Will be required only if visible.
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => 'textlist',
		)
		
	) );
//Template for Elegant List
$cmb_group->add_field( array(
		'name'             => esc_html__('Simple Templates'),
		'desc'    => esc_html__( '', 'cmb2' ),
		'id'               => 'qcld_sl_template_mix',
		'type'             => 'select',
		'show_option_none' => true,
		'default'		   => '',
		'options'          => array(
			
			'infographic-template-one'   => esc_html__('Infographic Template One'),
			'infographic-template-two'          => esc_html__('Infographic Template Two'),
			'infographic-template-three'          => esc_html__('Infographic Template Three'),
			'infographic-template-four'   => esc_html__('Infographic Template Four'),
			'infographic-template-five'   => esc_html__('Infographic Template Five'),
			'infographic-template-six'   => esc_html__('Infographic Template Six'),
			'infographic-template-seven'   => esc_html__('Infographic Template Seven'),
			'infographic-template-eight'   => esc_html__('Infographic Template Eight'),
			'infographic-template-nine'   => esc_html__('Infographic Template Nine'),
			'infographic-template-ten'   => esc_html__('Infographic Template Ten'),
			'infographic-template-eleven'   => esc_html__('Infographic Template Eleven'),
			'infographic-template-twelve'   => esc_html__('Infographic Template Twelve'),
			'infographic-template-thirteen'   => esc_html__('Infographic Template Thirteen'),
		),
		'attributes' => array(
			'required'               => true, // Will be required only if visible.
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => 'elegant',
		)
		
	) );
*/


//code for image list
$cmb_group->add_field( array(
		'name'             => esc_html__('Choose Template'),
		'desc'    => esc_html__( '', 'cmb2' ),
		'id'               => 'qcld_sl_template_image',
		'type'             => 'text',
		
		'attributes' => array(
			'required'               => true, // Will be required only if visible.
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => 'imagelist',
		)
		
	) );
//Code for text List
$cmb_group->add_field( array(
		'name'             => esc_html__('Choose Template'),
		'desc'    => esc_html__( '', 'cmb2' ),
		'id'               => 'qcld_sl_template_text',
		'type'             => 'text',
		'attributes' => array(
			'required'               => true, // Will be required only if visible.
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => 'textlist',
		)
		
	) );
//code for Elegant List
$cmb_group->add_field( array(
		'name'             => esc_html__('Choose Template'),
		'desc'    => esc_html__( '', 'cmb2' ),
		'id'               => 'qcld_sl_template_mix',
		'type'             => 'text',
		'attributes' => array(
			'required'               => true, // Will be required only if visible.
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => 'elegant',
		)
		
	) );

	
//creating chart for ilist
$chartfield1 = $cmb_group->add_field( array(
    'name'    => 'Create iList Chart',
    'id'      => 'ilist_chart',
    'type'    => 'text',
    

) );
//display position
$chartfield2 = $cmb_group->add_field( array(
		'name'    => __( 'Show Chart On', 'cmb2' ),
		'id'      => 'show_chart_position',
		'type'    => 'radio_inline',
		'options' => array(
			'top' => __( 'Top', 'cmb2' ),
			'bottom' => __( 'Bottom', 'cmb2' ),
		),
		'default' => 'top',
		
	) );
//END of template Part-->
// Code start for Group field
	$group_field_id = $cmb_group->add_field( array(
		'id'          => 'qcld_text_group',
		'type'        => 'group',
		'description' => esc_html__( 'Create Text List Elements', 'cmb2' ),
		'options'     => array(
			'group_title'   => esc_html__( 'Entry {#}', 'cmb2' ), // {#} gets replaced by row number
			'add_button'    => esc_html__( 'Add Another Entry', 'cmb2' ),
			'remove_button' => esc_html__( 'Remove Entry', 'cmb2' ),
			'sortable'      => true, // beta
			
		),
	) );

// Group Title
	$cmb_group->add_group_field( $group_field_id, array(
		'name'       => esc_html__( 'Entry Title', 'cmb2' ),
		'id'         => 'qcld_text_title',
		'type'       => 'text',
		
	) );
// Counter	
	$cmb_group->add_group_field( $group_field_id, array(
		'name'       => esc_html__( 'Meta ID', 'cmb2' ),
		'id'         => 'qcld_counter',
		'type'       => 'text',
		'default'	=>'1',
		'classes' => 'counter-class'
		
	) );

	$cmb_group->add_group_field( $group_field_id, array(
		'name' => esc_html__( 'thumbs up', 'cmb2' ),
		'id'   => 'sl_thumbs_up',
		'type' => 'text',
		'classes' => 'counter-class'
	) );
	$cmb_group->add_group_field( $group_field_id, array(
		'name' => esc_html__( 'thumbs user', 'cmb2' ),
		'id'   => 'sl_thumbs_up_user',
		'type' => 'text',
		'classes' => 'counter-class'
	) );

/*
	Description field with wysiwyg Editor
	It will be visible only for Simple and Elegant List
*/
	$cmb_group->add_group_field( $group_field_id, array(
		'name'        => esc_html__( 'Description', 'cmb2' ),
		'description' => esc_html__( 'Write a short description for this entry', 'cmb2' ),
		'id'          => 'qcld_text_desc',
		'type'    => 'textarea_small',
		'attributes' => array(
			
			'rows'    => '2',
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => wp_json_encode( array( 'textlist', 'elegant', 'imagelist' ) ),
		),




	) );
	/*$cmb_group->add_group_field( $group_field_id, array(
		'name'        => 'Long Description <span style="color:red;font-size:12px">(pro)</span>',
		'description' => esc_html__( 'This field is optional. If you write a long description for this entry that will display in a lightbox when clicked in the pro version.', 'cmb2' ),
		'id'          => 'qcld_text_long_desc',
		'type'    => 'textarea_small',
		

	) );*/

	/*$cmb_group->add_group_field( $group_field_id, array(
		'name'       => 'Entry Background Color <span style="color:red;font-size:12px">(pro)</span>',
		'id'         => 'qcld_entrybg_color',
		'type'       => 'colorpicker',
		
	) );*/
	
	/*$cmb_group->add_group_field( $group_field_id, array(
		'name' => 'Font Awesome Icon <span style="color:red;font-size:12px">(pro)</span>',
		'id'   => 'qcld_text_image_fa',
		
		'type' => 'text_medium',
		'classes' => 'ilist_fa_icon',
		'attributes' => array(
			
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => wp_json_encode( array( 'textlist', 'elegant' ) ),
		)
	) );
	*/
	/*$cmb_group->add_group_field( $group_field_id, array(
		'name' => 'Progress Bar <span style="color:red;font-size:12px">(pro)</span>',
		'id'   => 'qcld_progress_bar',
		'description' => esc_html__( 'Supported Value integer Ex: 50', 'cmb2' ),
		'type' => 'text_medium',
		'attributes' => array(
			
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => wp_json_encode( array( 'textlist', 'elegant' ) ),
		)
	) );
	*/
/*
	Image Uploader
	It will be visible only for Image and Elegant List
*/
	$cmb_group->add_group_field( $group_field_id, array(
		'name' => esc_html__( 'Image', 'cmb2' ),
		'id'   => 'qcld_text_image',
		'type' => 'file',
		'repeatable' => true,
		'attributes' => array(
			
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => wp_json_encode( array( 'imagelist', 'elegant' ) ),
		)
	) );
	
	/*$cmb_group->add_group_field( $group_field_id, array(
		'name' => 'Image Link <span style="color:red;font-size:12px">(pro)</span>',
		'id'   => 'qcld_image_link',
		'description' => esc_html__( '', 'cmb2' ),
		'type' => 'text',
		'attributes' => array(
			
			'data-conditional-id'    => 'post_type_radio_sl',
			'data-conditional-value' => wp_json_encode( array( 'textlist', 'elegant' ) ),
		)
	) );*/
}
//End of repeatable group field metabox.-->

// <--Taxonomie Filter
// function qcilist_pippin_add_taxonomy_filters() {
// 	global $typenow;
 
// 	// an array of all the taxonomyies you want to display. Use the taxonomy name or slug
// 	$taxonomies = array('sl_cat');
 
// 	// must set this to the post type you want the filter(s) displayed on
// 	if( $typenow == 'ilist' ){
 
// 		foreach ($taxonomies as $tax_slug) {
// 			$tax_obj = get_taxonomy($tax_slug);
			
// 			$tax_name = $tax_obj->labels->name;
// 			$terms = get_terms($tax_slug);
			
// 			if(count($terms) > 0) {
// 				echo "<select name='$tax_slug' id='$tax_slug' class='postform'>";
// 				echo "<option value=''>Show All $tax_name</option>";
// 				foreach ($terms as $term) { 
// 					echo '<option value='. $term->slug.'>' . esc_html__($term->name) .' (' . $term->count .')</option>'; 
// 				}
// 				echo "</select>";
// 			}
// 		}
// 	}
// }
// add_action( 'restrict_manage_posts', 'qcilist_pippin_add_taxonomy_filters' );
// End of Taxonomie Filter-->


//Custom Columns for Directory Listing
function qcilist_text_list_column_head($defaults) {

    $new_columns['cb'] = '<input type="checkbox" />';
    $new_columns['title'] = __('Title');

    $new_columns['qcld_item_text_count'] = 'Number of Elements';
    $new_columns['shortcode_text_col'] = 'Shortcode';

    $new_columns['date'] = __('Date');

    return $new_columns;
}
 
//Custom Columns Data for Backend Listing
function qcilist_list_text_columns_content($column_name, $post_ID) {
    

    if ($column_name == 'qcld_item_text_count') {
        $cntpost = get_post_meta( $post_ID, 'qcld_text_group' );
		if(isset($cntpost[0]) && is_array($cntpost[0])){
			echo count($cntpost[0]);
		}else{
			echo '0';
		}
    }

    if ($column_name == 'shortcode_text_col') {
        echo esc_html__('[qcld-ilist mode="one" list_id="'.$post_ID.'"]');
    }
}

add_filter('manage_ilist_posts_columns', 'qcilist_text_list_column_head');
add_action('manage_ilist_posts_custom_column', 'qcilist_list_text_columns_content', 10, 2);


/*TinyMCE button for Inserting Shortcode*/
/* Add Slider Shortcode Button on Post Visual Editor */
function qcilist_tinymce_button_function() {
	add_filter ("mce_external_plugins", "qcilist_sld_btn_js");
	add_filter ("mce_buttons", "qcilist_sld_btn");
}

function qcilist_sld_btn_js($plugin_array) {
	$plugin_array['ilist_short_btn'] = plugins_url('assets/js/qcld-tinymce-button.js', __FILE__);
	return $plugin_array;
}

function qcilist_sld_btn($buttons) {
	array_push ($buttons, 'ilist_short_btn');
	return $buttons;
}

add_action ('init', 'qcilist_tinymce_button_function'); 
function qcilist_get_file_path(){
?>
<div id="ilist_path" data-path="<?php echo QCOPD_ASSETS_URL1; ?>"></div>
<?php
}
add_action ('admin_footer', 'qcilist_get_file_path'); 




function qcilist_add_custom_meta_box()
{
    add_meta_box("qcilist-meta-box", "Preview Box", "qcilist_custom_meta_box_markup", "ilist", "side");
}

add_action("add_meta_boxes", "qcilist_add_custom_meta_box");


function qcilist_custom_meta_box_markup($object)
{

    ?>
        <div>
           <!--  <label for="meta-box-text"> <?php esc_html_e('iList Item '); ?></label> -->
            <br>
            <?php if(isset($object->ID) && !empty($object->ID )): ?>
            <a class="ilist-fancybox-show" post-id="<?php echo esc_attr($object->ID); ?>" href="#"><?php esc_html_e('Save & Preview'); ?></a>
            <br>
            <p><?php esc_html_e('You can also save as Image from the preview in the Pro version.'); ?></p>

            <a style="display: none" href="<?php echo site_url(); ?>/embed-ilist/?order=ASC&mode=one&list_id=<?php echo esc_attr($object->ID); ?>&column=1&upvote=on&capture=true" data-fancybox-type="iframe" class="fancyboxIframe"><?php esc_html_e('Save & Preview'); ?></a>
        	<?php endif; ?>

        </div>

    <?php  
}

function qcilist_shortcode_add_custom_meta_box()
{
    add_meta_box("qcilist-shortcode-meta-box", "Shortcode", "qcilist_shortcode_custom_meta_box_markup", "ilist", "side");
}

add_action("add_meta_boxes", "qcilist_shortcode_add_custom_meta_box");


function qcilist_shortcode_custom_meta_box_markup($object)
{

    ?>
        <div>
            <?php 

	            if(isset($object->ID) && !empty($object->ID) && ( isset($_GET['action']) && $_GET['action'] == 'edit')): 

				    $shortcode_column = get_post_meta( $object->ID, 'shortcode_column' );
				    $shortcode_disable_lightbox = get_post_meta( $object->ID, 'shortcode_disable_lightbox' );
				    $shortcode_upvote = get_post_meta( $object->ID, 'shortcode_upvote' );

	            	$qcld_ilist_shortcode =  '[qcld-ilist mode="one" list_id="'.esc_attr($object->ID).'"  column="'.esc_attr($shortcode_column[0]).'" upvote="'.esc_attr($shortcode_upvote[0]).'" disable_lightbox="'.esc_attr($shortcode_disable_lightbox[0]).'"]  <br> <p> '.esc_html('You can also use the iList Shortcode Generator in your page for additional options.').' </p>'; 
					echo $qcld_ilist_shortcode;
				elseif(isset($object->ID) && !empty($object->ID)):
					$qcld_ilist_shortcode =  '[qcld-ilist mode="one" list_id="'.esc_attr($object->ID).'"  column="2" upvote="on" disable_lightbox="true"]  <br> <p> '.esc_html('You can also use the iList Shortcode Generator in your page for additional options.').' </p>'; 
					echo $qcld_ilist_shortcode;
	            
	        	endif; 

        	?>

        </div>

    <?php  
}




function qcilist_noted_add_custom_meta_box()
{
    add_meta_box("qcilist-noted-meta-box", "Note Box", "qcilist_noted_custom_meta_box_markup", "ilist", "side");
}

add_action("add_meta_boxes", "qcilist_noted_add_custom_meta_box");


function qcilist_noted_custom_meta_box_markup($object)
{

    ?>
        <div>
            <?php if(isset($object->ID) && !empty($object->ID )): 

            	$qcld_ilist_shortcode =  "<p style='color:indianred'>".esc_html("NB: iLists must be published before you add the shortcode to a page. iLists won't display on your page if it is in Draft mode. Don't worry, your iLists won't show until you add the shortcode to a page or post.")."</p>"; 
				echo $qcld_ilist_shortcode;
            
        	endif; ?>

        </div>


    <?php  
}



/***************************************
 * custom post edit by ajax...
 ***************************************/

function qcilist_custom_post_type_xhr(){
    global $post;
    if(isset($post->post_type) && ('ilist' === $post->post_type) ){
        $post_url = admin_url('post.php'); #In case we're on post-new.php
        echo "
        <script>
            jQuery(document).ready(function($){
                //Click handler - you might have to bind this click event another way
                $('a.ilist-fancybox-show').click(function(){

                    //Post to post.php
                    var postURL = '$post_url';

                    //Collate all post form data
                    var data = $('form#post').serializeArray();

                    //Set a trigger for our save_post action
                    data.push({foo_doing_ajax: true});

                    //The XHR Goodness
                    $.post(postURL, data, function(response){
                       
                    });
                    return false;
                });
            });
        </script>";
    }
}
add_action('admin_head-post.php', 'qcilist_custom_post_type_xhr');
add_action('admin_head-post-new.php', 'qcilist_custom_post_type_xhr');

add_action('save_post', 'qcilist_save_my_custom_post_type');
function qcilist_save_my_custom_post_type($post_id){
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

    global $post;
    if(isset($post->post_type) && ('ilist' === $post->post_type) ){

    #If this is your post type
    //if( isset($_POST['post_type']) && ('ilist' === $_POST['post_type'])){
        //Save any post meta here

        #We conditionally exit so we don't return the full wp-admin load if foo_doing_ajax is true
        if(isset($_POST['foo_doing_ajax']) && $_POST['foo_doing_ajax'] === true){
            header('Content-type: application/json');
            #Send a response
            echo json_encode(array('success' => true));
            exit;
            #You should keep this conditional to degrade gracefully for no JS
        }
    }
}



add_action('wp_ajax_ilist_embaded_list_url_info', 'ilist_embaded_list_url_info');
add_action('wp_ajax_nopriv_ilist_embaded_list_url_info', 'ilist_embaded_list_url_info');

function ilist_embaded_list_url_info()
{

	check_ajax_referer( 'qcld-ilist', 'security');

    $post_id  = sanitize_text_field($_POST['post_id']);

    $shortcode_column = get_post_meta( $post_id, 'shortcode_column' );
    $shortcode_disable_lightbox = get_post_meta( $post_id, 'shortcode_disable_lightbox' );
    $shortcode_upvote = get_post_meta( $post_id, 'shortcode_upvote' );

    $embaded_url = site_url()."/embed-ilist/?order=ASC&mode=one&list_id=".esc_attr($post_id)."&column=".$shortcode_column[0]."&upvote=".$shortcode_upvote[0]."&capture=true";

    $shortcode_generate = '[qcld-ilist mode="one" list_id="'.esc_attr($post_id).'" column="'.$shortcode_column[0].'"  upvote="'.$shortcode_upvote[0].'" disable_lightbox="'.$shortcode_disable_lightbox[0].'" ]' .'<br>'. '<p> '.esc_html('You can also use the iList Shortcode Generator in your page for additional options.').' </p>' ;


     wp_reset_query();
    $response = array(
        'html' => $embaded_url,
        'short_code' => $shortcode_generate,
    );
    echo wp_send_json($response);
    wp_die();

}