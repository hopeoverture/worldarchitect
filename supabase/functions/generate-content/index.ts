const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your Supabase Edge Function environment variables.',
          details: 'Missing OPENAI_API_KEY environment variable'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    console.log('Generation request:', { type, data })

    let prompt = ''
    let maxTokens = 150

    switch (type) {
      case 'world_name':
        prompt = `Generate a fantasy world name based on these characteristics:
        - Tone: ${data.tone}
        - Magic Level: ${data.magic_level}
        - Tech Level: ${data.tech_level}
        
        Return only the world name, nothing else.`
        maxTokens = 50
        break

      case 'world_description':
        prompt = `Create a compelling world description based on these characteristics:
        - Tone: ${data.tone}
        - Magic Level: ${data.magic_level}
        - Tech Level: ${data.tech_level}
        - Authority Structure: ${data.authority_structure?.join(', ')}
        - Daily Life Pressures: ${data.daily_life_pressures?.join(', ')}
        
        Write a 2-3 sentence description that captures the essence of this world and will serve as context for generating world components.`
        maxTokens = 200
        break

      case 'region_description':
        prompt = `Create a detailed description for a fantasy region with these details:
        - Region Name: ${data.name}
        - Primary Terrain: ${data.primary_terrain}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write a compelling 2-3 sentence description that brings this region to life, including its atmosphere, notable features, and what makes it unique.`
        maxTokens = 200
        break

      case 'government_leadership':
        prompt = `Describe the leadership structure for this government:
        - Government Name: ${data.name}
        - Government Type: ${data.government_type}
        - Linked Region: ${data.linked_region || 'None'}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 1-2 sentences describing who leads this government and how the leadership is structured.`
        maxTokens = 150
        break

      case 'government_description':
        prompt = `Create a description for this government:
        - Government Name: ${data.name}
        - Government Type: ${data.government_type}
        - Linked Region: ${data.linked_region || 'None'}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 2-3 sentences describing how this government operates, its culture, laws, and relationship with its people.`
        maxTokens = 200
        break

      case 'character_description':
        prompt = `Create a character description with these details:
        - Character Name: ${data.name}
        - Race: ${data.race || 'unknown'}
        - Class/Profession: ${data.class_profession || 'unknown'}
        - Alignment: ${data.alignment || 'unknown'}
        - Linked Settlement: ${data.linked_settlement || 'None'}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - Role: ${data.role || 'unknown'}
        - World Context: ${data.world_context}
        
        Write 2-3 sentences describing this character's appearance, personality, background, and what makes them memorable.`
        maxTokens = 200
        break

      case 'geographical_description':
        prompt = `Create a description for this geographical feature:
        - Feature Name: ${data.name}
        - Feature Type: ${data.feature_type}
        - Linked Region: ${data.linked_region || 'None'}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 2-3 sentences describing this geographical feature's appearance, significance, unique characteristics, and how it fits into the world.`
        maxTokens = 200
        break

      case 'site_description':
        prompt = `Create a description for this site:
        - Site Name: ${data.name}
        - Site Type: ${data.site_type}
        - Linked Settlement: ${data.linked_settlement || 'None'}
        - Linked Region: ${data.linked_region || 'None'}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 2-3 sentences describing this site's purpose, appearance, atmosphere, notable features, and what makes it special or important.`
        maxTokens = 200
        break

      case 'adventure_description':
        prompt = `Create a description for this adventure:
        - Adventure Name: ${data.name}
        - Difficulty: ${data.difficulty}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 2-3 sentences describing this adventure's setting, plot, atmosphere, and what makes it exciting and memorable.`
        maxTokens = 200
        break

      case 'adventure_objectives':
        prompt = `Create objectives for this adventure:
        - Adventure Name: ${data.name}
        - Difficulty: ${data.difficulty}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 2-3 clear, specific objectives that players need to complete. Make them appropriate for the ${data.difficulty} difficulty level.`
        maxTokens = 150
        break

      case 'adventure_rewards':
        prompt = `Create rewards for this adventure:
        - Adventure Name: ${data.name}
        - Difficulty: ${data.difficulty}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 1-2 sentences describing appropriate rewards for completing this ${data.difficulty} difficulty adventure. Include experience, treasure, or story rewards.`
        maxTokens = 150
        break

      case 'history_description':
        prompt = `Create a historical description for this event:
        - Event Title: ${data.title}
        - Era: ${data.era || 'unknown era'}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 3-4 sentences describing this historical event, its causes, consequences, and significance to the world. Make it feel like an important moment in history.`
        maxTokens = 250
        break

      case 'monster_description':
        prompt = `Create a description for this monster:
        - Monster Name: ${data.name}
        - Monster Type: ${data.monster_type}
        - Challenge Rating: ${data.challenge_rating}
        - Habitat: ${data.habitat || 'unknown'}
        - Linked Region: ${data.linked_region || 'None'}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 2-3 sentences describing this monster's appearance, behavior, lore, and what makes it dangerous or unique. Make it appropriate for CR ${data.challenge_rating}.`
        maxTokens = 200
        break

      case 'monster_abilities':
        prompt = `Create abilities and powers for this monster:
        - Monster Name: ${data.name}
        - Monster Type: ${data.monster_type}
        - Challenge Rating: ${data.challenge_rating}
        - Habitat: ${data.habitat || 'unknown'}
        - Linked Region: ${data.linked_region || 'None'}
        - Linked Components: ${data.linked_components?.length ? data.linked_components.join(', ') : 'None'}
        - World Context: ${data.world_context}
        
        Write 2-3 sentences describing special abilities, attacks, and powers this monster possesses. Make them appropriate for CR ${data.challenge_rating} and the ${data.monster_type} type.`
        maxTokens = 200
        break

      default:
        throw new Error(`Invalid generation type: ${type}`)
    }

    console.log('Sending request to OpenAI with prompt:', prompt)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative fantasy world-building assistant. Generate immersive, detailed content that fits the given parameters.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${response.status}`,
          details: errorText
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    const result = await response.json()
    console.log('OpenAI response:', result)

    const generatedContent = result.choices[0]?.message?.content?.trim()

    if (!generatedContent) {
      console.error('No content generated from OpenAI')
      return new Response(
        JSON.stringify({ 
          error: 'No content generated from OpenAI',
          details: 'OpenAI returned empty content'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    console.log('Generated content:', generatedContent)

    return new Response(
      JSON.stringify({ content: generatedContent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in generate-content function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : String(error)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})