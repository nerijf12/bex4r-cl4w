<?php

//Setting options page
/*******************************
 * Callback function to add the menu
 *******************************/
function ilist_show_settngs_page_callback_func()
{
	add_submenu_page(
		'edit.php?post_type=ilist',
		'Settings',
		'Settings',
		'manage_options',
		'ilist_settings',
		'qc_ilist_settings_page_callback_func'
	);
	add_action( 'admin_init', 'ilist_register_plugin_settings' );
} //show_settings_page_callback_func
add_action( 'admin_menu', 'ilist_show_settngs_page_callback_func');

function ilist_register_plugin_settings() {
	//register our settings
	//general Section
	register_setting( 'qc-ilist-plugin-settings-group', 'sl_enable_rtl' );
	register_setting( 'qc-ilist-plugin-settings-group', 'sl_enable_embed_list' );
	register_setting( 'qc-ilist-plugin-settings-group', 'sl_embed_title' );
	register_setting( 'qc-ilist-plugin-settings-group', 'sl_embed_link' );

	//Language Settings
	register_setting( 'qc-ilist-plugin-settings-group', 'ilist_lan_share_list' );

	//custom css section
	register_setting( 'qc-ilist-plugin-settings-group', 'sl_custom_style' );

	
}

function qc_ilist_settings_page_callback_func(){
	
	?>
	<div class="wrap swpm-admin-menu-wrap">
		<h1>iList Settings Page</h1>
	
		<h2 class="nav-tab-wrapper ilist_nav_container">
			<a class="nav-tab ilist_click_handle nav-tab-active" href="#general_settings">General Settings</a>
			<a class="nav-tab ilist_click_handle" href="#language_settings">Language Settings</a>
			<a class="nav-tab ilist_click_handle" href="#custom_css">Custom Css</a>

			<a class="nav-tab ilist_click_handle" href="#help">Help</a>
		</h2>
		
		<form method="post" action="options.php">
			<?php settings_fields( 'qc-ilist-plugin-settings-group' ); ?>
			<?php do_settings_sections( 'qc-ilist-plugin-settings-group' ); ?>
			<div id="general_settings">
				<table class="form-table">
				
					
				
					<tr valign="top">
						<th scope="row">Enable RTL Direction</th>
						<td>
							<input type="checkbox" name="sl_enable_rtl" value="on" <?php echo (esc_attr( get_option('sl_enable_rtl') )=='on'?'checked="checked"':''); ?> />
							<i>If you make this option ON, then list heading and list items will be arranged in Right-to-Left direction.</i>
						</td>
					</tr>
					
					<tr valign="top">
						<th scope="row">Enable embed List button on listing pages</th>
						<td>
							<input type="checkbox" name="sl_enable_embed_list" value="on" <?php echo (esc_attr( get_option('sl_enable_embed_list') )=='on'?'checked="checked"':''); ?> />
							<i>Enable embed link button to generate iFrame embed code for particular list.</i>
						</td>
					</tr>

					
					
					<tr valign="top">
						<th scope="row">Title for Embed option</th>
						<td>
							<input type="text" name="sl_embed_title" size="100" value="<?php echo esc_attr( get_option('sl_embed_title') ); ?>"  />
							<i>Credit title displayed in embed option.</i>
						</td>
					</tr>
					
					<tr valign="top">
						<th scope="row">Link for Embed option</th>
						<td>
							<input type="text" name="sl_embed_link" size="100" value="<?php echo esc_attr( get_option('sl_embed_link') ); ?>"  />
							<i>Credit link displayed in embed option.</i>
						</td>
					</tr>
					 

				</table>
			</div>
			
			<div id="language_settings" style="display:none">
				<table class="form-table">

					<tr valign="top">
						<th scope="row">Generate Embed Code</th>
						<td>
							<input type="text" name="ilist_lan_share_list" size="100" value="<?php echo esc_attr( get_option('ilist_lan_share_list') ); ?>"  />
							<i>Change the language for Generate Embed Code</i>
						</td>
					</tr>
					

				</table>
			</div>
			
			<div id="custom_css" style="display:none">
				<table class="form-table">

					<tr valign="top">
						<th scope="row">Custom Css</th>
						<td>
							
							<textarea name="sl_custom_style" rows="10" cols="100"><?php echo esc_attr( get_option('sl_custom_style') ); ?></textarea>
							<i>Write your custom CSS here. Please do not use <b>style</b> tag in this textarea.</i>
						</td>
					</tr>

				</table>
			</div>
			
			<div id="help" style="display:none">
				<table class="form-table">

					<tr valign="top">
						<th scope="row">Help</th>
						<td>
							<div>
							
							<h1>Welcome to the Infographic Maker - iList! You are <strong>awesome</strong>, by the way <img draggable="false" class="emoji" alt="🙂" src="<?php echo QCOPD_IMG_URL1; ?>/1f642.svg"></h1>
							<h3>Getting Started</h3>
															
							<p>In principle, an infographic is a List created with three building blocks – Texts, Images and Charts laid out in a visually impressive manner to convey a specific idea that anyone can easily grasp. iList lets you make Lists with Images, Texts, and Charts (pro feature). </p>

							<p>With that in mind you should start with the following simple steps.</p>
							<br>
							<p><b>Step 1: Go to our Infographic Maker iList and Press on that New iList button. </b></p>
							<br>
							<p><b>Step 2: Begin by giving your infographic a Title. Preferably a catchy one to grab user’s interest. In the next row, we have three options –  Info Lists, Graphic Lists, and Infographics. Infographics is selected by default – so nothing needs to be done there.</b></p>
							<br>
							<p><b>Step 3: Next, you can select a template for your InfoGraphic from a lightbox window which shows a preview of all the available templates. Click on the template you want to start with. Don’t worry. You can change it later. Anytime!. </b></p>
							<br>
							<p><b>Step 4: Now comes the fun part. You can now start adding your bullet points for the Lists. Each bullet point or list items can have a Title Text, Description Text, and Image (or Icon).</b></p>
							<br>
							<p><b>Step 5: The final step is to publish your infographic on a page or post. This is done with a shortcode and the easiest way is to use the Shortcode Generator. After you generated the ShortCode, simply paste it exactly where you want the Infographic to show up.</b></p>
							<br>
							
							<p style="color:red"><b>NB:</b> iLists must be published before you add the shortcode to a page. iLists won't display on your page if it is in Draft mode. Don't worry, your iLists won't show until you add the shortcode to a page or post.</p>
							<br>
							<p>That’s it! The above steps are for the basic usages. There are a lot of advanced options and tons more templates available with the <a href="https://www.quantumcloud.com/products/infographic-maker-ilist/" target="_blank">Professional version</a> if you ever feel the need. If you had any specific questions about how something works, do not hesitate to contact us from the <a href="<?php echo get_site_url().'/wp-admin/edit.php?post_type=ilist&page=qcpro-promo-page-ilist-free-page-123za'; ?>">Support Page</a>. <img draggable="false" class="emoji" alt="🙂" src="<?php echo QCOPD_IMG_URL1; ?>/1f642.svg"></p>
															
							<p><strong><a href="https://www.quantumcloud.com/resources/make-infographics-ilist/" target="_blank">Check</a> This Article we Created for the Pro Version for More Details with Images and Screenshots</strong></p>
							
							
							<h3>Shortcode Generator</h3>
							
						<p>
						We encourage you to use the ShortCode generator found in the toolbar of your page/post editor in visual mode.</p> 
						
						<img src="<?php echo QCOPD_IMG_URL1; ?>/classic.jpg" alt="shortcode generator" />
						
						<p>See sample below for where to find it for Gutenberg.</p>

						<img src="<?php echo QCOPD_IMG_URL1; ?>/gutenburg.jpg" alt="shortcode generator" />						
						<img src="<?php echo QCOPD_IMG_URL1; ?>/gutenburg2.jpg" alt="shortcode generator" />	<p>This is how the shortcode generator will look like.</p>				
						<img src="<?php echo QCOPD_IMG_URL1; ?>/shortcode-generator1.jpg" alt="shortcode generator" />								
							
							
							<!--<p>
We encourage you to use the ShortCode generator found in the toolbar of your page/post editor in visual mode. See sample below for where to find it</p><img src="<?php echo QCOPD_IMG_URL1; ?>/shortcode-generator.jpg" alt="shortcode generator" />
							<h3>Shortcode Generator</h3>-->
							
							<h3>Shortcode Example</h3>
							<p>
								
								[qcld-ilist mode="one" list_id="75"]
								<br>
								<br>
								<strong><u>Available Parameters:</u></strong>
								<br>
							</p>
							<p>
								<strong>1. mode</strong>
								<br>
								Value for this option can be set as "one" or "all".
								Example: mode="one"
							</p>
							<p>
								<strong>2. column</strong>
								<br>
								Avaialble values: "1", "2", "3".
								Example: column=1
							</p>

							<p>
								<strong>6. list_id</strong>
								<br>
								Only applicable if you want to display a single list [not all]. You can provide specific list id here as a value. You can also get ready shortcode for a single list under "Manage List Items" menu.
								Example: list_id="404"
							</p>
							
							<p>
								<strong>9. upvote</strong>
								<br>
								Values: on or off. This options allows upvoting of your list items.
								<br>
								Example: upvote="on"
							</p>

						</div>
							
						</td>
					</tr>

				</table>
			</div>
			
			<?php submit_button(); ?>

		</form>
		
	</div>
	
	<script type="text/javascript">
		

		
		jQuery(document).ready(function($){
			$('.ilist_click_handle').on('click', function(e){
				e.preventDefault();
				var obj = $(this);
				container_id = obj.attr('href');
				$('.ilist_click_handle').each(function(){
					$(this).removeClass('nav-tab-active');
					$($(this).attr('href')).hide();
				})
				obj.addClass('nav-tab-active');
				$(container_id).show();
			})
			var hash = window.location.hash;
			if(hash!=''){
				$('.ilist_click_handle').each(function(){
					
					$($(this).attr('href')).hide();
					if($(this).attr('href')==hash){
						$(this).removeClass('nav-tab-active').addClass('nav-tab-active');
					}else{
						$(this).removeClass('nav-tab-active');
					}
				})
				$(hash).show();
			}
			
		})
		
	</script>
	
	<?php
	
}